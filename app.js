const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const mongoose = require('mongoose');
const searchProperties = require('./webScraper');
const Email = require('./emailModel');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Erro na conexão com o MongoDB:'));
db.once('open', () => {
  console.log('Conexão estabelecida com o MongoDB!');
});

setInterval(async () => {
  try {
    // Aqui, 'searchPropertyEmails()' deveria ser chamada, mas não está presente no código compartilhado.
    const emails = await searchPropertyEmails(); // Esta função não está definida aqui.
    const emailsToSave = emails.map(email => ({
      email,
      timestamp: new Date().getTime(),
    }));
    await Email.insertMany(emailsToSave); // Salvar e-mails no MongoDB usando o modelo 'Email'
    console.log('Emails salvos no banco de dados.');

    // Salvar os e-mails em um arquivo de texto
    const emailText = emails.join('\n');
    fs.writeFile('email.txt', emailText, err => {
      if (err) {
        console.error('Erro ao salvar os e-mails no arquivo:', err);
      } else {
        console.log('E-mails salvos no arquivo email.txt.');
      }
    });
  } catch (error) {
    console.error('Erro no processo de busca e salvamento:', error);
  }
}, 86400000); // Intervalo de 24 horas (em milissegundos)
