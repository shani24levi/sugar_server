const Joi = require("joi");

const validGlucoseLevels = (_glucoseObj) => {
  let schema = Joi.object({
    user: Joi.any(),
    returning_light_intensity: Joi.string().required(),
    concentration: Joi.number().required(),
    glucose_level: Joi.number().required(),
    type: Joi.string().required() //high, low, normal, pre-low , pre-high
  })
  return schema.validate(_glucoseObj);
}
exports.validGlucoseLevels = validGlucoseLevels;

  