const { date, grade, age } = require('../../lib/utils');

const Student = require('../models/Student');

module.exports = {
  index(req, res) {
    return res.render('students/index')
    let { filter, page, limit } = req.query;

    page = page || 1;
    limit = limit || 2;
    let offset = Math.ceil(limit * (page - 1));

    const params = {
      filter,
      page,
      limit,
      offset,
      callback(students) {

        const pagination = {
          total: Math.ceil(students[0].count / limit),
          page
        }

        let studentsArray = [];

        students = students.forEach (function (student) {
          student = {
            ...student,
            grade: grade(student.grade)
          }
          return studentsArray.push(student)
        });

        return res.render('students/index', { students: studentsArray, pagination, filter });
      }
    }

    Student.paginate(params);
    Student.all(function(students) {
      let studentsArray = [];

      students.forEach(function (student) {
        student = {
          ...student,
          grade: grade(student.grade),
        }
        return studentsArray.push(student)
      })
      return res.render('students/index', { students: studentsArray });
    });
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
  show(req, res) {
    Student.find(req.params.id, function(student) {
      if (!student) res.send('Aluno não encontrado!');

      student.birth_date = age(student.birth_date);
      student.grade = grade(student.grade);

      return res.render('students/show', { student })
    });
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
  