import mongoose, {Document,Model,Schema} from "mongoose";

const notificationSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: "unread"
    }
    
},{timestamps: true});

const NotificationModel = mongoose.model('Notification', notificationSchema);

export default NotificationModel;