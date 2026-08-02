// import jwt from "jsonwebtoken"

// // we want to verify is the current user logged in or not , we will check his cookies , does it have a valid token or not  

// const isAuth = async (req, res , next) =>{
//     try {
//          const token = req.cookies.token ; // the user cookie will be in the request body
//          if(!token)
//          {
//             return res.status(400).json({message : "token not found"}) ;
//          }

//          //now we will extract the token from the token with jwt 
//          const verifyToken = await jwt.verify(token , process.env.JWT_SECRET) ;  // here is the token is invalid or expired it throws as error which we will handle in the catch block
//         req.userId = verifyToken.userId  ; 
//         next() ; 
          

//     } catch (error) {
//         console.log(error) ; 
//         return res.status(400).json({message : "isAuth erro"}) 
//     }
// }

// export default isAuth 

import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  try {
    //req has cookies which come from the frontend we need token cookie inside the object so we get the token

    console.log("[isAuth] Cookies received:", req.cookies); // see what's in cookies

    const token = req.cookies.token;

    if (!token) {
      return res.status(400).json({
        message: "token not found",
      });
    }

    //this wl have an object with user's id etc etc
    const verifyToken = await jwt.verify(token, process.env.JWT_SECRET);

    req.userId = verifyToken.userId; //users current id present already

    next();
  } catch (error) {
    console.error("isAuth error:", error);
    return res.status(500).json({
      message: "is Auth error",
      error: error.message,
    });
  }
};
export default isAuth;