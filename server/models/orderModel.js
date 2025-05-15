import mongoose, {Document,Model,mongo,Schema} from "mongoose";


const orderSchema  = mongoose.Schema({
    courseId:{
        type: String,
        required: true,
    },
    userId:{
        type: String,
        required: true,
    },
    payment_info:{
        type: Object,
        // required: true,
    },
},{timestamps: true});

const OrderModel = mongoose.model('Order',orderSchema);

export default OrderModel;