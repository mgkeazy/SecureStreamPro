import nodemailer from "nodemailer";
import { fileURLToPath } from "url"; 
import ejs from "ejs"
import path from "path"
import { config } from "dotenv";
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const sendMail = async (options) =>{
    const transporter = nodemailer.createTransport({
        host : process.env.SMTP_HOST,
        port : Number(process.env.SMTP_PORT || '587'),
        secure: false,               // ← for port 587
        requireTLS: true, 
        service : process.env.SMTP_SERVICE,
        auth:{
            user : process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD
        },
        tls: {
          // Allow self‑signed certs (if your server uses one)
          rejectUnauthorized: false,
          // Or force a modern TLS version:
          minVersion: 'TLSv1.2'
        }
    })

    const { email, subject, template, data } = options;

    // get the path to mail template file

    const templatePath = path.join(__dirname,'../mails',template);

    //Render the email template with EJS

    const html = await ejs.renderFile(templatePath,data);

    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: email,
        subject,
        html
    }

    await transporter.sendMail(mailOptions)
}

export default sendMail