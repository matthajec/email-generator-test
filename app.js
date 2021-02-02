require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');


const app = express();

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: process.env.SENDGRID_API_KEY
  }
}));

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));


app.get('/', (req, res) => {
  res.render('index');
});

app.post('/send-email', (req, res) => {
  const {
    receipient,
    subject,
    heading,
    content
  } = req.body;

  transporter.sendMail({
    to: receipient,
    from: process.env.FROM,
    subject: subject,
    html: `
      <h1>${heading}</h1>
      <p>${content}</p>
    `
  }).catch(err => {
    console.log(err);
  });
  res.redirect('/');
});

app.listen('3000', () => {
  console.log('App listening on port 3000');
});