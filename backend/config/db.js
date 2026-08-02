import mongoose from "mongoose" 

const connectDb = async () => {
    try {
      const conn =   await mongoose.connect(process.env.MONGODB_URL);
        console.log("Database connected successfully");
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (err) {
        console.log(err);
    }
};


export default connectDb ; 

// module.exports = {connectDb} ; 

//export { connectDb, disconnectDb };