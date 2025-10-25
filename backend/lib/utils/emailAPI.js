// Email service with multiple providers for free tier compatibility
import nodemailer from "nodemailer";

// Free tier compatible email service using web APIs
export const sendEmailWithAPI = async (to, subject, text, html) => {
    try {
        // Option 1: Try EmailJS (free tier compatible)
        if (process.env.EMAILJS_SERVICE_ID) {
            return await sendWithEmailJS(to, subject, html);
        }
        
        // Option 2: Try Resend (free tier compatible)
        if (process.env.RESEND_API_KEY) {
            return await sendWithResend(to, subject, html);
        }
        
        // Option 3: Try nodemailer with Gmail (will fail on Render free tier)
        return await sendWithNodemailer(to, subject, text, html);
        
    } catch (error) {
        console.error("All email services failed:", error.message);
        throw error;
    }
};

// Resend API (works on free tier)
const sendWithResend = async (to, subject, html) => {
    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
            to: [to],
            subject: subject,
            html: html,
        }),
    });
    
    if (!response.ok) {
        throw new Error(`Resend API error: ${response.status}`);
    }
    
    return await response.json();
};

// EmailJS (works on free tier)
const sendWithEmailJS = async (to, subject, html) => {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            service_id: process.env.EMAILJS_SERVICE_ID,
            template_id: process.env.EMAILJS_TEMPLATE_ID,
            user_id: process.env.EMAILJS_PUBLIC_KEY,
            template_params: {
                to_email: to,
                subject: subject,
                html_content: html,
            }
        }),
    });
    
    if (!response.ok) {
        throw new Error(`EmailJS API error: ${response.status}`);
    }
    
    return await response.text();
};

// Traditional nodemailer (will fail on Render free tier)
const sendWithNodemailer = async (to, subject, text, html) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        connectionTimeout: 10000, // Shorter timeout for free tier
        greetingTimeout: 5000,    
        socketTimeout: 10000,     
    });

    const mailOptions = {
        to: to,
        from: process.env.EMAIL_USER,
        subject: subject,
        text: text,
        html: html,
    };

    return await transporter.sendMail(mailOptions);
};

export default sendEmailWithAPI;