const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendOTPEmail(email, otp) {
    try {
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Neutaris - Your Verification Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #ff8c00; text-align: center;">Neutaris</h2>
            <h3 style="color: #333;">Your Verification Code</h3>
            <p>Hello!</p>
            <p>Your verification code is:</p>
            <div style="background: #f4f1eb; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
              <h1 style="color: #ff8c00; font-size: 32px; margin: 0;">${otp}</h1>
            </div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 12px; text-align: center;">
              © 2024 Neutaris. All rights reserved.
            </p>
          </div>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }

  async sendWelcomeEmail(email, name) {
    try {
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Welcome to Neutaris!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #ff8c00; text-align: center;">Welcome to Neutaris!</h2>
            <h3 style="color: #333;">Hello ${name}!</h3>
            <p>Welcome to your fitness journey with Neutaris!</p>
            <p>We're excited to help you achieve your fitness goals with our personalized workout and meal planning features.</p>
            <div style="background: #f4f1eb; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h4 style="color: #333; margin-top: 0;">What you can do:</h4>
              <ul style="color: #666;">
                <li>Create your unique character</li>
                <li>Plan personalized workouts</li>
                <li>Track your nutrition</li>
                <li>Monitor your progress</li>
              </ul>
            </div>
            <p>Start your journey today!</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 12px; text-align: center;">
              © 2024 Neutaris. All rights reserved.
            </p>
          </div>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Welcome email sent successfully:', result.messageId);
      return true;
    } catch (error) {
      console.error('Welcome email sending failed:', error);
      return false;
    }
  }
}

module.exports = EmailService;
