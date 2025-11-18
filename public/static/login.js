// Login page functionality
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorDiv = document.getElementById('error');
  
  errorDiv.classList.add('hidden');
  
  try {
    const response = await axios.post('/api/auth/login', {
      email,
      password
    });
    
    if (response.data.success) {
      // Redirect to dashboard
      window.location.href = '/';
    }
  } catch (error) {
    errorDiv.textContent = error.response?.data?.error || 'Erreur de connexion';
    errorDiv.classList.remove('hidden');
  }
});
