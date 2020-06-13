const Joi = require('@hapi/joi')

const registerSchema = Joi.object({
  name: Joi.string()
    .min(6)
    .required(),
  email: Joi.string()
    .min(6)
    .required()
    .email(),
  password: Joi.string()
    .min(6)
    .required()
})

const registerValidation = data => {
  return registerSchema.validate(data)
}

const loginSchema = Joi.object({
  email: Joi.string()
    .required()
    .email(),
  password: Joi.string()
    .min(6)
    .required()
})

const loginValidation = data => {
  return loginSchema.validate(data)
}

module.exports = { registerValidation, loginValidation }
