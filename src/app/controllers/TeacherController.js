const { date, graduation, age } = require('../../lib/utils');

const Teacher = require('../models/Teacher');

module.exports = {
  async index(req, res) {
    try {
      let { filter, page, limit } = req.query;

      page = page || 1;
      limit = limit || 2;
      let offset = Math.ceil(limit * (page - 1));

      const params = { filter, page, limit, offset };

      let teachers = await Teacher.paginate(params);

      const pagination = {
        total: Math.ceil(teachers[0].count / limit),
        page
      }
      
      let teachersArray = [];

      teachers = teachers.map(teacher => ({
        ...teacher,
        subjects_taught: (teacher.subjects_taught.split(',')),
      }));
            
      return res.render('teachers/index', { teachers, pagination, filter });
    } catch (err) {
      console.error(err)
    }
  },
  create(req, res) {
    return res.render('teachers/create');
  },
  async post(req, res) {
    try {
      const {
        avatar_url,
        name,
        birth_date,
        education_level,
        class_type,
        subjects_taught,
      } = req.body;
  
      const teacherId = await Teacher.create({
        avatar_url,
        name,
        birth_date,
        education_level,
        class_type,
        subjects_taught,
      });

      return res.redirect(`/teachers/${teacherId}`);
    } catch (err) {
      console.error(err);
    } 
  },
  async show(req, res) {
    try {
      const teacher = await Teacher.find(req.params.id);

      if (!teacher) res.send('Professor não encontrado!');

      teacher.age = age(teacher.birth_date);
      teacher.education_level = graduation(teacher.education_level);
      teacher.subjects_taught = (teacher.subjects_taught.split(','))
      teacher.created_at = date(teacher.created_at).pt_BR;

      return res.render('teachers/show', { teacher });
    } catch (err) {
      console.error(err);
    }
    
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
