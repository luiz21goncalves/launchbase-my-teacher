const db = require("../../config/db");
const { date } = require("../../lib/utils");

module.exports = {
  all(callback) {
    db.query(`SELECT * FROM students`, function(err, results) {
      if (err) throw `Database error! ${err}`;

      callback(results.rows);
    });
  },
  create(data, callback) {
    const query = `
      INSERT INTO students (
        name,
        avatar_url,
        birth_date,
        email,
        grade,
        workload,
        teacher_id
      ) VALUES ($1 ,$2, $3, $4, $5, $6, $7)
      RETURNING id
    `
    const values = [
      data.name,
      data.avatar_url,
      date(data.birth_date).iso,
      data.email,
      data.grade,
      data.workload,
      data.teacher_id
    ];

    db.query(query, values, function(err, results) {
      if (err) throw `Database error! ${err}`;
      
      callback(results.rows[0]);
    });
  },
  find(id, callback) {
    db.query(`
      SELECT students.*, teachers.name AS teacher_name
      FROM students
      LEFT JOIN teachers ON (students.teacher_id = teachers.id)
      WHERE students.id = $1`, [id], function(err, results) {
      if (err) throw `Database error! ${err}`;

      callback(results.rows[0]);
    })
  },
  update(data, callback) {
    const query = `
      UPDATE students SET 
        name=($1),
        avatar_url=($2),
        birth_date=($3),
        email=($4),
        grade=($5),
        workload=($6),
        teacher_id=($7)
      WHERE id = $8
    `
    const values = [
      data.name,
      data.avatar_url,
      date(data.birth_date).iso,
      data.email,
      data.grade,
      data.workload,
      data.teacher_id,
      data.id
    ];

    db.query(query, values, function(err, results) {
      if (err) throw `Database error! ${err}`;

      callback();
    });
  },
  delete(id, callback) {
    db.query(`DELETE FROM students WHERE id= $1`, [id], function(err, results) {
      if (err) throw `Database error! ${err}`;

      callback();
    });
  },
  teacherFind(callback) {
    db.query(`SELECT name, id FROM teachers`, function(err, results) {
      if (err) throw `Database error! ${err}`;

      callback(results.rows);
    })
  },
};