import type { Request, Response } from 'express';
import { z } from 'zod';
import { loginSchema, signupSchema } from '../zodSchema/Schema.js';
import { fromZodError } from 'zod-validation-error';
import argon2 from 'argon2';
import tempUser from '../model/tempUser.js';
import otpGen from 'otp-generator';
import jwt from 'jsonwebtoken';
import { env } from '../config/enviromentType.js';
import user from '../model/user.js';
import nodemailer from 'nodemailer';

export async function signup(req: Request, res: Response) {
    const zValidation = signupSchema.safeParse(req.body);
    if (!zValidation.success) {
        const message = fromZodError(zValidation.error).message;
        return res.status(400).json({ message });
    }
    const checkUser = await user.findOne({ email: zValidation.data.email });
    if (checkUser) {
        return res.status(400).json({ message: 'user already exists' });
    }
    const passwordHash = await argon2.hash(zValidation.data.password, {
        type: argon2.argon2id,
        memoryCost: 64 * 1024,
        timeCost: 3,
        parallelism: 1,
    });
    const otp = otpGen.generate(6, {
        upperCaseAlphabets: true,
        lowerCaseAlphabets: false,
        specialChars: true,
        digits: true,
    });
    const myTempUser = new tempUser({
        name: zValidation.data.name,
        email: zValidation.data.email,
        password: passwordHash,
        otp: otp,
    });
    myTempUser.save();
    sendEmails(myTempUser.email, myTempUser.name, otp);
    const token = jwt.sign({ user: myTempUser.id }, env.TEMPUSERTOKEN, {
        expiresIn: '10m',
        issuer: 'Turtle Backend',
        audience: 'Turtle Cleints',
    });
    return res.json({
        message: 'please verify your email',
        action: 'tempUser created',
        token,
    });
}

export async function verify(req: Request, res: Response) {
    const headers = req.headers.authorization;
    if (!headers) {
        return res.status(400).json({ message: 'headers not found' });
    }
    const token = headers.split(' ')[1];
    if (!token) {
        return res.status(400).json({ message: 'invalid token format' });
    }
    try {
        const check = jwt.verify(token, env.TEMPUSERTOKEN) as jwt.JwtPayload;
        const userId = check.user;
        const otp = req.body?.otp;
        if (!otp) {
            return res.status(400).json({ message: 'OTP not found' });
        }
        const myTempUser = await tempUser.findById(userId);
        if (!myTempUser) {
            return res
                .status(500)
                .json({ message: 'Something went wrong user not found' });
        }
        if (otp != myTempUser.otp) {
            return res.status(400).json({ message: 'invalid OTP' });
        }
        const myUser = new user({
            name: myTempUser.name,
            email: myTempUser.email,
            password: myTempUser.password,
        });
        await myUser.save();
        const refreshToken = jwt.sign({ userId: myUser.id }, env.REFRESHTOKEN, {
            expiresIn: '7d',
            issuer: 'Turtle Backend',
            audience: 'Turtle Cleints',
        });
        res.cookie('refreshToken', refreshToken, {
            maxAge: 604800 * 1000,
        });
        return res.json({
            message: 'user account successfully created',
            newUser: true,
            name: myUser.name,
        });
    } catch (error) {
        return res.status(400).json({ message: 'token corrupted' });
    }
}

export async function login(req: Request, res: Response) {
    const zValidation = loginSchema.safeParse(req.body);
    if (!zValidation.success) {
        const message = fromZodError(zValidation.error).message;
        return res.status(400).json({ message });
    }
    const myUser = await user.findOne({ email: zValidation.data.email });
    if (!myUser) {
        return res
            .status(400)
            .json({ message: 'you do not have a account please sign up' });
    }
    const passCheck = await argon2.verify(
        myUser.password,
        zValidation.data.password,
    );
    if (passCheck) {
        const refreshToken = jwt.sign({ userId: myUser.id }, env.REFRESHTOKEN, {
            expiresIn: '7d',
            issuer: 'Turtle Backend',
            audience: 'Turtle Cleints',
        });
        res.cookie('refreshToken', refreshToken, {
            maxAge: 604800 * 1000,
        });
        return res.json({
            message: 'user login successfully',
            newUser: false,
            name: myUser.name,
        });
    }
    return res.status(400).json({ message: 'Invalid Password' });
}

function sendEmails(email: string, name: string, otp: string) {
    let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'turtlemoviesofficial@gmail.com',
            pass: env.EMAILKEY,
        },
    });

    let mailDetails = {
        from: 'turtlemoviesofficial@gmail.com',
        to: email,
        subject: 'Your verification code',
        html: otpTemplate({ name, otp }),
    };

    mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            console.log('Error Occurs');
        }
    });
}

const otpTemplate = ({ name = 'User', otp = 'na' }) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @media only screen and (max-width: 480px) {
      .card { width: 100% !important; border: none !important; box-shadow: none !important; }
      .otp { font-size: 32px !important; letter-spacing: 6px !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#ffffff; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#ffffff;">
    <tr>
      <td align="center" style="padding: 40px 10px;">
        
        <table class="card" width="440" border="0" cellspacing="0" cellpadding="0" style="background:#ffffff; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">
          
          <tr>
            <td align="center" style="padding: 32px 0 20px 0;">
              <span style="font-size: 28px; font-weight: 800; color: #10b981; letter-spacing: -0.5px;">🐢 Turtle</span>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 40px 40px 40px; text-align: center;">
              
              <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #1a2a1a; padding-bottom: 12px;">Verification Code</h1>
              
              <p style="margin: 0; font-size: 15px; line-height: 24px; color: #4a5a4a; padding-bottom: 32px;">
                Hi ${name},<br/>
                Enter this code to securely access your Turtle account.
              </p>

              <table align="center" border="0" cellspacing="0" cellpadding="0" style="background-color: #f0fdf4; border: 2px solid #10b981; border-radius: 12px;">
                <tr>
                  <td class="otp" style="padding: 16px 32px; font-family: 'Courier New', Courier, monospace; font-size: 40px; font-weight: 800; color: #065f46; letter-spacing: 8px;">
                    ${otp}
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 13px; color: #64748b; padding-top: 24px;">
                Valid for <span style="color: #10b981; font-weight: 600;">10 minutes</span>. Don't share this with anyone.
              </p>

              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding: 32px 0;">
                    <hr style="border: 0; border-top: 1px solid #f1f5f9;">
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 18px;">
                If you didn't request this, please ignore this email or contact support if you have concerns.
              </p>

            </td>
          </tr>

          <tr>
            <td align="center" style="padding-bottom: 32px; font-size: 11px; font-weight: 600; color: #cbd5e1; text-transform: uppercase; letter-spacing: 1px;">
              Indie Cinema Powered by Turtle
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
};
