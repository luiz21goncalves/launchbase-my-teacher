const db = require("../../config/db");
const { date } = require("../../lib/utils");

module.exports = {
  all(callback) {
    db.query(`SELECT * FROM teachers`, function(err, results) {
      if (err) throw `Database error! ${err}`;

      callback(results.rows);
    });
  },
  create(data, callback) {
    const query = `
      INSERT INTO teachers (
        name,
        avatar_url,
        birth_date,
        education_level,
        class_type,
        subjects_taught,
        created_at
      ) VALUES ($1 ,$2, $3, $4, $5, $6, $7)
      RETURNING id
    `
    const values = [
      data.name,
      data.avatar_url,
      date(data.birth_date).iso,
      data.education_level,
      data.class_type,
      data.subjects_taught,
      date(Date.now()).iso
    ];

    db.query(query, values, function(err, results) {
      if (err) throw `Database error! ${err}`;
      
      callback(results.rows[0]);
    });
  },
  find(id, callback) {
    db.query(`SELECT * FROM teachers WHERE id = $1`, [id], function(err, results) {
      if (err) throw `Database error! ${err}`;

      callback(results.rows[0]);
    })
  },
  findBy(filter, callback) {
    db.query(`
      SELECT teachers.*, COUNT(students) AS total_students
      FROM teachers
      LEFT JOIN students ON (students.teacher_id = teachers.id)
      WHERE teachers.name ILIKE '%${filter}%'
      OR teachers.subjects_taught ILIKE '%${filter}%'
      GROUP BY teachers.id, teachers.name, teachers.avatar_url, teachers.birth_date, teachers.education_level, teachers.class_type, teachers.subjects_taught, teachers.created_at
      ORDER BY total_students DESC`, function(err, results) {
        if (err) throw `Database error! ${err}`;

        callback(results.rows);
      });
  },
  update(data, callback) {
    const query = `
      UPDATE teachers SET 
        name=($1),
        avatar_url=($2),
        birth_date=($3),
        education_level=($4),
        class_type=($5),
        subjects_taught=($6)
      WHERE id = $7
    `
    const values = [
      data.name,
      data.avatar_url,
      date(data.birth_date).iso,
      data.education_level,
      data.class_type,
      data.subjects_taught,
      data.id
    ];

    db.query(query, values, function(err, results) {
      if (err) throw `Database error! ${err}`;

      callback();
    });
  },
  delete(id, callback) {
    db.query(`DELETE FROM teachers WHERE id= $1`, [id], function(err, results) {
      if (err) throw `Database error! ${err}`;

      callback();
    });
  }
};