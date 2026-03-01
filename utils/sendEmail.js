const nodemailer = require("nodemailer");

const sendEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `Wanderlust <${process.env.EMAIL_USER}>`,
    to,
    subject: "Reset Password OTP",
    html: `
      <h2>Password Reset OTP</h2>
      <h1>${otp}</h1>
      <p>This OTP is valid for 5 minutes.</p>
    `,
  });
};

module.exports = sendEmail;
