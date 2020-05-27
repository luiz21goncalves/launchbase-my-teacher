const express = require('express');
const routes = express.Router();

const TeacherController = require('../app/controllers/TeacherController');

routes.get('/', TeacherController.index);
routes.get('/create', TeacherController.create);
routes.get('/:id', TeacherController.show);
routes.get('/:id/edit', TeacherController.edit);
routes.post('/', TeacherController.post);
routes.put('/', TeacherController.put);
routes.delete('/', TeacherController.delete);

module.exports = routes;
