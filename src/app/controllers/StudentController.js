const { date, grade, age } = require('../../lib/utils');

const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

module.exports = {
  async index(req, res) {
    try {
      let { filter, page, limit } = req.query;
      filter = filter || '';
      page = page || 1;
      limit = limit || 2;
      let offset = Math.ceil(limit * (page - 1));

      const filters = { where: { name: filter }, or: { email: filter } };

      const params = { 
        filters,
        page,
        limit,
        offset
      };
    
      let students = await Student.paginate(params);

      const pagination = {
        total: Math.ceil(students[0].count / limit),
        page
      }

      students = students.map(student => ({
        ...student,
        grade: grade(student.grade)
      }));
  
      return res.render('students/index', { students, pagination, filter });
    } catch (err) {
      console.error(err);
    }
  },
  create(req, res) {
    return res.render('students/create');
  },
  post(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == '')
        return res.send('Por favor, preencha todos os campos')
    }

    Student.create(req.body, function(student) {
      return res.redirect(`/students/${student.id}`)
    })
  },
  async show(req, res) {
    try {
      const student = req.student;

      const { name } = await Teacher.find(student.teacher_id);

      student.birth_date = date(student.birth_date).pt_BR;
      student.grade = grade(student.grade);
      student.teacher_name = name;
      
      return res.render('students/show', { student })
    } catch (err) {
      console.error(err);
    }

  },
  edit(req, res) {
    Student.find(req.params.id, function(student) {
      if (!student) return res.send('Aluno não encontrado!');
      
      student.birth_date = date(student.birth_date).iso;

      Student.studentFind(function(students) {
        return res.render('students/edit', { student ,students });
      });
    });
  },
  put(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == '')
        return res.send('Por favor, preencha todos os campos')
    }

    Student.update(req.body, function() {
      return res.redirect(`/students/${req.body.id}`)
    });
  },
  delete(req, res) {
    Student.delete(req.body.id, function () {
      return res.redirect(`/students`);
    });
  },
}
  