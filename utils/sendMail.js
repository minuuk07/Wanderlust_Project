const sgMail = require("@sendgrid/mail");

// Load API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

console.log(
  "SendGrid API Key loaded:",
  process.env.SENDGRID_API_KEY ? "✅ Yes" : "❌ No"
);

const sendBookingMail = async (booking) => {
  try {
    console.log("📧 Attempting to send email to:", booking.email);

    const msg = {
      to: booking.email,
      from: "m74777abcd@gmail.com", // MUST be verified in SendGrid
      subject: "Booking Confirmed - Wanderlust 🎉",
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

        <table width="600" cellpadding="0" cellspacing="0"
               style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td align="center"
                style="background:linear-gradient(135deg,#28a745,#20c997); color:#ffffff; padding:25px;">
              <h2 style="margin:0;">✔ Booking Confirmed!</h2>
              <p style="margin:5px 0 0 0;">Your reservation is successfully completed 🎉</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px;">

              <h3 style="margin-top:0; color:#333;">Booking Details</h3>

              <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse;">

                <tr>
                  <td style="background:#f8f9fa;"><strong>Listing</strong></td>
                  <td>${booking.listing?.title || "N/A"}</td>
                </tr>

                <tr>
                  <td style="background:#f8f9fa;"><strong>Name</strong></td>
                  <td>${booking.name}</td>
                </tr>

                <tr>
                  <td style="background:#f8f9fa;"><strong>Email</strong></td>
                  <td>${booking.email}</td>
                </tr>

                <tr>
                  <td style="background:#f8f9fa;"><strong>Check In</strong></td>
                  <td>${new Date(booking.checkIn).toDateString()}</td>
                </tr>

                <tr>
                  <td style="background:#f8f9fa;"><strong>Check Out</strong></td>
                  <td>${new Date(booking.checkOut).toDateString()}</td>
                </tr>

                <tr>
                  <td style="background:#f8f9fa;"><strong>Total Nights</strong></td>
                  <td>${booking.totalDays}</td>
                </tr>

              </table>

              <!-- Total Box -->
              <div style="
                margin-top:25px;
                padding:20px;
                text-align:center;
                background:#fff3cd;
                border:2px dashed #dc3545;
                border-radius:10px;
              ">
                <h2 style="margin:0; color:#dc3545;">
                  Total Paid: ₹ ${booking.totalPrice > 0 ? booking.totalPrice : 500}
                </h2>
              </div>

              <p style="margin-top:30px; font-size:14px; color:#6c757d;">
                Thank you for choosing Wanderlust ❤️ <br/>
                We look forward to hosting you!
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center"
                style="background:#f8f9fa; padding:15px; font-size:12px; color:#888;">
              © 2026 Wanderlust. All rights reserved.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`,
    };

    const response = await sgMail.send(msg);

    console.log("✅ Booking email sent successfully!");
    console.log("SendGrid Status Code:", response[0].statusCode);

  } catch (error) {
    console.error("❌ Email sending failed");

    if (error.response) {
      console.error("Status Code:", error.response.statusCode);
      console.error("Error Body:", error.response.body);
    } else {
      console.error("Error Message:", error.message);
    }
  }
};

module.exports = sendBookingMail;