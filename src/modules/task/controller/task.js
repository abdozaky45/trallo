import { Error } from "mongoose";
import userModel from "../../../../DB/model/userModel.js";
import { asynchandler } from "../../../utils/errorHandling.js";
import jwk from "jsonwebtoken";
import taskModel from "../../../../DB/model/taskModel.js";
// add task with status (toDo)(user must be logged in)
export const addTask = asynchandler(async (req, res, next) => {
 
  const { title, description, deadline, assignTo } = req.body;
  const checkUser = await userModel.findById({ _id: assignTo }); //{},null
  if (!checkUser) {
    return next(new Error("user not found", { cause: 404 }));
  }
  const tasks = await taskModel.create({
    title,
    description,
    deadline,
    assignTo,
  });
  return res.json({ Message: "inserted task", tasks });
});
//update task (title , description , status) and assign task to other user(user must be logged in) (creator only can update task)
export const updateTask = asynchandler(async (req, res, next) => {
  const { _id } = req.params;
  const { title, description, status } = req.body;
  const tasks = await taskModel.findOneAndUpdate(_id, {
    title,
    description,
    status,
  }); // null,{}
  return res.json({ Message: "updated task", tasks });
});
export const deleteTask = asynchandler(async (req, res, next) => {
  const { _id } = req.params;
  const deleted = await taskModel.findByIdAndDelete(_id, { new: true });
  return res.status(201).json({ Message: "deleted Do1" });
});
//4-get all tasks with user data
export const getAllTasks = asynchandler(async (req, res, next) => {
  const Tasks = await taskModel.find({});
  return res.json({ Message: "Done", Tasks });
});
//5--get all tasks of oneUser with user data
export const getAllTasksUser = asynchandler(async (req, res, next) => {
  const Tasks = await taskModel.find({}).populate([
    {
      path: "assignTo",
      select: "-_id -password",
    },
  ]);
  return res.json({ Message: "Done", Tasks });
});
//6-get all tasks of oneUser with user data
export const getAllTasksoneUser = asynchandler(async (req, res, next) => {
  const {id}=req.params;
  const Tasks = await taskModel.find({assignTo:id}).populate([
    {
      path: "assignTo",
      select: "-_id -password",
    },
  ]);
  return res.json({ Message: "Done", Tasks });
});