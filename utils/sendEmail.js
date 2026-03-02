const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, otp) => {
  const msg = {
    to: to,
    from: "m74777abcd@gmail.com", // MUST be verified in SendGrid
    subject: "Reset Password OTP - Wanderlust",
   html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
</head>
<body style="margin:0; padding:0; background-color:#f4f6f9; font-family: Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9; padding:30px 0;">
    <tr>
      <td align="center">

        <table width="500" cellpadding="0" cellspacing="0" 
               style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td align="center" 
                style="background:linear-gradient(135deg,#fe424d,#e63946); color:#ffffff; padding:25px;">
              <h2 style="margin:0;">Wanderlust</h2>
              <p style="margin:5px 0 0 0;">Password Reset OTP</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px; text-align:center;">

              <p style="font-size:16px; margin-bottom:20px;">
                Use the OTP below to reset your password
              </p>

              <!-- OTP Box -->
              <div style="
                  display:inline-block;
                  background:#f8f9fa;
                  border:2px dashed #fe424d;
                  padding:20px 40px;
                  font-size:32px;
                  font-weight:bold;
                  letter-spacing:5px;
                  color:#fe424d;
                  border-radius:10px;
                  margin-bottom:20px;
                ">
                ${otp}
              </div>

              <p style="font-size:14px; color:#6c757d;">
                This OTP is valid for 5 minutes.
              </p>

              <hr style="margin:25px 0; border:none; border-top:1px solid #eee;">

              <p style="font-size:13px; color:#999;">
                Do not share this OTP with anyone.  
                If you did not request this, please ignore this email.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background:#f8f9fa; padding:15px; font-size:12px; color:#888;">
              © 2026 Wanderlust. All rights reserved.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`
  };

  try {
    const response = await sgMail.send(msg);
    console.log("✅ OTP Email Sent:", response[0].statusCode);
  } catch (error) {
    console.error("❌ OTP Email Failed:", error.response?.body || error.message);
  }
};

module.exports = sendEmail;
