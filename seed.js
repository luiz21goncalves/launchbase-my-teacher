const faker = require('faker');
faker.locale = 'pt_BR'

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
  const subjectsTaught = [
    `${faker.name.jobType()}`,
    `${faker.name.jobType()}, ${faker.name.jobType()}`,
    `${faker.name.jobType()}, ${faker.name.jobType()}, ${faker.name.jobType()}`
  ];

  while (teachers.length < totalTeachers) {
    teachers.push({
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      avatar_url: faker.image.avatar(),
      birth_date: date(faker.random.number({min: 0, max: 946684800000})).pt_BR,
      education_level: educationLevel[Math.floor(Math.random() * educationLevel.length)],
      class_type: classType[Math.floor(Math.random() * classType.length)],
      subjects_taught: subjectsTaught[Math.floor(Math.random() * subjectsTaught.length)],
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
      avatar_url: faker.image.avatar(),
      birth_date: date(faker.random.number({min: 946684800000, max: 1262304000000 })).pt_BR,
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

init()
