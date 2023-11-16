import joi from "joi";
export const signup = {
  body:joi
  .object({
    userName: joi.string().alphanum().min(3).max(25).required(),
    email: joi.string().email().required(),
    password: joi.string().pattern(RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
    cPassword: joi.string().valid(joi.ref("password")).required(),
    gender: joi.array().required().valid("male", "female"),
    phone: joi.string().min(11).max(11).required(),
  })
  .required()
}
export const login = {
  body:joi
  .object({
    email: joi
      .string()
      .email({
        minDomainSegments: 1,
        maxDomainSegments:3,
        tlds: { allow: ["com", "net","edu","eg",] },
      })
      .required(),
    password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  })
  .required()
}

