const express = require('express');
const routes = express.Router();

const StudentController = require('../app/controllers/StudentController');
const StudentValidator = require('../app/validators/student');

routes.get('/', StudentController.index);
routes.get('/create', StudentController.create);
routes.get('/:id', StudentValidator.checkStudent, StudentController.show);
routes.get('/:id/edit', StudentValidator.checkStudent, StudentController.edit);

routes.post('/', StudentValidator.checkFields, StudentController.post);
routes.put('/', StudentValidator.checkFields, StudentController.put);
routes.delete('/', StudentValidator.checkStudent, StudentController.delete);

module.exports = routes;
