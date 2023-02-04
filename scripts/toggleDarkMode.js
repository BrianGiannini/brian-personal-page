$(document).ready(function() {

  const toggleBtn = document.getElementById("toggle-button");
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  toggleBtn.addEventListener("click", function() {
    if (prefersDarkScheme.matches) {
      document.body.classList.toggle("body-light-theme");
      document.documentElement.classList.toggle("root-light-theme");
    } else {
      document.body.classList.toggle("body-dark-theme");
      document.documentElement.classList.toggle("root-dark-theme");
    }
  });
});