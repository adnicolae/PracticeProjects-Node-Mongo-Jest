const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'ad.nicolae@outlook.com',
    subject: 'Thanks for joining in',
    text: `Welcome to the app, ${ name }. Let me know how you find it.`
  });
};

const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'ad.nicolae@outlook.com',
    subject: 'Sad to see you go',
    text: `Is there anything we could have done differently?`
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail
}