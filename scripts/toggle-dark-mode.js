$(document).ready(function() {

  const checkbox = document.getElementById('checkbox-change');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const currentTheme = localStorage.getItem('theme');

  if (currentTheme === null) {

    if (prefersDarkScheme.matches) {
      checkbox.setAttribute("checked", "true");
      localStorage.setItem("theme", 'dark');
    } else {
      localStorage.setItem("theme", 'light');
    }
  }

  console.log("currentTheme to check", currentTheme);

  if (localStorage.getItem('theme') == 'dark') {
    document.body.classList.add('body-dark-theme');
    document.documentElement.classList.add('root-dark-theme');
    checkbox.setAttribute("checked", "true");
  } else {
    document.body.classList.add('body-light-theme');
    document.documentElement.classList.add('root-light-theme');
  }

  checkbox.addEventListener('change', function() {
      // Remove the current theme class from the body
      document.body.classList.remove('body-light-theme');
      document.body.classList.remove('body-dark-theme');
      document.documentElement.classList.remove('root-light-theme');
      document.documentElement.classList.remove('root-dark-theme');

      console.log("theme toggle:" + localStorage.getItem("theme"));

      // Add the new theme class to the body
      if (localStorage.getItem('theme') == 'light') {
        document.body.classList.add('body-dark-theme');
        document.documentElement.classList.add('root-dark-theme');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.add('body-light-theme');
        document.documentElement.classList.add('root-light-theme');
        localStorage.setItem('theme', 'light');
        console.log("theme toggle2:" + localStorage.getItem("theme"));
      }
    });

});