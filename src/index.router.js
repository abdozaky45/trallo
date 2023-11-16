import connectDB from "../DB/connectionDB.js";
import authRouter from "./modules/auth/auth.router.js";
import userRouter from "./modules/user/user.router.js";
import taskRouter from "./modules/task/task.router.js";
import { globalErrorHandling } from "./utils/errorHandling.js";
const bootStarp = (app, express) => {
  app.use(express.json());
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/task",taskRouter)
  app.use("*", (req, res, next) => {
    return res.json({ Message: "in-valid-Routing" });
  });
  app.use(globalErrorHandling);
  connectDB();
};
export default bootStarp;
