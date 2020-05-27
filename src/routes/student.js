const express = require('express');
const routes = express.Router();

const StudentController = require('../app/controllers/StudentController');

routes.get('/', StudentController.index);
routes.get('/create', StudentController.create);
routes.get('/:id', StudentController.show);
routes.get('/:id/edit', StudentController.edit);
routes.post('/', StudentController.post);
routes.put('/', StudentController.put);
routes.delete('/', StudentController.delete);

module.exports = routes;
