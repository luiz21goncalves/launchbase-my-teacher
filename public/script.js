const currentePage = location.pathname;
const menuItems =  document.querySelectorAll("header nav.links a");

for (item of menuItems) {
  if (currentePage.includes(item.getAttribute("href"))) {
    item.classList.add("active")
  }
}
