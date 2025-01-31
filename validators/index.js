const Joi = require('joi');

const userSchema = Joi.object({
  _id: Joi.forbidden(),
  username: Joi.string().required().min(4).max(64),
  password: Joi.string().required().min(4).max(64),
});

module.exports = {
  userSchema,
};
