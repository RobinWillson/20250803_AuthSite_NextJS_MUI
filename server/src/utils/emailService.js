import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Create transporter for sending emails
const createTransporter = () => {
  // For development, you can use Gmail SMTP or any other email service
  // Make sure to add these to your .env file
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your email app password
    },
  });
};

// Generate email verification token
export const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Send verification email
export const sendVerificationEmail = async (email, name, verificationToken) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
  
  // Development mode - just log the email instead of sending it
  if (process.env.NODE_ENV === 'development' || !process.env.EMAIL_USER || process.env.EMAIL_USER === 'your-email@gmail.com') {
    console.log('\n=== EMAIL VERIFICATION (DEVELOPMENT MODE) ===');
    console.log(`To: ${email}`);
    console.log(`Subject: Verify Your Email Address`);
    console.log(`\nWelcome ${name}!`);
    console.log(`Please verify your email address by clicking this link:`);
    console.log(`${verificationUrl}\n`);
    console.log('============================================\n');
    return true;
  }

  // Production mode - actually send email
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"${process.env.APP_NAME || 'Authentication App'}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email Address',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin-bottom: 10px;">Welcome ${name}!</h1>
            <p style="color: #666; font-size: 16px;">Please verify your email address to complete your registration.</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
            <p style="color: #333; font-size: 16px; margin-bottom: 25px;">
              Click the button below to verify your email address:
            </p>
            <a href="${verificationUrl}" 
               style="display: inline-block; background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">
              Verify Email Address
            </a>
          </div>
          
          <div style="text-align: center; color: #666; font-size: 14px;">
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #007bff;">${verificationUrl}</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
            <p>If you didn't create an account, you can safely ignore this email.</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, name, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  
  // Development mode - just log the email instead of sending it
  if (process.env.NODE_ENV === 'development' || !process.env.EMAIL_USER || process.env.EMAIL_USER === 'your-email@gmail.com') {
    console.log('\n=== PASSWORD RESET EMAIL (DEVELOPMENT MODE) ===');
    console.log(`To: ${email}`);
    console.log(`Subject: Reset Your Password`);
    console.log(`\nHi ${name}!`);
    console.log(`You requested a password reset. Click this link to reset your password:`);
    console.log(`${resetUrl}`);
    console.log(`This link will expire in 1 hour.`);
    console.log(`If you didn't request this, please ignore this email.\n`);
    console.log('===============================================\n');
    return true;
  }

  // Production mode - actually send email
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"${process.env.APP_NAME || 'Authentication App'}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset Your Password',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin-bottom: 10px;">Password Reset Request</h1>
            <p style="color: #666; font-size: 16px;">Hi ${name}! We received a request to reset your password.</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
            <p style="color: #333; font-size: 16px; margin-bottom: 25px;">
              Click the button below to reset your password:
            </p>
            <a href="${resetUrl}" 
               style="display: inline-block; background-color: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">
              Reset Password
            </a>
          </div>
          
          <div style="text-align: center; color: #666; font-size: 14px;">
            <p>This link will expire in 1 hour for security reasons.</p>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #dc3545;">${resetUrl}</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
            <p>If you didn't request a password reset, you can safely ignore this email.</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};