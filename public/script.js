const currentePage = location.pathname;
const menuItems =  document.querySelectorAll("header nav.links a");

for (item of menuItems) {
  if (currentePage.includes(item.getAttribute("href"))) {
    item.classList.add("active")
  }
}

function paginate(selectedPage,totalPages) {
  let pages = [],
    oldPage
    

  for (let currentePage = 1; currentePage <= totalPages; currentePage++) {
    const pageAfeterSelectedPage = currentePage <= selectedPage + 1;
    const pageBeforeSelecedPage =  currentePage >= selectedPage - 1;
    const firstAndLastPage = currentePage == 1 || currentePage == 2 || currentePage == totalPages || currentePage == totalPages - 1;


    if(firstAndLastPage || pageBeforeSelecedPage && pageAfeterSelectedPage) {
      
      if (oldPage && currentePage - oldPage > 2) {
        pages.push("...")
      }

      if (oldPage && currentePage - oldPage == 2) {
        pages.push(currentePage - 1);
      }

      pages.push(currentePage);
      oldPage = currentePage;
    }
  }

  return pages
};

const pagination = document.querySelector(".pagination");

function createPagination(pagination) {
  const filter = pagination.dataset.filter;
  const page = +pagination.dataset.page;
  const total = +pagination.dataset.total;
  const pages = paginate(page, total);

  let elements = "";

  for (let page of pages) {
    if (String(page).includes("...")) {
      elements += `<span>${page}</span>`
    } else {
      if (filter) {
        elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`
      } else {
        elements += `<a href="?page=${page}">${page}</a>`
      }
    }
  }

  pagination.innerHTML = elements;
};

if (pagination) {
  createPagination(pagination);
};

const Validate = {
  allFields(event) {
    const fields = document.querySelectorAll('.item input, .item select');

    for (field of fields) {
      if (field.value == '') {
        const message = document.createElement('div');
        message.classList.add('message');
        message.classList.add('error');
        message.innerText = 'Por favor, preencha todos os campos.'
        document.querySelector('.card').append(message);

        event.preventDefault();
      }
    }
  },
};
