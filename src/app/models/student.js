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
        student_id
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
      data.student_id
    ];

    db.query(query, values, function(err, results) {
      if (err) throw `Database error! ${err}`;
      
      callback(results.rows[0]);
    });
  },
  find(id, callback) {
    db.query(`
      SELECT students.*, students.name AS student_name
      FROM students
      LEFT JOIN students ON (students.student_id = students.id)
      WHERE students.id = $1`, [id], function(err, results) {
      if (err) throw `Database error! ${err}`;

      callback(results.rows[0]);
    })
  },
  findBy(filter, callback) {
    db.query(`
      SELECT students.*
      FROM students
      WHERE students.name ILIKE '%${filter}%'
      OR students.emailt ILIKE '%${filter}%'
      ORDER BY students.name DESC`, function(err, results) {
        if (err) throw `Database error! ${err}`;

        callback(results.rows);
      });
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
        student_id=($7)
      WHERE id = $8
    `
    const values = [
      data.name,
      data.avatar_url,
      date(data.birth_date).iso,
      data.email,
      data.grade,
      data.workload,
      data.student_id,
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
  studentFind(callback) {
    db.query(`SELECT name, id FROM students`, function(err, results) {
      if (err) throw `Database error! ${err}`;

      callback(results.rows);
    })
  },
  paginate(params) {
    const{ filter, limit, offset, callback } = params;

    let query = "";
      filterQuery = "";
      totalQuery = `(
        SELECT COUNT(*) FROM students
      ) AS total`;

    if (filter) {
      filterQuery = `
      WHERE students.name ILIKE '%${filter}%'
      OR students.email ILIKE '%${filter}%'`;

      totalQuery = `(
        SELECT COUNT(*) FROM students
        ${filterQuery}
      ) AS total`;
    }

    query = `SELECT * FROM students, ${totalQuery}
      ${filterQuery}`;

    query = `${query}
    ORDER BY students.name
    LIMIT $1 OFFSET $2`;

    db.query(query, [limit, offset], function(err, results) {
      if (err) throw `Databse Error! ${err}`;

      callback(results.rows);
    })
  }
};