const faker = require('faker');

const Student = require('./src/app/models/Student');
const Teacher = require('./src/app/models/Teacher');

const { date } = require('./src/lib/utils');

const totalTeachers = 10;
const totalStudents = 5;
let teachersId = [];

async function createTeacher() {
  const teachers = [];
  const educationLevel = ['high_school', 'university', 'masters', 'doctorate'];
  const classType = ['presential', 'distance'];

  while (teachers.length < totalTeachers) {
    teachers.push({
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      avatar_url: faker.image.image(),
      birth_date: date(faker.random.number(1590615667000)).pt_BR,
      education_level: educationLevel[Math.floor(Math.random() * educationLevel.length)],
      class_type: classType[Math.floor(Math.random() * classType.length)],
      subjects_taught: `${faker.name.jobType()}, ${faker.name.jobType()}, ${faker.name.jobType()}`,
    })
  }

  const teachersPromise = teachers.map(teacher => Teacher.create(teacher));
  teachersId = await Promise.all(teachersPromise);
}

async function createStudent() {
  const students = [];

  while (students.length < totalStudents) {
    students.push({
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      avatar_url: faker.image.image(),
      birth_date: date(faker.random.number(1590615667000)).pt_BR,
      email: faker.internet.email(),
      grade: Math.ceil(Math.random() * 8),
      workload: Math.ceil(Math.random() * 10),
      teacher_id: teachersId[Math.floor(Math.random() * totalTeachers)],
    });
  }

  const studentsPromise = students.map(student => Student.create(student));
  await Promise.all(studentsPromise);
};

async function init() {
  await createTeacher();
  await createStudent();
};

init();
