const { date, graduation, age } = require("../../lib/utils");

const Teacher = require("../models/teacher");

module.exports = {
  index(req, res) {
    const { filter } = req.query;
    
    let teachersArray = [];

    if (filter) {
      Teacher.findBy(filter, function(teachers) {
        teachers.forEach(function (teacher) {
          teacher = {
            ...teacher,
            subjects_taught: (teacher.subjects_taught.split(","))
          }
    
          return teachersArray.push(teacher)
        })
        return res.render("teachers/index", { teachers: teachersArray, filter });
      });
    } else {
      Teacher.all(function(teachers) {
        teachers.forEach(function (teacher) {
          teacher = {
            ...teacher,
            subjects_taught: (teacher.subjects_taught.split(","))
          }
    
          return teachersArray.push(teacher)
        })
        
        return res.render("teachers/index", { teachers:teachersArray });
      });
    }
  },
  create(req, res) {
    return res.render("teachers/create");
  },
  post(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == "")
        return res.send("Por favor, preencha todos os campos")
    }

    Teacher.create(req.body, function(teacher) {
      return res.redirect(`/teachers/${teacher.id}`)
    })
  },
  show(req, res) {
    Teacher.find(req.params.id, function(teacher) {
      if (!teacher) res.send("Professor não encontrado!");

      teacher.age = age(teacher.birth_date);
      teacher.education_level = graduation(teacher.education_level);
      teacher.subjects_taught = (teacher.subjects_taught.split(","))
      teacher.created_at = date(teacher.created_at).pt_BR;

      return res.render("teachers/show", { teacher })
    });
  },
  edit(req, res) {
    Teacher.find(req.params.id, function(teacher) {
      if (!teacher) return res.send("Professor não encontrado!");
      
      teacher.birth_date = date(teacher.birth_date).iso;

      return res.render("teachers/edit", {teacher});
    });
  },
  put(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == "")
        return res.send("Por favor, preencha todos os campos")
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
  