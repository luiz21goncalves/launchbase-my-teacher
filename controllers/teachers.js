const fs = require("fs");
const data = require("../data.json");
const { age, date, graduation } = require("../utils");

exports.index = function (req, res) {
  let teachers = [];

  data.teachers.forEach(function (teacher) {
    teacher = {
      ...teacher,
      classes: teacher.classes.split(",")
    }
    return teachers.push(teacher)
  })

  return res.render("teachers/index", { teachers });
};

exports.create = function(req, res) {
  return res.render("teachers/create");
};

exports.post = function (req, res) {
  const keys = Object.keys(req.body);

  for (key of keys) {
    if (req.body[key] == "")
      return res.send("Por favor, preencha todos os campos")
  }

  birth = Date.parse(req.body.birth);
  const created_at = Date.now();

  let id = 1
  const lastTeacher = data.teachers[data.teachers.length - 1];

  if (lastTeacher) {
    id = lastTeacher.id + 1;
  }
  data.teachers.push({
    id,
    ...req.body,
    created_at,
  });

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
    if (err) return res.send("Ocorreu um erro ao salvar o arquivo")

    return res.redirect(`/teachers/${id}`);
  });
};

exports.show = function (req, res) {
  const { id } = req.params

  const foundTeacher = data.teachers.find(function (teacher) {
    return teacher.id == id;
  });

  if (!foundTeacher) return res.send("Professor não cadastrato")

  const teacher = {
    ...foundTeacher,
    age: age(foundTeacher.birth),
    classes: foundTeacher.classes.split(","),
    created_at: date(foundTeacher.created_at).pt_BR,
    graduation: graduation(foundTeacher.graduation),
  };

  return res.render("teachers/show", { teacher });
};

exports.edit = function (req, res) {
  const { id } = req.params

  const foundTeacher = data.teachers.find(function (teacher) {
    return teacher.id == id;
  });

  if (!foundTeacher) return res.send("Professor não cadastrato")

  const teacher = {
    ...foundTeacher,
    birth: date(foundTeacher.birth).iso,
  };

  return res.render("teachers/edit", { teacher });
};

exports.put = function (req, res) {
  const { id } = req.body;
  let index = 0

  const foundTeacher = data.teachers.find(function (teacher, foundIndex) {
    if (id == teacher.id)
      index = foundIndex;
    return true;
  });

  if (!foundTeacher) return res.send("Professor não cadastrato")

  const teacher = {
    ...foundTeacher,
    ...req.body,
    birth: Date.parse(req.body.birth),
    id: Number(req.body.id),
  }

  data.teachers[index] = teacher;

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
    if (err) return res.send("Erro ao salvar o arquivo!");
  });

  return res.redirect(`/teachers/${id}`);
};

exports.delete = function (req, res) {
  const { id } = req.body;

  const filteredTeacher = data.teachers.filter(function (teacher) {
    return teacher.id != id;
  });

  data.teachers = filteredTeacher;

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
    if (err) return res.send("Erro ao salvar o arquivo!");
  });

  return res.redirect("/teachers");
};  