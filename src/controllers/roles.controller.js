import {Role} from '../models/index.js';

export const createRole = async (req, res) => {
  try {
    const { name, desc } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Role name is required' });
    }

    const existingRole = await Role.findOne({ where: { name } });
    if (existingRole) {
      return res.json({ message: 'Role already exists' });
    }

    const newRole = await Role.create({ name, desc });
    res.status(201).json({
      message: `${newRole.name} role created successfully!`,
      data: newRole
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'An error occurred while creating the role',
      error: error
    });
  }
};


export const bulkCreateRoles = async (req, res) => {
  try {
    const roles = req.body;

    if (!Array.isArray(roles) || roles.length === 0) {
      return res.status(400).json({ message: 'No roles provided' });
    }

    for (let role of roles) {
      if (!role.name) {
        return res.status(400).json({ message: 'Role name is required for all roles' });
      }

      const existingRole = await Role.findOne({ where: { name: role.name } });
      if (existingRole) {
        return res.status(400).json({ message: `'${role.name}' already exists` });
      }
    }

    const createdRoles = await Role.bulkCreate(roles);

    res.status(201).json({
      message: `${createdRoles.length} roles created successfully!`,
      data: createdRoles
    });
  } catch (error) {
    console.error('Error creating roles in bulk:', error);
    res.status(500).json({
      message: 'An error occurred while creating roles in bulk',
      error: error.message,
    });
  }
};

export const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.status(200).json({ message: `${roles.length} Roles fetched successfully!`, data: roles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching roles' });
  }
};

export const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);

    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    res.status(200).json({ message: 'Role fetched successfully!', data: role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching the role' });
  }
};

export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, desc } = req.body;

    const role = await Role.findByPk(id);

    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    if (name) role.name = name;
    if (desc) role.desc = desc;

    await role.save();

    res.status(200).json({
      message: "Role updated successfully!",
      data: role
    });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({
      message: 'An error occurred while updating the role',
      error: error.message,
    });
  }
};

export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findByPk(id);

    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    await role.destroy();

    res.status(200).json({ message: 'Role deleted successfully' });
  } catch (error) {
    console.error('Error deleting role:', error);
    res.status(500).json({
      message: 'An error occurred while deleting the role',
      error: error.message,
    });
  }
};
