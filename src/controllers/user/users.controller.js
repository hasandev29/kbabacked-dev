import { User, Role } from '../../models/index.js';

export const getAllUsers = async (req, res) => {
    try {
      const users = await User.findAll({
        include: [{ model: Role }]
      });
      res.status(200).json({
        message: 'Fetched all users successfully!',
        data: users
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while fetching users' });
    }
  };
  
  export const getUser = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      res.status(200).json({
        message: 'Fetched user successfully!',
        data: user
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while fetching user' });
    }
  };
  
  export const getUserByUserId = async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findOne({ where: { userId } });
      res.status(200).json({
        message: 'Fetched user successfully!',
        data: user
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while fetching user' });
    }
  };
  
  export const updateUser = async (req, res) => {
    try {
      const { id } = req.params;
      const { userId, user_type, role_id, isActive, isVerified } = req.body;
  
      const user = await User.findByPk(id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (userId && userId !== user.userId) {
        const existingUser = await User.findOne({ where: { userId } });
  
        if (existingUser) {
          return res.status(400).json({ message: 'User ID already exists' });
        }
      }

      if (userId) user.userId = userId;
      if (user_type) user.user_type = user_type;
      if (role_id) user.role_id = role_id;
      if (isActive) user.isActive = isActive;
      if (isVerified) user.isVerified = isVerified;
  
      const updatedUser = await user.save();
  
      const { pass, ...userData } = updatedUser.toJSON();
  
      return res.status(200).json({ message: 'User updated successfully', data: userData });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error updating user', error: err.message });
    }
  };
  