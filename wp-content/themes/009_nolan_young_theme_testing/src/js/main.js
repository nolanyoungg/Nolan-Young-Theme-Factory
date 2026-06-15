import "../scss/main.scss";

const navToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-navigation");

if (navToggle && navigation) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";

    navToggle.setAttribute("aria-expanded", String(!expanded));
    navigation.classList.toggle("is-open", !expanded);
  });
}
