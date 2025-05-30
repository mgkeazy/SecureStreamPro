import mongoose from "mongoose";
import { config } from "dotenv";


const dbUrl =process.env.DB_URI;

config();

const connectDB = async () =>{
    try{
        await mongoose.connect(dbUrl);
        console.log('Database connected!!');
    }catch(error){
        console.log(error.message);
        // setTimeout(connectDB,5000);
    }
}

export default connectDB;