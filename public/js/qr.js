let upiID = "m74777abc@okicici";
let payeeName = "Mrinmoy Ghosh";

let upiLink = `upi://pay?pa=${upiID}&pn=${encodeURIComponent(payeeName)}&cu=INR`;

new QRCode(document.getElementById("qrcode"), {
    text: upiLink,
    width: 220,
    height: 220
});