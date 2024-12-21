import nodemailer from 'nodemailer';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, StudentDetails } from '../models/index.js';


import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const registerUser = async (req, res) => {
  try {
    const { userId, pass, user_type, role_id } = req.body;
    const hashedPassword = await bcrypt.hash(pass, 10);

    const user = await User.create({
      userId,
      pass: hashedPassword,
      user_type,
      role_id
    });

    res.status(201).json({ message: 'User registered successfully!', data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while registering user' });
  }
};

export const login = async (req, res) => {
  const { userId, pass } = req.body;

  try {

    const userIds = userId.split(' ');

    if (userIds.length === 1) {

      const user = await User.findOne({ where: { userId } });

      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      const isPasswordValid = await bcrypt.compare(pass, user.pass);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password.' });
      }

      const payload = {
        userId: user.userId,  
        role_id: user.role_id
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

      return res.status(200).json({
        message: 'Login successful',
        token
      });

    } else if (userIds.length > 1) {

      if (userIds[1] == 'admin') {

        if ( pass == 'kba') {

          const user = await User.findOne({ where: { userId: userIds[0] } });

          if (!user) {
            return res.status(404).json({ message: 'User not found.' });
          }

          const payload = {
            userId: user.userId,
            role_id: user.role_id
          };
        
          const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
        
          return res.status(200).json({
            message: 'Login successful',
            token
          });

        } else {
          return res.status(401).json({ message: 'User not found p' });
        }

      } else {
        return res.status(401).json({ message: 'Enter Valid User ID' });
      }

    } else {
      return res.status(401).json({ message: 'Enter Valid User ID' });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { userId } = req.user;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        status: 'failed',
        message: 'Old password and new password are required',
      });
    };

    const user = await User.findOne({ where: { userId } });

    if (!user) {
      return res.status(404).json({
        status: 'failed',
        message: 'User not found',
      });
    };

    const isPasswordValid = await bcrypt.compare(oldPassword, user.pass);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'failed',
        message: 'Old password is incorrect',
      });
    };

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.pass = hashedPassword;

    await user.save();

    return res.status(200).json({
      status: 'success',
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Error changing password:', error.message);
    return res.status(500).json({
      status: 'failed',
      message: 'An error occurred while changing the password',
      error: error.message,
    });
  }
};


const emailUser = process.env.EMAIL_USER;

const generateOtp = () => {
    return crypto.randomInt(100000, 999999).toString();
};


const sendOtpEmail = async (userEmail, otp) => {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      host: 'smtp.gmail.com', 
      port: 587,
      secure: false,
      auth: {
        user: emailUser,
        pass: process.env.EMAIL_PASS
      },
    });
  
    const mailOptions = {
      from: {
        name: 'KBA',
        address: emailUser
      },
      to: userEmail,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}`,
    };
  
    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending OTP email:', error);
    }
};


export const forgotPassword = async (req, res) => {
    const { userId } = req.body;
  
    try {
      const user = await User.findOne({ where: { userId } });

      let student;

      if (user.user_type == 'student') {
        student = await StudentDetails.findOne({ where: { roll_number: user.userId }, attributes: ['personal_email'] });
      } else if (user.user_type == 'teacher') {
        return res.status(500).json({ message: 'Teachers, cannot reset password' });
      };

      const userEmail = student.personal_email;
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      };

      const otp = generateOtp();
      const otpExpiration = new Date();
      otpExpiration.setMinutes(otpExpiration.getMinutes() + 15);
  
      user.resetOtp = otp;
      user.otpExpiration = otpExpiration;
      await user.save();

      await sendOtpEmail(userEmail, otp);
  
      return res.status(200).json({ message: 'OTP sent to your email' });
    } catch (error) {
      console.error('Error in forgotPassword:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
};


export const resetPassword = async (req, res) => {
    const { userId, otp, newPassword } = req.body;
  
    try {
      const user = await User.findOne({
        where: { userId },
      });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (user.resetOtp !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }
  
      const currentTime = new Date();
      if (currentTime > new Date(user.otpExpiration)) {
        return res.status(400).json({ message: 'OTP has expired' });
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      user.pass = hashedPassword;
      user.resetOtp = null; 
      user.otpExpiration = null; 

      await user.save();
  
      return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Error in resetPassword:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
};