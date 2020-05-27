const { date, graduation, age } = require('../../lib/utils');

const Teacher = require('../models/Teacher');

module.exports = {
  index(req, res) {
    return res.render('teachers/index')
    let { filter, page, limit } = req.query;

    page = page || 1;
    limit = limit || 2;
    let offset = Math.ceil(limit * (page - 1));

    const params = {
      filter,
      page,
      limit,
      offset,
      callback(teachers) {
        const pagination = {
          total: Math.ceil(teachers[0].count / limit),
          page
        }
        
        let teachersArray = [];

        teachers = teachers.forEach (function (teacher) {
          teacher = {
            ...teacher,
            subjects_taught: (teacher.subjects_taught.split(','))
          }
          return teachersArray.push(teacher)
        });
              
        return res.render('teachers/index', { teachers: teachersArray, pagination, filter });
      }
    }

    Teacher.paginate(params);
  },
  create(req, res) {
    return res.render('teachers/create');
  },
  post(req, res) {
    return res.send(req.body);
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == '')
        return res.send('Por favor, preencha todos os campos')
    }

    Teacher.create(req.body, function(teacher) {
      return res.redirect(`/teachers/${teacher.id}`)
    })
  },
  show(req, res) {
    Teacher.find(req.params.id, function(teacher) {
      if (!teacher) res.send('Professor não encontrado!');

      teacher.age = age(teacher.birth_date);
      teacher.education_level = graduation(teacher.education_level);
      teacher.subjects_taught = (teacher.subjects_taught.split(','))
      teacher.created_at = date(teacher.created_at).pt_BR;

      return res.render('teachers/show', { teacher })
    });
  },
  edit(req, res) {
    Teacher.find(req.params.id, function(teacher) {
      if (!teacher) return res.send('Professor não encontrado!');
      
      teacher.birth_date = date(teacher.birth_date).iso;

      return res.render('teachers/edit', {teacher});
    });
  },
  put(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == '')
        return res.send('Por favor, preencha todos os campos')
    }

    Teacher.update(req.body, function() {
      return res.redirect(`/teachers/${req.body.id}`)
    });
  },
  delete(req, res) {
    Teacher.delete(req.body.id, function () {
      return res.redirect(`/teachers`);
    });
  },
}
