const nodemailer = require("nodemailer");

const sendEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "m74777abc@gmail.com",
      pass: "hkvuibvbgtfmsedu"
    }
  });

  await transporter.sendMail({
    from: `Wanderlust <${"m74777abc@gmail.com"}>`,
    to,
    subject: "Reset Password OTP",
    html: `
      <h2>Password Reset OTP</h2>
      <h1>${otp}</h1>
      <p>This OTP is valid for 5 minutes.</p>
    `
  });
};


module.exports = sendEmail;
