const nodemailer = require("nodemailer")

const sendEmail = async (mailOptions) => {
  const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Mail gönderilemedi: ", error);
    }
    console.log(info);
    return true
  })

}

module.exports = sendEmail;