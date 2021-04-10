const Joi = require("joi");
const jwt = require("jsonwebtoken");
const constants = require("../config/constants");
const { TOKEN } = constants;


//Creates a token for user permissions
const createToken = (_id, _email) => {
  let newToken = jwt.sign({ email: _email, _id: _id }, `${TOKEN}`, { expiresIn: "3000mins" });
  console.log(newToken)
  return newToken;
}
exports.createToken = createToken;


//Validation for adding users
const validUser = (_userObj) => {
  let schema = Joi.object({
    id: Joi.any(),
    user: Joi.string().min(2).max(50).required(),
    email: Joi.string().min(2).max(50).email().required(),
    pass: Joi.string().min(1).max(10).required(),
    rule: Joi.string(),
  })
  return schema.validate(_userObj);
}
exports.validUser = validUser;


//Validation for editing users
const validEditUser = (_userObj) => {
  let schema = Joi.object({
    user: Joi.string().min(2).max(10).required(),
    email: Joi.string().min(2).max(50).email().required()
  })
  return schema.validate(_userObj);
}
exports.validEditUser = validEditUser;


//Validation when user Login
const validLogin = (_userObj) => {
  let schema = Joi.object({
    email: Joi.string().min(2).max(50).email().required(),
    pass: Joi.string().min(1).max(10).required(),
  })
  return schema.validate(_userObj);
}
exports.validLogin = validLogin;