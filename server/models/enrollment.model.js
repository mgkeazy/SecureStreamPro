import mongoose, { mongo } from "mongoose"

const enrollmentSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
        required:true
    },
    status:{
        type:String,
        default:"pending"
    }
},{timestamps:true})

const enrollmentModel = mongoose.model("Enrollment",enrollmentSchema)
export default enrollmentModel;