(function() {
    // This script runs immediately, before the DOM is ready
    // Check if theme is set to dark
    if (localStorage.getItem('theme') === 'dark') {
      // Apply dark theme classes immediately
      document.documentElement.classList.add('root-dark-theme');
      document.addEventListener('DOMContentLoaded', function() {
        document.body.classList.add('body-dark-theme');
        document.querySelectorAll('a').forEach(element => element.classList.add('a-dark-theme'));
      });
    } else {
      // Apply light theme classes immediately
      document.documentElement.classList.add('root-light-theme');
      document.addEventListener('DOMContentLoaded', function() {
        document.body.classList.add('body-light-theme');
        document.querySelectorAll('a').forEach(element => element.classList.add('a-light-theme'));
      });
    }
  })();