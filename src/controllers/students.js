const { date, grade } = require("../lib/utils");

module.exports = {
  index(req, req) {
    return res.render("students/index");
  },
  create(req, req) {
    return res.render("students/create");
  },
  post(req, req) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == "")
        return res.send("Por favor, preencha todos os campos")
    }

    return
  },
  show(req, req) {
    return
  },
  edit(req, req) {
    return
  },
  put(req, req) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == "")
        return res.send("Por favor, preencha todos os campos")
    }

    return
  },
  delete(req, req) {
    return
  },
}
  