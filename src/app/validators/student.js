const Student = require('../models/Student');

async function post(req, res, next) {
  const keys = Object.keys(req.body);

  for (key of keys) {
    if (req.body[key] == '')
      return res.send('Por favor, preencha todos os campos')
  }

  next();
};

async function checkStudent(req, res, next) {
  const student = await Student.find(req.params.id || req.body.id);

  if (!student)
    return res.redirect('/students');

  req.student = student;

  next();
}

module.exports = { post, checkStudent };
