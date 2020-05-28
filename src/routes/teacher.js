const express = require('express');
const routes = express.Router();

const TeacherController = require('../app/controllers/TeacherController');
const TeacherValidator = require('../app/validators/teacher');

routes.get('/', TeacherController.index);
routes.get('/create', TeacherController.create);
routes.get('/:id', TeacherValidator.checkTeacher, TeacherController.show);
routes.get('/:id/edit', TeacherValidator.checkTeacher, TeacherController.edit);

routes.post('/', TeacherValidator.checkFields, TeacherController.post);
routes.put('/', TeacherValidator.checkFields, TeacherController.put);
routes.delete('/', TeacherValidator.checkTeacher, TeacherController.delete);

module.exports = routes;
