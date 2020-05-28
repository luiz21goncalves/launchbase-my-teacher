const { date, graduation, age } = require('../../lib/utils');

const Teacher = require('../models/Teacher');

module.exports = {
  async index(req, res) {
    try {
      let { filter, page, limit } = req.query;
      filter = filter || '';
      page = page || 1;
      limit = limit || 2;
      let offset = Math.ceil(limit * (page - 1));

      const params = {
        filters: { where: { name: filter }, or: { subjects_taught: filter} },
        page,
        limit,
        offset
      };

      let teachers = await Teacher.paginate(params);

      const count = await Teacher.count();

      const pagination = {
        total: Math.ceil(count / limit),
        page
      }

      teachers = teachers.map(teacher => ({
        ...teacher,
        subjects_taught: (teacher.subjects_taught.split(',')),
      }));
            
      return res.render('teachers/index', { teachers, pagination, filter });
    } catch (err) {
      console.error(err)
    }
  },
  create(req, res) {
    return res.render('teachers/create');
  },
  async post(req, res) {
    const {
      avatar_url,
      name,
      birth_date,
      education_level,
      class_type,
      subjects_taught,
    } = req.body;

    try {
      const id = await Teacher.create({
        avatar_url,
        name,
        birth_date,
        education_level,
        class_type,
        subjects_taught,
      });

      return res.render('alert/created', { teacher: { id, name } });
    } catch (err) {
      console.error(err);
    } 
  },
  async show(req, res) {
    try {
      const teacher = req.teacher;

      teacher.age = age(teacher.birth_date);
      teacher.education_level = graduation(teacher.education_level);
      teacher.subjects_taught = (teacher.subjects_taught.split(','))
      teacher.created_at = date(teacher.created_at).pt_BR;

      return res.render('teachers/show', { teacher });
    } catch (err) {
      console.error(err);
    }
    
  },
  edit(req, res) {
    try {
      const teacher = req.teacher;

      teacher.birth_date = date(teacher.birth_date).iso;

      return res.render('teachers/edit', {teacher});
    } catch (err) {
      console.error(err);
    }
  },
  async put(req, res) {
    const {
      avatar_url,
      name,
      birth_date,
      education_level,
      class_type,
      subjects_taught,
      id,
    } = req.body;

    try {
      await Teacher.update(id, {
        avatar_url,
        name,
        birth_date,
        education_level,
        class_type,
        subjects_taught,
      });

      return res.render('alert/edited', { teacher: { id, name } });
    } catch (err) {
      console.error(err);
    }
  },
  async delete(req, res) {
    try {
      const teacher = req.teacher;

      await Teacher.delete(teacher.id);

      return res.render('alert/delete', { teacher });
    } catch (err) {
      console.error(err);
    }
  },
}
