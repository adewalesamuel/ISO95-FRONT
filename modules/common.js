const nodemailer = require("nodemailer");

const sendMail = async (user, token) => {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'luisa.steuber@ethereal.email', // generated ethereal user
      pass: 'TRyHJqeSa3g2Hb9V58' // generated ethereal password
    }
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"ISO95" <service@iso95.com>', // sender address
    to: user.email, // list of receivers
    subject: "ISO95 - Renouveller votre mot de passe", // Subject line
    html:`<div style='font-family: sans-serif; margin:auto; max-width: 600px; word-wrap: break-word'>
    <h2 style='margin-bottom: 70px'>Salut ${user.username}</h2>
    <p style='font-size:16px; color: grey'>CLIQUER sur le lien ci-dessous pour renouveller votre mot de passe.</p>
    <p><a style='font-weight: bolder' href='https://iso95.com/new-password/${token}'>https://iso95.com/new-password/${token}</a></p>
    </div>`// html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports = {
  sendMail
}
