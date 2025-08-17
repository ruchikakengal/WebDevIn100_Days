// Target the form and the container where the form is located
var form = document.getElementById("feedbackForm");
var formContainer = document.getElementsByClassName("contact-form")[0];

// Function to handle a successful form submission
function ajaxSuccess() {
  formContainer.innerHTML = `
    <div class="success-animation">
      <div class="green-tick">✔</div>
      <p class="success-message">Your message has been submitted successfully!</p>
      <p class="success-note">Our team will get back to you soon.</p>
    </div>
    <button type="button" class="btn btn-info" onclick="restartFeedback()">Go Back</button>
  `;

  // Add animation to the success message
  const successAnimation = document.querySelector(".success-animation");
  successAnimation.classList.add("animate-success");
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
      <label for="first_name">First Name*</label>
      <input type="text" id="first_name" name="first_name" placeholder="Enter your first name" required>
      <label for="last_name">Last Name</label>
      <input type="text" id="last_name" name="last_name" placeholder="Enter your last name">
      <label for="job_title">Job Title*</label>
      <input type="text" id="job_title" name="job_title" placeholder="Enter your job title" required>
      <label for="restaurant">Restaurant</label>
      <input type="text" id="restaurant" name="restaurant" placeholder="Enter your restaurant name">
      <label for="email">Email Address*</label>
      <input type="email" id="email" name="email" placeholder="Enter your email address" required>
      <label for="phone_number">Phone Number*</label>
      <input type="text" id="phone_number" name="phone_number" placeholder="Enter your phone number" required>
      <label for="address_line_1">Address Line 1*</label>
      <input type="text" id="address_line_1" name="address_line_1" placeholder="Enter your address line 1" required>
      <label for="address_line_2">Address Line 2 (Optional)</label>
      <input type="text" id="address_line_2" name="address_line_2" placeholder="Enter your address line 2">
      <label for="state">State*</label>
      <input type="text" id="state" name="state" placeholder="Enter your state" required>
      <label for="district">District*</label>
      <input type="text" id="district" name="district" placeholder="Enter your district" required>
      <label for="city">City*</label>
      <input type="text" id="city" name="city" placeholder="Enter your city" required>
      <label for="pin_code">Pin Code*</label>
      <input type="text" id="pin_code" name="pin_code" placeholder="Enter your pin code" required>
      <label for="message">Message</label>
      <textarea id="message" name="message" placeholder="Enter your message or additional information"></textarea>
      <button type="submit" class="submit-btn">Submit</button>
    </form>
  `;

  // Re-bind the form submission event after reloading
  document.getElementById("feedbackForm").addEventListener("submit", handleFormSubmission);
}

// Function to handle the form submission via AJAX
function handleFormSubmission(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  var formData = new FormData(document.getElementById("feedbackForm"));

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
