import { url } from './Baselink.js'; // Import your base URL from a configuration file

// document.getElementById('signupform').addEventListener('submit', async function (event) {
//   event.preventDefault();

//   const username = document.getElementById('name').value.trim();
//   const email = document.getElementById('signup-email').value.trim();
//   const password = document.getElementById('signup-password').value.trim();

//   // Basic validation
//   if (!username || !email || !password) {
//     alert('Please fill in all fields');
//     return;
//   }

//   try {
//     console.log(username, email, password);
//     const response = await fetch(`${url}/api/auth/signup`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         username: username,
//         email: email,
//         password: password,
//       }),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.message || 'Signup failed');
//     }

//     console.log('Signup successful!');
//     console.log('Message:', data.message);
//     console.log('Token:', data.token);
//     console.log('User:', data.user);

//     // Optionally store the token (e.g., in localStorage)
//     localStorage.setItem('authToken', data.token);

//     // Redirect the user to a welcome page or dashboard
//     window.location.href = '/index.html';
//   } catch (error) {
//     console.error('Error during signup:', error.message);
//     alert(`Signup failed: ${error.message}`);
//   }
// });
document.getElementById('password-toggle').addEventListener('click', () => {
  const passwordInput = document.getElementById("password");
  const passwordToggle = document.getElementById("password-toggle");
  const type = passwordInput.type === 'password' ? 'text' : 'password';
  passwordInput.type = type;
  passwordToggle.textContent = type === 'password' ? '👁️' : '🙈';
});