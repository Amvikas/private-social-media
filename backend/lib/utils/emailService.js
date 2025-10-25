import nodemailer from "nodemailer";

/**
 * Creates an email transporter with fallback configurations for production
 */
export const createEmailTransporter = () => {
    // Primary configuration for Gmail
    const gmailConfig = {
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false
        }
    };

    // Alternative configuration for production environments that block Gmail
    const alternativeConfig = {
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false
        }
    };

    // Use alternative config if SMTP_HOST is provided, otherwise use Gmail
    const config = process.env.SMTP_HOST ? alternativeConfig : gmailConfig;
    
    return nodemailer.createTransporter(config);
};

/**
 * Sends email with retry logic and better error handling
 */
export const sendEmail = async (mailOptions) => {
    const transporter = createEmailTransporter();
    
    try {
        // Verify transporter configuration
        await transporter.verify();
        console.log("SMTP server is ready to take our messages");
        
        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", info.messageId);
        return { success: true, messageId: info.messageId };
        
    } catch (error) {
        console.log("Email sending failed:", error.message);
        
        // Log debugging information
        console.log("Email config debug:");
        console.log("- EMAIL_USER:", process.env.EMAIL_USER);
        console.log("- EMAIL_PASS exists:", !!process.env.EMAIL_PASS);
        console.log("- NODE_ENV:", process.env.NODE_ENV);
        console.log("- SMTP_HOST:", process.env.SMTP_HOST || "using gmail");
        
        return { success: false, error: error.message };
    }
};