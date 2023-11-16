import { asynchandler } from "../../../utils/errorHandling.js";
import userModel from "../../../../DB/model/userModel.js";
import bcrypt from "bcrypt";
import jwk from "jsonwebtoken";
import sendEmail from "../../../utils/email.js";
import * as validators from "../validation.js";
// 1-SignUp
export const SignUP = asynchandler(async (req, res, next) => {
  const {  userName, email, password, cPassword, phone,gender } =req.body;
  if (password != confirmPassword) {
    return next(
      new Error("Password Not Match ConfirmPassword", { cause: 400 })
    );
  }
  const isExist = await userModel.findOne({ email }); //{},null
  if (isExist) {
    return next(new Error("email Exist", { cause: 409 }));
  }
  const hashPassword = bcrypt.hashSync(
    password,
    parseInt(process.env.SALT_ROUND)
  );
  const user = await userModel.create({
    userName,
    email,
    password: hashPassword,
    phone,
    gender
  });
  const tokenConfirmEmail = jwk.sign(
    { id: user._id, email: user.email }, //payload {id,email}
    process.env.EMAIL_SIGNATURE,
    { expiresIn: 60 * 5 }
  );
  const tokenNewConfirmEmail = jwk.sign(
    { id: user._id, email: user.email }, //payload {id,email}
    process.env.EMAIL_SIGNATURE,
    { expiresIn: 60 * 60 * 24 * 30 }
  );
  const linkCofirmEmail = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${tokenConfirmEmail}`;
  const linkNewCofirmEmail = `${req.protocol}://${req.headers.host}/auth/newconfirmEmail/${tokenNewConfirmEmail}`;
  const html = `<!DOCTYPE html>
  <html>
  <head>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
  <style type="text/css">
  body{background-color: #88BDBF;margin: 0px;}
  </style>
  <body style="margin:0px;"> 
  <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
  <tr>
  <td>
  <table border="0" width="100%">
  <tr>
  <td>
  <h1>
      <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
  </h1>
  </td>
  <td>
  <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  <tr>
  <td>
  <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
  <tr>
  <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
  <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
  </td>
  </tr>
  <tr>
  <td>
  <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
  </td>
  </tr>
  <tr>
  <td>
  <p style="padding:0px 100px;">
  </p>
  </td>
  </tr>
  <tr>
  <td>
  <a href="${linkCofirmEmail}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify Email address</a>
  </td>
  </tr>
  <tr>
  <br>
  <br>
  <br>
  <tr>
  <td>
  <a href="${linkNewCofirmEmail}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">new Verify Email address</a>
  </td>
  </tr>
  <tr>
  <td>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  <tr>
  <td>
  <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
  <tr>
  <td>
  <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
  </td>
  </tr>
  <tr>
  <td>
  <div style="margin-top:20px;">
  
  <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
  <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
  
  <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
  <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
  </a>
  
  <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
  <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
  </a>
  
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </table>
  </body>
  </html>`;
  await sendEmail({ to: email, subject: "Confirmation Email", html });
  return res.status(201).json({ Message: "Do1 inserted", user });
});
export const confirmEmail = asynchandler(async (req, res, next) => {
  const { token } = req.params;
  const decoded = jwk.verify(token, process.env.EMAIL_SIGNATURE);
  const user = await userModel.findByIdAndUpdate(decoded.id, {
    $set: { confirmEmail: true },
  });
  return user
    ? res.json({ Message: "/login" })
    : next(new Error("not regsiter account", { cause: 404 }));
});
export const newConfirmEmail = asynchandler(async (req, res, next) => {
  const { token } = req.params;
  const decoded = jwk.verify(token, process.env.EMAIL_SIGNATURE);
  const user = await userModel.findById(decoded.id);
  if (!user) {
    return next(new Error("/SignUp", { cause: 404 }));
  }
  if (user.confirmEmail) {
    return res.json({ Message: "/login" });
  }
  const tokenConfirmEmail = jwk.sign(
    { id: user._id, email: user.email }, //payload {id,email}
    process.env.EMAIL_SIGNATURE,
    { expiresIn: 60 * 2 }
  );
  const linkCofirmEmail = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${tokenConfirmEmail}`;
  const html = `<!DOCTYPE html>
                <html>
                <head>
                    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
                <style type="text/css">
                body{background-color: #88BDBF;margin: 0px;}
                </style>
                <body style="margin:0px;"> 
                <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
                <tr>
                <td>
                <table border="0" width="100%">
                <tr>
                <td>
                <h1>
                    <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
                </h1>
                </td>
                <td>
                <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
                </td>
                </tr>
                </table>
                </td>
                </tr>
                <tr>
                <td>
                <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
                <tr>
                <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
                <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
                </td>
                </tr>
                <tr>
                <td>
                <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
                </td>
                </tr>
                <tr>
                <td>
                <p style="padding:0px 100px;">
                </p>
                </td>
                </tr>
                <tr>
                <td>
                <a href="${linkCofirmEmail}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify Email address</a>
                </td>
                </tr>
                </table>
                </td>
                </tr>
                <tr>
                <td>
                <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
                <tr>
                <td>
                <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
                </td>
                </tr>
                <tr>
                <td>
                <div style="margin-top:20px;">

                <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
                <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
                
                <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
                <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
                </a>
                
                <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
                <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
                </a>

                </div>
                </td>
                </tr>
                </table>
                </td>
                </tr>
                </table>
                </body>
                </html>`;
  await sendEmail({ to: user.email, subject: "Confirmation Email", html });
  return res.send("Check inbox new!");
});
// 2-Login -->with create Token
export const login = asynchandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email }); //{},null
  if (!user) {
    return next(new Error("in-valid email or Password", { cause: 401 }));
  }
  const match = bcrypt.compareSync(password, user.password);
  if (!match) {
    return next(new Error("in-valid email or Password", { cause: 401 }));
  }
  const token = jwk.sign(
    { userName: user.userName, id: user._id },
    process.env.TOKEN_SIGNATURE,
    { expiresIn: 60 * 60 }
  );
  const userupdate = await userModel.findByIdAndUpdate(user._id, {
    $set: { isOnline: true },
  });
  return res
    .status(200)
    .json({ message: "Login information is correct", token });
});