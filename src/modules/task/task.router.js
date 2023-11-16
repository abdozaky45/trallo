import { auth } from "../../middleware/authtication.js";
import * as messageController from "./controller/task.js";
import { Router } from "express";
import * as Validators from "./validation.js";
import { validation } from "../../middleware/validation.js";
const router = Router();
router.post("/tasks",auth,validation(Validators.tasks), messageController.addTask);
router.put("/update/:id",auth, messageController.updateTask);
router.delete("/delete/:_id",auth,messageController.deleteTask);
router.get("/getAll", messageController.getAllTasks);
router.get("/getAll", messageController.getAllTasksUser);
router.get("/getAll/:id", messageController.getAllTasksoneUser);
export default router;
