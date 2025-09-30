import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (userId,res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '15d',
    })

    res.cookie("jwt",token,{
        httpOnly:true,//prevents xss attacks cross-site scripting attacks
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',//csrf cross-site request forgery attacks
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    })
}