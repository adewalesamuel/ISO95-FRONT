/**
 * Mailing module
 * Author: samueladewale
*/
const { smtp } = require('./../environement')
const nodemailer = require("nodemailer")

const sendForgotPasswordMail = async (user, token) => {

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: true, // true for 465, false for other ports
    auth: smtp.auth
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"ISO95" <samroberval@yahoo.fr>', // sender address
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
}

module.exports = {
  sendForgotPasswordMail
}
