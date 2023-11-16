import { Schema, model, Types } from "mongoose";
const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    deadline: { type: Date, required: true },
    assignTo: {type: Types.ObjectId,
        required: true,
        ref: "User", },
    status: {
      type: String,
      default: "toDO",
      enumValues: ["toDo , doing , done"],
    },
  },
  { timestamps: true }
);
const taskModel = model("Task", taskSchema);
export default taskModel;
