import express from "express";
import { CredentialsVdo, getOtpVdoCipher, uploadVdoCipher } from "../controllers/vdoCipher.controller.js";
import { isAuthenticated } from "../middlewares/auth.js";
import multer from 'multer';

const upload = multer();
const vdoCipherRouter = express.Router();

vdoCipherRouter.post("/getVdoCipherOtp",isAuthenticated,getOtpVdoCipher);
vdoCipherRouter.put("/getCredentials",isAuthenticated,CredentialsVdo);
vdoCipherRouter.post('/upload-vdo-cipher',upload.single('file'),uploadVdoCipher);

export default vdoCipherRouter;
