import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bootStarp from "./src/index.router.js";
const app = express();
const port = 5009;
bootStarp(app, express);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
