const { UserRepo } = require('../repos/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * @type {import('express').RequestHandler}
 */
const authorize = async (req, res) => {
  const { login, password } = req.body;

  const user = await UserRepo.findUserByUsername(login);

  if (!user) {
    return res.sendStatus(500);
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ error: 'Authentication failed' });
  }

  const token = jwt.sign(user._id.toString(), process.env.JWT_SECRET_KEY);

  res.cookie('secureJWT', JSON.stringify(token), {
    maxAge: 36000000,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'lax',
  });

  res.sendStatus(200);
};

/**
 * @type {import('express').RequestHandler}
 */
const register = async (req, res) => {
  const { login, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const savedUser = await UserRepo.saveUser({
    username: login,
    password: hashedPassword,
  });

  if (!savedUser) {
    return res.sendStatus(500);
  }

  res.sendStatus(201);
};

/**
 * @type {import('express').RequestHandler}
 */
const updateTask = async (req, res, next) => {
  try {
    const { body, params } = req;
    const dto = await taskSchema.validateAsync(body, {
      stripUnknown: true,
      presence: 'required',
    });

    if (!params.id || !TaskRepo.validateObjectId(params.id)) {
      return res.sendStatus(400);
    }

    const updatedTask = await TaskRepo.updateTask(params.id, dto);

    if (!updatedTask) {
      return res.sendStatus(500);
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authorize,
  register,
};
