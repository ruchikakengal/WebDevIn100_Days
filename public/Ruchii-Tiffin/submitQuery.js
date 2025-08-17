// JavaScript to handle form submission and feedback

// Target the form and the container where the form is located
var form = document.getElementById("feedbackForm");
var formContainer = document.getElementsByClassName("contact-form")[0];

// Function to handle a successful form submission
function ajaxSuccess() {
  formContainer.innerHTML = `
    <div class="alert alert-success" role="alert">
      Your query has been submitted successfully! <br>
      Our team will get back to you soon.
    </div>
    <button type="button" class="btn btn-info" onclick="restartFeedback()">Submit Another Query</button>
  `;
}

// Function to handle an error during form submission
function ajaxError() {
  formContainer.innerHTML = `
    <div class="alert alert-danger" role="alert">
      Something went wrong! Please try again later.
    </div>
    <button type="button" class="btn btn-info" onclick="restartFeedback()">Try Again</button>
  `;
}

// Function to reload the form for a new submission
function restartFeedback() {
  formContainer.innerHTML = `
    <form id="feedbackForm">
      <input type="hidden" name="access_key" value="24c2d733-3b85-4b25-9d33-ee0fdb1040d8">
      <select name="query" required>
        <option value="" disabled selected>How can we help you?*</option>
        <option value="order">Issue with an Order</option>
        <option value="feedback">Feedback</option>
        <option value="other">Other Queries</option>
      </select>
      <input type="text" name="name" placeholder="Full Name*" required>
      <input type="email" name="email" placeholder="Email Address*" required>
      <input type="text" name="mobile" placeholder="Mobile Number (optional)">
      <textarea name="message" placeholder="Type text*" required></textarea>
      <button type="submit" class="submit-btn">Submit Feedback</button>
    </form>
  `;

  // Re-bind the form submission event after reloading
  document.getElementById("feedbackForm").addEventListener("submit", handleFormSubmission);
}

// Function to handle the form submission via AJAX
function handleFormSubmission(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  var formData = new FormData(form);

  // Web3Forms API endpoint
  var url = "https://api.web3forms.com/submit";

  // Create a new XMLHttpRequest object
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.send(formData);

  // Handle the server response
  xhr.onload = function () {
    if (xhr.status === 200) {
      ajaxSuccess();
    } else {
      ajaxError();
    }
  };

  // Handle network or other errors
  xhr.onerror = function () {
    ajaxError();
  };
}

// Attach the event listener to the form submission
form.addEventListener("submit", handleFormSubmission);
