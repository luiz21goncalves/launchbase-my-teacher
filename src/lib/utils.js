module.exports = {
  age(timestamp) {
    const today = new Date();
    const birthDate = new Date(timestamp);

    let age = today.getUTCFullYear() - birthDate.getUTCFullYear();
    const month = today.getUTCMonth() - birthDate.getUTCMonth();

    if (month < 0 || month == 0 && today.getUTCDate() <= birthDate.getUTCDate()) {
      age = age - 1
    }

    return age;
  },
  graduation(graduation) {
    const values = ["high_school", "university", "masters", "doctorate"];
    const replay = ["Ensino Médio Completo", "Ensino Superior Completo","Mestrado", "Doutorado"];
    
    for (let i = 0; i < values.length; i++) {
      if (graduation == values[i]) {
        return replay[i]
      }
    }
  },
  grade(grade) {
    const basic = [5, 6, 7, 8, 9]

    for (item of basic) {
      if (grade == item) return`${grade}º ano do ensino fundamental`
    }

    return `${grade}º ano do ensino médio`
  },
  date(timestamp) {
    const date = new Date(timestamp);

    const year = date.getUTCFullYear();
    const month = `0${date.getUTCMonth() + 1}`.slice(-2);
    const day = `0${date.getUTCDate()}`.slice(-2);

    return {
      iso:`${year}-${month}-${day}`,
      pt_BR: `${day}/${month}/${year}`,
      birthDay: `${day}/${month}`,
      day,
      month,
      year
    }
  }
};