const express = require('express');
const routes = express.Router();

const teacher = require('./teacher');
const student = require('./student');

routes.get('/', (req, res) => res.redirect('/teachers'));

routes.use('/teachers', teacher);
routes.use('/students', student);

module.exports = routes;
