import joi from "joi";
export const tasks = {
  body: joi.object({
    title: joi.string().min(10).max(50).required(),
    description: joi.string().required(),
    status: joi.array().required().valid("toDo , doing , done"),
  }),
};
