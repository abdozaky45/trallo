import jwk from "jsonwebtoken";
import userModel from "../../DB/model/userModel.js";
import { asynchandler } from "../utils/errorHandling.js";
export const auth = asynchandler(async (req, res, next) => {
  const { authorization} = req.headers;
  if (!authorization?.startsWith(process.env.TOKEN_BEARER)) { //Bearer
    return next(new Error("authorization is required or in-valid Bearer Key", { cause: 400 }));
  }
 const token=authorization.split(process.env.TOKEN_BEARER)[1];
 if(!token){
  return next(new Error("token is required ", { cause: 400 }));
 }
  const decoded = jwk.verify(token,process.env.TOKEN_SIGNATURE);
  if (!decoded?.id) {
    return next(new Error("in-valid token payload", { cause: 400 }));
  }
  const user = await userModel.findById(decoded.id); // {},null
  if (!user) {
    return next(new Error("Not register account", { cause: 401 }));
  }
  req.user = user;
  return next();
});
