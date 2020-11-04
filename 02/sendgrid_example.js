const sgMail = require('@sendgrid/mail');

const { error } = require('dotenv').config();

if (error) {
    throw new Error(error);
}

// console.log('SENDGRID_API_KEY', process.env.SENDGRID_API_KEY);

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: 'asdlvcom@gmail.com', // Change to your recipient
  from: 'andrii.zilnyk@gmail.com', // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}
// sgMail
//   .send(msg)
//   .then(() => {
//     console.log('Email sent')
//   })
//   .catch((error) => {
//     console.error(error)
//   })

async function sendEmailWithSendgrid() {
    try {
        const result = await sgMail.send(msg);
        
        console.log('RESULT', result);
        console.log('Email sent')
    } catch(err) {
        console.log(err);
    }
}

sendEmailWithSendgrid();