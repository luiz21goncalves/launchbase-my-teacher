const Student = require('../models/Student');

async function post(req, res, next) {
  const keys = Object.keys(req.body);

  for (key of keys) {
    if (req.body[key] == '')
      return res.send('Por favor, preencha todos os campos')
  }

  next();
};

async function show(req, res, next) {

}

module.exports = { post };
