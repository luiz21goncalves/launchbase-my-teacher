const fs = require("fs");
const data = require("../data.json");
const { date, grade } = require("../utils");

exports.index = function (req, res) {
  let students = [];

  data.students.forEach(function (student) {
    student = {
      ...student,
      grade: grade(student.grade),
    }
    return students.push(student)
  })

  return res.render("students/index", { students });
};

exports.create = function(req, res) {
  return res.render("students/create");
};

exports.post = function (req, res) {
  const keys = Object.keys(req.body);

  for (key of keys) {
    if (req.body[key] == "")
      return res.send("Por favor, preencha todos os campos")
  }

  birth = Date.parse(req.body.birth);

  let id = 1
  const lastStudent = data.students[data.students.length - 1];

  if (lastStudent) {
    id = lastStudent.id + 1;
  }

  data.students.push({
    id,
    ...req.body,
    grade: Number(req.body.grade),
    workload: Number(req.body.workload)
  });

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
    if (err) return res.send("Ocorreu um erro ao salvar o arquivo")

    return res.redirect(`/students/${id}`);
  });
};

exports.show = function (req, res) {
  const { id } = req.params

  const foundStudent = data.students.find(function (student) {
    return student.id == id;
  });

  if (!foundStudent) return res.send("Professor não cadastrato")

  const student = {
    ...foundStudent,
    birth: date(foundStudent.birth).birthDay,
    grade: grade(foundStudent.grade),
  };

  return res.render("students/show", { student });
};

exports.edit = function (req, res) {
  const { id } = req.params

  const foundStudent = data.students.find(function (student) {
    return student.id == id;
  });

  if (!foundStudent) return res.send("Professor não cadastrato")

  const student = {
    ...foundStudent,
    birth: date(foundStudent.birth).iso,
  };

  return res.render("students/edit", { student });
};

exports.put = function (req, res) {
  const { id } = req.body;
  let index = 0

  const foundStudent = data.students.find(function (student, foundIndex) {
    if (id == student.id)
      index = foundIndex;
    return true;
  });

  if (!foundStudent) return res.send("Professor não cadastrato")

  const student = {
    ...foundStudent,
    ...req.body,
    birth: Date.parse(req.body.birth),
    id: Number(req.body.id),
    grade: Number(req.body.grade),
    workload: Number(req.body.workload)
  }

  data.students[index] = student;

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
    if (err) return res.send("Erro ao salvar o arquivo!");
  });

  return res.redirect(`/students/${id}`);
};

exports.delete = function (req, res) {
  const { id } = req.body;

  const filteredStudent = data.students.filter(function (student) {
    return student.id != id;
  });

  data.students = filteredStudent;

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
    if (err) return res.send("Erro ao salvar o arquivo!");
  });

  return res.redirect("/students");
};  