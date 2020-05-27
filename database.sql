DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

DROP DATABASE IF EXISTS my_teacher;
CREATE DATABASE my_teacher;

CREATE TABLE "teachers" (
  "id" SERIAL PRIMARY KEY,
  "avatar_url" text NOT NULL,
  "name" text NOT NULL,
  "birth_date" timestamp NOT NULL,
  "education_level" text NOT NULL,	
  "class_type" text NOT NULL,
  "subjects_taught" text NOT NULL,	
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "students" (
  "id" SERIAL PRIMARY KEY,
  "avatar_url" text NOT NULL,
  "name" text NOT NULL,
  "birth_date" timestamp NOT NULL,
  "email" text UNIQUE NOT NULL,	
  "grade" int NOT NULL,
  "workload" int NOT NULL,
  "teacher_id" int NOT NULL,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

ALTER TABLE "students" ADD FOREIGN KEY ("teacher_id") REFERENCES "teachers" ("id");

CREATE FUNCTION trigger_set_timestamp()	
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON teachers
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON students
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

DELETE FROM students;
DELETE FROM teachers;

ALTER SEQUENCE students_id_seq RESTART WITH 1;
ALTER SEQUENCE teachers_id_seq RESTART WITH 1;
