const Joi = require("joi");

const userSchema = Joi.object({
  firstName: Joi.string().min(2).required(),
  secondName: Joi.string().min(2).required(),
  age: Joi.number().required().required(),
  city: Joi.string().min(2).required(),
});
const idScheme = Joi.object({
  id: Joi.number().required(),
});

module.exports = { userSchema, idScheme };
