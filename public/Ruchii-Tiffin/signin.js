import { url } from './Baselink.js'; // Import your base URL from a configuration file

// document.getElementById('signinform').addEventListener('submit', async function (event) {
//   event.preventDefault();

//   const email = document.getElementById('email').value.trim();
//   const password = document.getElementById('password').value.trim();

//   // Basic validation
//   if (!email || !password) {
//     alert('Please fill in both fields');
//     return;
//   }

//   try {
//     console.log(email, password);
//     const response = await fetch(`${url}/api/auth/login`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         email: email,
//         password: password,
//       }),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.message || 'Login failed');
//     }

//     console.log('Login successful!');
//     console.log('Message:', data.message);
//     console.log('Token:', data.token);
//     console.log('User:', data.user);

//     // Optionally store the token (e.g., in localStorage)
//     localStorage.setItem('authToken', data.token);

//     // Redirect the user to a dashboard or another page
//     window.location.href = '/index.html';
//   } catch (error) {
//     console.error('Error during login:', error.message);
//     alert(`Login failed: ${error.message}`);
//   }
// });

document.getElementById('password-toggle').addEventListener('click', () => {
  const passwordInput = document.getElementById("password"); 
  const passwordToggle = document.getElementById("password-toggle"); 
  const type = passwordInput.type === 'password' ? 'text' : 'password';
  passwordInput.type = type;
  passwordToggle.textContent = type === 'password' ? '👁️' : '🙈';
});
