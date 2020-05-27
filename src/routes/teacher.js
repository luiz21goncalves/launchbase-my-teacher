const express = require('express');
const routes = express.Router();

const TeacherController = require('../app/controllers/TeacherController');
const TeacherValidator = require('../app/validators/teacher');

routes.get('/', TeacherController.index);
routes.get('/create', TeacherController.create);
routes.get('/:id', TeacherValidator.checkTeacher, TeacherController.show);
routes.get('/:id/edit', TeacherController.edit);

routes.post('/', TeacherValidator.post, TeacherController.post);
routes.put('/', TeacherController.put);
routes.delete('/', TeacherController.delete);

module.exports = routes;
