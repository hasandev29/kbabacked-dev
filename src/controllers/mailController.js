import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const emailUser = process.env.EMAIL_USER;

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
    auth: {
      user: emailUser,
      pass: process.env.EMAIL_PASS
  }
});

const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>KBA HTML</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f7f7f7;
          }
          .email-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          .email-header {
            background-color: #4CAF50;
            color: white;
            padding: 20px;
            text-align: center;
          }
          .email-header h1 {
            margin: 0;
            font-size: 24px;
          }
          .email-body {
            padding: 20px;
            color: #333;
            line-height: 1.6;
          }
          .email-footer {
            background-color: #f1f1f1;
            padding: 10px;
            text-align: center;
            font-size: 12px;
            color: #888;
          }
          .button {
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
            margin-top: 20px;
            font-weight: bold;
          }
          .button:hover {
            background-color: #45a049;
          }
          @media screen and (max-width: 600px) {
            .email-container {
              width: 100%;
              padding: 10px;
            }
            .email-header h1 {
              font-size: 20px;
            }
            .email-body {
              padding: 15px;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h1>Welcome to Our Service, Name</h1>
          </div>
          <div class="email-body">
            <p>Hello Kba,</p>
            <p>New Testing email</p>
            <p>To get started, click the button below to verify your email address and activate your account:</p>
            <a href="www.google.com" class="button" target="_blank">Activate My Account</a>
            <p>If you have any questions, feel free to reach out to us. We're here to help!</p>
            <p>Best regards,</p>
            <p><strong>Your Company Name</strong></p>
          </div>
          <div class="email-footer">
            <p>&copy; 2024 Your Company. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;



export const sendGmail = async (req, res) => {
  try {

    const mailOptions = {
      from: {
        name: req.body.name,
        address: emailUser
      },
      to: req.body.to,
      subject: req.body.subject,
      text: req.body.message,
      html: htmlContent, 
      cc: req.body.cc,
      bcc: req.body.bcc,
      priority: req.body.priority
    };
    
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (err) {
    console.error(err);
  }
};
