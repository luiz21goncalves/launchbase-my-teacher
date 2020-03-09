module.exports = {
  age: function(timestamp) {
    const today = new Date();
    const birthDate = new Date(timestamp);

    let age = today.getUTCFullYear() - birthDate.getUTCFullYear();
    const month = today.getUTCMonth() - birthDate.getUTCMonth();

    if (month < 0 || month == 0 && today.getUTCDate() <= birthDate.getUTCDate()) {
      age = age - 1
    }

    return age;
  },
  dateBR: function(timestamp) {
    const dates = new Intl.DateTimeFormat("pt-BR").format(timestamp).split("-");
    let created_at = ""

    for (date of dates) {
      created_at = `/${date}${created_at}`
    }

    created_at = created_at.slice(1,10)

    return created_at
  },
  graduation: function(graduation) {
    const values = ["high_school", "university", "masters", "doctorate"];
    const replay = ["Ensino Médio Completo", "Ensino Superior Completo","Mestrado", "Doutorado"];
    
    for (let i = 0; i < values.length; i++) {
      if (graduation == values[i]) {
        return replay[i]
      }
    }
  },
  date: function(timestamp) {
    const date = new Date(timestamp);

    const year = date.getUTCFullYear();
    const month = `0${date.getUTCMonth() + 1}`.slice(-2);
    const day = `0${date.getUTCDate()}`.slice(-2);

    return `${year}-${month}-${day}`
  }
};