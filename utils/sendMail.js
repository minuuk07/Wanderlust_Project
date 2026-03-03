const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

console.log(
  "SendGrid API Key loaded:",
  process.env.SENDGRID_API_KEY ? "Yes" : "No"
);

const sendBookingMail = async (booking) => {
  try {
    console.log("Attempting to send email to:", booking.email);

    const msg = {
      to: booking.email,
      from: {
        email: "m74777abcd@gmail.com", // MUST be verified
        name: "Wanderlust Travel"
      },
      subject: "Booking Confirmed - Wanderlust 🎉",
      html: `
<!DOCTYPE html>
<html>
<body style="margin:0; padding:0; background:#f4f6f9; font-family:Arial, sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0" 
style="background:#ffffff; border-radius:15px; overflow:hidden; box-shadow:0 8px 25px rgba(0,0,0,0.1);">

<!-- Header -->
<tr>
<td align="center" style="background:#20c997; padding:30px; color:#ffffff;">
<h1 style="margin:0; font-size:24px;">🎉 Booking Confirmed!</h1>
<p style="margin:10px 0 0 0;">Your reservation has been successfully completed.</p>
</td>
</tr>

<!-- Body -->
<tr>
<td style="padding:30px;">

<h3 style="margin-top:0; color:#333;">Booking Details</h3>

<table width="100%" cellpadding="10" cellspacing="0" style="border-collapse:collapse; font-size:14px;">

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
margin-top:30px;
padding:20px;
background:#fff3cd;
border-radius:10px;
text-align:center;
border:2px solid #dc3545;">
<h2 style="margin:0; color:#dc3545;">
Total Paid: ₹ ${booking.totalPrice > 0 ? booking.totalPrice : 500}
</h2>
</div>

<p style="margin-top:30px; font-size:14px; color:#555;">
Thank you for choosing Wanderlust.<br/>
We look forward to hosting you!
</p>

<!-- Visit Website Button -->
<div style="text-align:center; margin-top:30px;">
<a href="https://wanderlust.onrender.com/listings"
style="
background:#fe424d;
color:#ffffff;
padding:14px 30px;
text-decoration:none;
font-size:16px;
font-weight:bold;
border-radius:30px;
display:inline-block;">
🌍 Visit Wanderlust
</a>
</div>

<!-- View Booking Button -->
<div style="text-align:center; margin-top:15px;">
<a href="https://wanderlust.onrender.com/listings/mybooking"
style="
background:#0d6efd;
color:#ffffff;
padding:12px 25px;
text-decoration:none;
font-size:15px;
font-weight:bold;
border-radius:25px;
display:inline-block;">
📄 View Your Booking
</a>
</div>

</td>
</tr>

<!-- Footer -->
<tr>
<td align="center" style="background:#f8f9fa; padding:15px; font-size:12px; color:#888;">
© 2026 Wanderlust Private Limited
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


