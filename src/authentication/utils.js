const moment = require('moment');
const { v4 : uuidv4 } = require('uuid');

const nodemailer = require('nodemailer');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');



const sendConfirmationEmail = (email, params) => {
  const emailTemplate = fs.readFileSync(path.resolve('./src/email-template/account-activation.ejs'), 'utf-8');

  // Tạo một đối tượng vận chuyển (transporter) cho Nodemailer
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'stella.service.test@gmail.com',
      pass: 'phzxpcvohwksnjbc'
    }
  });



  // Tải nội dung template email và thay thế các biến bằng giá trị thực tế
  const html = ejs.render(emailTemplate, params, {});

  // Tạo đối tượng thư (mail options)
  const mailOptions = {
    from: 'Stella Service <stella.service.test@gmail.com>',
    to: email,
    subject: 'Confirm your account',
    html
  };
  return new Promise((resolve, reject) => {
    // Gửi email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending confirmation email:', error);
        reject(error);
      } else {
        resolve(info);
      }
    });
  });

};

const createActivation = app => async ({ userId, email }) => {
  const code = uuidv4();
  await app.service('account-activation').create({
    userId,
    code,
    expiredAt: moment().add(30, 'days').toDate()
  });
  // send email
  await sendConfirmationEmail(email, { url: `${app.get('website')}/account/activation?code=${code}` });
};

module.exports = {
  createActivation,
};
