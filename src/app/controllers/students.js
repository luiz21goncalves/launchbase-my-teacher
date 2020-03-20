const { date, grade, age } = require("../../lib/utils");

const Student = require("../models/student");

module.exports = {
  index(req, res) {
    Student.all(function(students) {
      let studentsArray = [];

      students.forEach(function (student) {
        student = {
          ...student,
          grade: grade(student.grade),
        }
        return studentsArray.push(student)
      })
      return res.render("students/index", { students: studentsArray });
    });
  },
  create(req, res) {
    Student.teacherFind(function(teachers) {
      return res.render("students/create", { teachers });
    });
  },
  post(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == "")
        return res.send("Por favor, preencha todos os campos")
    }

    Student.create(req.body, function(student) {
      return res.redirect(`/students/${student.id}`)
    })
  },
  show(req, res) {
    Student.find(req.params.id, function(student) {
      if (!student) res.send("Aluno não encontrado!");

      student.birth_date = age(student.birth_date);
      student.grade = grade(student.grade);

      return res.render("students/show", { student })
    });
  },
  edit(req, res) {
    Student.find(req.params.id, function(student) {
      if (!student) return res.send("Aluno não encontrado!");
      
      student.birth_date = date(student.birth_date).iso;

      Student.teacherFind(function(teachers) {
        return res.render("students/edit", { student ,teachers });
      });
    });
  },
  put(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == "")
        return res.send("Por favor, preencha todos os campos")
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
  