import { Schema, model } from "mongoose";
const userSchema = new Schema({
 
  userName: { type: String, required: true },
  email: { type: String, required: true,unique:true },
  password: { type: String, required: true },
  phone: { type: String, required: true,},
  gender: { type: String, default: "Male", enumValues:["Male,Female"] },
  isDeleted: { type: Boolean, default: false },
  isOnline: { type: Boolean, default: false },
  confirmEmail: { type: Boolean, default: false },
},
{
    timestamps:true,
});
const userModel = model("User", userSchema);
export default userModel;
