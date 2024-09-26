const nodemailer = require("nodemailer")
require('dotenv').config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_SERVER,
        pass: process.env.PASSWORD_MAIL_SERVER,
    },
})

async function main(email, token) {
    // send mail with defined transport object
    await transporter.sendMail({
        from: 'nguyenhuutin124@gmail.com', // sender address
        to: email, // list of receivers
        subject: `CONGRRATULATION ON, ${email}`, // Subject line
        html: `<p>I'm so glad you registered for our company!</p><b>Here's your personal link: <a href='http://localhost:3000/users/email-verification?token=${token}'>Click here to login</a></b><p>Make sure you don't share this link publicy, because it's unique for you</p>`, // html body
    })
    .then(res => console.log(res))
    .catch(err => console.error(err))
}

module.exports = { main }