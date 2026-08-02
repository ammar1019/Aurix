import jwt from "jsonwebtoken"


const genToken =  (userId)=>{
    try {
        const token = jwt.sign({userId} , process.env.JWT_SECRET , {expiresIn : "10d"}) ; //payload  , secret , token expries in 10 days of generation 
        return token ; 
    }catch(err)
    {
        console.log(err) ; 
    }
}


export default genToken