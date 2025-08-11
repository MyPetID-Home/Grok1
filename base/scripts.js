let isLoggedIn = false;

function showLoggedInState() {
  isLoggedIn = true;
  document.querySelectorAll('.logged-in').forEach(el => el.style.display = 'block');
  document.querySelectorAll('.logged-out').forEach(el => el.style.display = 'none');
}

function showLoggedOutState() {
  isLoggedIn = false;
  document.querySelectorAll('.logged-in').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.logged-out').forEach(el => el.style.display = 'block');
}

function navigate(page) {
  window.location.href = page === 'home' ? '/pages/home' : `/pages/${page}`;
}

function showRegisterForm() {
  document.getElementById('register-form').style.display = 'block';
}

function showToast({ title, description }) {
  const toast = document.createElement('div');
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.right = '20px';
  toast.style.background = '#333';
  toast.style.color = 'white';
  toast.style.padding = '10px 20px';
  toast.style.borderRadius = '4px';
  toast.innerHTML = `<strong>${title}</strong>: ${description}`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
