const Joi = require("joi");

//Validation for adding users
const validProfile = (_userObj) => {
  let schema = Joi.object({
    user: Joi.any(),
    glucose_type: Joi.string().min(2).max(50).required(),
    age: Joi.number().min(2).max(100).required(),
    weight: Joi.number().min(1).max(200).required(),
    sex: Joi.string(),
    pregnancy: Joi.boolean(),
    medications: Joi.array(),
    sediseasesx: Joi.array(),

    friends: Joi.array(),
    glucoses: Joi.array(),
    nutritions: Joi.array(),
    alerms: Joi.array(),
  })
  return schema.validate(_userObj);
}
exports.validProfile = validProfile;


const validEditProfile = (_userObj) => {
  let schema = Joi.object({
    user: Joi.any(),
    glucose_type: Joi.string().min(2).max(50),
    age: Joi.number().min(2).max(100),
    weight: Joi.number().min(1).max(200),
    sex: Joi.string(),
    pregnancy: Joi.boolean(),
    medications: Joi.array(),
    sediseasesx: Joi.array(),

    friends: Joi.array(),
    glucoses: Joi.array(),
    nutritions: Joi.array(),
    alerms: Joi.array(),
  })
  return schema.validate(_userObj);
}
exports.validEditProfile = validEditProfile;

