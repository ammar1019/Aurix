import "dotenv/config";
import express from "express";
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors"
import userRouter from "./routes/user.routes.js";

const app = express();
app.use(cors({
    origin : "http://localhost:5173" , 
    credentials : true 
})) ; //cors policy added , frontend can now access the backend apis 
const port = process.env.PORT || 5000;

app.use(express.json()) ; // a built in middleware , its job is to parse incoming HTTP requests that have JSON payloads and make that data accessible in the code.
app.use(cookieParser()) ;//middleware used to parse cookies attached to incoming client requests.
//When a browser sends a request to your server, it includes stored cookies inside the HTTP Cookie header as a single, raw string of text. 


app.use("/api/auth" , authRouter) ; 
app.use("/api/user" ,userRouter) ; 


const server = app.listen(port, () => {
  connectDb();
  console.log(`Server started successfully on port ${port}`);
});

server.on("error", (err) => {
  console.error("Server failed to start:", err);
});