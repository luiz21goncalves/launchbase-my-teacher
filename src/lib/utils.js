module.exports = {
  age(timestamp) {
    const today = new Date();
    const birthDate = timestamp;

    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();

    if (month < 0 || month == 0 && today.getDate() <= birthDate.getDate()) {
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
    if (grade <= 5)
      return`${grade + 4}º ano do ensino fundamental`
    
    return `${grade - 5}º ano do ensino médio`
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
}
