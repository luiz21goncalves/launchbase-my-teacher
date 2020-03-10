const fs = require("fs");
const data = require("./data.json");
const { age, date, dateBR, graduation } = require("./utils");

exports.show = function(req, res) {
  const { id } = req.params

  const foundTeacher = data.teachers.find(function(teacher) {
    return teacher.id == id;
  });

  if (!foundTeacher) return res.send("Professor não cadastrato")
  
  const teacher = {
    ...foundTeacher,
    age: age(foundTeacher.birth),
    classes: foundTeacher.classes.split(","),
    created_at: dateBR(foundTeacher.created_at),
    graduation: graduation(foundTeacher.graduation),
  };

  return res.render("teachers/show", { teacher });
};

exports.post = function(req, res) {
  const keys = Object.keys(req.body);

  for (key of keys) {
    if (req.body[key] == "")
      return res.send("Por favor, preencha todos os campos")
  }

  let { avatar_url, name, birth, graduation, type_of_class, classes } = req.body;

  birth = Date.parse(birth);
  const created_at = Date.now();
  const id = Number(data.teachers.length + 1);

  data.teachers.push({
    id,
    avatar_url,
    name,
    birth,
    graduation,
    type_of_class,
    classes,
    created_at
  });

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
    if (err)  return res.send("Ocorreu um erro ao salvar o arquivo")

    return res.redirect("/teachers");
  });
};

exports.edit = function(req, res) {
  const { id } = req.params

  const foundTeacher = data.teachers.find(function(teacher) {
    return teacher.id == id;
  });

  if (!foundTeacher) return res.send("Professor não cadastrato")
  
  const teacher = {
    ...foundTeacher,
    birth: date(foundTeacher.birth),
  };

  return res.render("teachers/edit", { teacher });
};

exports.put = function(req, res) {
  const { id } = req.body;
  let index = 0

  const foundTeacher = data.teachers.find(function(teacher , foundIndex) {
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

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
    if (err) return res.send("Erro ao salvar o arquivo!");
  });

  return res.redirect(`/teachers/${id}`);
};