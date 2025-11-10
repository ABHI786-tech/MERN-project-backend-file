const mongoose = require("mongoose");
const userSchema = require("../models/authModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const jwtSecrectKey = process.env.JWT_SECRECTKEY;
const nodemailer = require("nodemailer");
const saltRounds = 10;


// function convertjwtToken(email, id) {
//     console.log(email)
//     console.log(id)
// return jwt.sign({
//         email, id
//     }, jwtSecrectKey, { expiresIn: '1h' });

// }

const sendEmail = async (to, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER, // your Gmail
                pass: process.env.EMAIL_PASS, // App password (not your main password)
            },
        });

        const mailOptions = {
            from: `"EMS EMPLOYEE MANGER SERVICE" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        };

        await transporter.sendMail(mailOptions);
        console.log("📧 Email sent to:", to);
    } catch (err) {
        console.error("❌ Email send failed:", err);
    }
};



/////  user  register
async function userRegister(req, res) {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(404).send("Please fill all required fields (name, email, password)")
        }
        const existingUser = await userSchema.findOne({ email })

        // 2️⃣ Hash password
        let hashPassword = await bcrypt.hash(password, saltRounds)
        // console.log(hashPassword, "existingUser")

        // 3️⃣ Check if user already exists
        if (existingUser) {
            res.status(404).send("User already exists with this email")
        }

        else {
            const createUser = await userSchema.create({ name, email, password: hashPassword });
            // res.status(200).send({ createUser, message: "User registered successfully" })
            const token = jwt.sign({ id: createUser._id }, jwtSecrectKey, { expiresIn: "7d" });
            await createUser.save();
            return res.status(200).json({
                message: "User registered successfully", token,
                user: {
                    id: createUser._id,
                    name: createUser.name,
                    email: createUser.email,

                },
            });
        }
    }
    catch (err) {
        res.status(400).send({ error: err, message: "Failed to register user" })

    }
}


//// user data get 
async function userProfile(req, res) {
    try {
        const user = await userSchema.findById(req.user).select("-password");

        return res.status(200).json({ user, message: "get employee data sucessfuly" })
    }
    catch (err) {
        console.log({ err, message: "Failed to fetch employee data" })
    }
}

// 🟩 Login Section
async function userLogin(req, res) {
    try {
        const { email, password } = req.body;

        // Check empty fields
        if (!email || !password) {
            return res.status(400).json({ message: "Please fill all fields!" });
        }

        // Check if user exists
        const user = await userSchema.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found, please register first!" });
        }

        // Compare password
        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) {
            return res.status(401).json({ message: "Invalid credentials!" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, email: user.email }, jwtSecrectKey, { expiresIn: "7d" });

        // Send response
        res.status(200).json({
            message: "User login successful!",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "Server error during login!" });
    }
}


//// forget password 
async function Forgetpassword(req, res) {
    try {
        const { email } = req?.body || {};

        if (!email) {
            return res.status(404).send("please enter your valid e-mail address")
        }
        const FindEmail = await userSchema.findOne({ email })
        if (!FindEmail) {
            return res.status(404).send("No account found with this email address")
        }
        if (FindEmail) {
            res.status(200).send("Password reset link has been sent to your email address")

            const resetToken = crypto.randomBytes(32).toString("hex")
            const hash = crypto.createHash('sha256').update(resetToken).digest("hex")

            FindEmail.resettoken = hash;

            await FindEmail.save();
            const html = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 20px auto; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; background-color: #f9fafb;">
      <h1 style="color: #1e40af; text-align: center;">🔒 Password Reset Request</h1>
      <h2>Hi <strong>${FindEmail?.name}</strong>,</h2>
      <p>We received a request to reset your password. To complete the process, please click the button below:</p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="http://localhost:8080/resetpassword?token=${resetToken}" 
           style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">
          Reset Password
        </a>
      </div>

      <p>If you did not request this, you can safely ignore this email. Your password will remain unchanged.</p>
      <p style="color: #ef4444;"><strong>Note:</strong> This link will expire in <strong>15 minutes</strong> for security reasons.</p>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />
      <p style="font-size: 14px; color: #6b7280; text-align: center;">
        © ${new Date().getFullYear()} Employee Manager. All rights reserved.<br />
        This is an automated email — please do not reply.
      </p>
    </div>
  </div>
`;
            sendEmail(email, "reset password", html)
        }
    }
    catch (err) {
        res.status(404).send({ error: err, message: "Failed to process forgot password request" })
    }
}


//// reset password
async function resetpassword(req, res) {
    try {
        const { token } = req?.query;
        const { newpassword } = req?.body || {};
        if (!token) {
            return res.status(400).send("Reset token is required")
        }

        const hash = crypto.createHash('sha256').update(token).digest("hex")
        const resetpass = await userSchema.findOne({ resettoken: hash })

        if (!resetpass || !resetpass?.password) {
            return res.status(404).send("Invalid or expired reset token")
        }
        const encryptpass = await bcrypt.hash(newpassword, saltRounds);
        // console.log(encryptpass, resetpass)

        resetpass.password = encryptpass;
        resetpass.resettoken = "";

        await resetpass.save();
        res.status(200).send({ message: "Password has been reset successfully" })

    }
    catch (error) {
        res.status(400).send({ error, message: "Failed to reset password" })

    }
}

module.exports = {
    userRegister, userLogin, Forgetpassword, resetpassword, userProfile
}


