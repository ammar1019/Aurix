import express from "express";
import { Login, logOut, signUp } from "../controllers/auth.controllers.js";
//this takes only Router from express not everthing
//this makes sure the file is not bulky
const authRouter = express.Router();
authRouter.post("/signup", signUp);
authRouter.post("/signin", Login);
authRouter.get("/logout", logOut);
export default authRouter;