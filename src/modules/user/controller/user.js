import userModel from "../../../../DB/model/userModel.js";
import { asynchandler } from "../../../utils/errorHandling.js";
import bcrypt from "bcrypt";
export const changePassword = asynchandler(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const matchPassword = bcrypt.compareSync(oldPassword, req.user.password);
  if (!matchPassword) {
    return next(new Error("Error in password", { cause: 400 }));
  }
  if (newPassword != confirmPassword) {
    return next(
      new Error("password not match confirm password", { cause: 400 })
    );
  }
  const hashPassword = bcrypt.hashSync(newPassword, 10);
  const updatePassword = await userModel.findByIdAndUpdate(req.user.id, {
    password: hashPassword,
  });
  return res.status(201).json({ Message: "changed password", updatePassword });
});
//4-update user (userName,phone)(user must be logged in)
export const updateUser = asynchandler(async (req, res, next) => {
  const { userName, phone } = req.body;
  
  const updateUser = await userModel.findByIdAndUpdate(
    req.user.id,
    { userName, phone },
    { new: true }
  );
  return res.status(201).json({ Message: "updated Do1", updateUser });
});
//5-delete user(user must be logged in)
export const deleteUser = asynchandler(async (req, res, next) => {
  const user = await userModel.findByIdAndDelete(req.user._id, { new: true });
  return res.status(201).json({ Message: "deleted Do1" });
});
//6-soft delete(user must be logged in)
export const softDelete = asynchandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(req.user._id, {
    $set: { isDeleted: true },
  });
  return res.status(201).json({ Message: "/SignUp" });
});
// 7-logout
export const logout = asynchandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(req.user._id, {
    $set: { isOnline: false },
  });
  return res.status(201).json({ Message: "/login" });
});
