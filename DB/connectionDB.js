
import mongoose from "mongoose";
const connectDB = async () => {
  return await mongoose
    .connect(process.env.DB_URL)
    .then((result) => {
      console.log("connect DB ---------------->localhost:27017");
    })
    .catch((err) => {
      console.log(`Fail connect DB ---->${err} `);
    });
};
export default connectDB;
