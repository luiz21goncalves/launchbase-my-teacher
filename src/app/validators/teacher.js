const Teacher = require('../models/Teacher');

function post(req, res, next) {
  const keys = Object.keys(req.body);

  for (key of keys) {
    if (req.body[key] == '')
      return res.send('Por favor, preencha todos os campos')
  }

  next();
};

async function checkTeacher(req, res, next) {
  const teacher = await Teacher.find(req.params.id || req.body.id);

  if (!teacher)
    return res.redirect('/teachers');
  
  req.teacher = teacher;

  next();
}

module.exports = { post, checkTeacher };
