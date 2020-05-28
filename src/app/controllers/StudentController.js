const { date, grade, age } = require('../../lib/utils');

const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

module.exports = {
  async index(req, res) {
    try {
      let { filter, page, limit } = req.query;
      filter = filter || '';
      page = page || 1;
      limit = limit || 2;
      let offset = Math.ceil(limit * (page - 1));

      const filters = { where: { name: filter }, or: { email: filter } };

      const params = { 
        filters,
        page,
        limit,
        offset
      };
    
      let students = await Student.paginate(params);

      const count = await Student.count();

      const pagination = {
        total: Math.ceil(count / limit),
        page
      }

      students = students.map(student => ({
        ...student,
        grade: grade(student.grade)
      }));
  
      return res.render('students/index', { students, pagination, filter });
    } catch (err) {
      console.error(err);
    }
  },
  async create(req, res) {
    try {
      const teachers = await Teacher.findAll();

      return res.render('students/create', { teachers });
    } catch (err) {
      console.error(err);
    }
  },
  async post(req, res) {
    const {
      avatar_url,
      name,
      email,
      birth_date,
      grade,
      workload,
      teacher_id,
    } = req.body;

    try {
      const id = await Student.create({
        avatar_url,
        name,
        email,
        birth_date,
        grade,
        workload,
        teacher_id,
      });

      console.log({ student: { id, name } });
      return res.render('alert/created', { student: { id, name } });
    } catch (err) {
      console.error(err);
    }
  },
  async show(req, res) {
    try {
      const student = req.student;

      const { name } = await Teacher.find(student.teacher_id);

      student.birth_date = date(student.birth_date).pt_BR;
      student.grade = grade(student.grade);
      student.teacher_name = name;
      
      return res.render('students/show', { student })
    } catch (err) {
      console.error(err);
    }

  },
  async edit(req, res) {
    try {
      const student = req.student;
      const teachers = await Teacher.findAll();

      student.birth_date = date(student.birth_date).iso;

      return res.render('students/edit', { student, teachers });
    } catch (err) {
      console.error(err);
    }
  },
  async put(req, res) {
    const {
      avatar_url,
      name,
      email,
      birth_date,
      grade,
      workload,
      teacher_id,
      id,
    } = req.body;

    try {
      await Student.update(id, {
        avatar_url,
        name,
        email,
        birth_date,
        grade,
        workload,
        teacher_id,
      });

      return res.render('alert/edited', { student: { id, name } });
    } catch (err) {
      console.error(err);
    }
  },
  async delete(req, res) {
    try {
      const student = req.student;

      await Student.delete(student.id);

      return res.render('alert/delete', { student });
    } catch (err) {
      console.error(err);
    }
  },
}
  