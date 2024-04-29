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

  if (localStorage.getItem('theme') == 'dark') {
    setDarkTheme()
    checkbox.setAttribute("checked", "true");
  } else {
    setLightTheme()
  }

  checkbox.addEventListener('change', function() {
      // Remove the current theme class from the body
      document.body.classList.remove('body-light-theme');
      document.body.classList.remove('body-dark-theme');
      document.documentElement.classList.remove('root-light-theme');
      document.documentElement.classList.remove('root-dark-theme');
      document.body.classList.remove('a-light-theme');
      document.body.classList.remove('a-dark-theme');

      // Add the new theme class to the body
      if (localStorage.getItem('theme') == 'light') {
        setDarkTheme()
        localStorage.setItem('theme', 'dark');
      } else {
        setLightTheme()
        localStorage.setItem('theme', 'light');
      }
    });

    function setDarkTheme() {
      removePreviousClass()
      document.body.classList.add('body-dark-theme');
      document.documentElement.classList.add('root-dark-theme');
      document.querySelectorAll('a').forEach(element => element.classList.add('a-dark-theme'));
    }

    function setLightTheme() {
      removePreviousClass()
      document.body.classList.add('body-light-theme');
      document.documentElement.classList.add('root-light-theme');
      document.querySelectorAll('a').forEach(element => element.classList.add('a-light-theme'));
    }

    function removePreviousClass() {
       // Remove the current theme class from the body
       document.body.classList.remove('body-light-theme');
       document.body.classList.remove('body-dark-theme');
       document.documentElement.classList.remove('root-light-theme');
       document.documentElement.classList.remove('root-dark-theme');
       document.querySelectorAll('a').forEach(element => element.classList.remove('a-light-theme'));
       document.querySelectorAll('a').forEach(element => element.classList.remove('a-dark-theme'));
    }

});