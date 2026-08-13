// UI-only interactions. Backend/API logic can be connected later.
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
if (menuToggle) menuToggle.addEventListener('click', () => mainNav.classList.toggle('open'));

document.querySelectorAll('.show-password').forEach(button => {
  button.addEventListener('click', () => {
    const input = button.parentElement.querySelector('input');
    input.type = input.type === 'password' ? 'text' : 'password';
    button.textContent = input.type === 'password' ? 'Show' : 'Hide';
  });
});

const mobileSidebar = document.querySelector('.mobile-sidebar');
const sidebar = document.querySelector('.sidebar');
if (mobileSidebar) mobileSidebar.addEventListener('click', () => sidebar.classList.toggle('mobile-open'));

document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const submit = form.querySelector('button[type="submit"]');
    if (submit) {
      const original = submit.textContent;
      submit.textContent = 'Saved ✓';
      setTimeout(() => submit.textContent = original, 1400);
    }
  });
});
