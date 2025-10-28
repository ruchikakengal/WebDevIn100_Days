function generatePortfolio() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const linkedin = document.getElementById("linkedin").value;
  const github = document.getElementById("github").value;
  const education = document.getElementById("education").value;
  const skills = document.getElementById("skills").value;
  const projects = document.getElementById("projects").value;
  const about = document.getElementById("about").value;

  const output = `
    <div class="card fade-in">
      <h2>${name}</h2>
      <p><strong>Email:</strong> ${email}</p>
      ${linkedin ? `<p><strong>LinkedIn:</strong> <a href="${linkedin}" target="_blank">${linkedin}</a></p>` : ""}
      ${github ? `<p><strong>GitHub:</strong> <a href="${github}" target="_blank">${github}</a></p>` : ""}
      <hr>
      <h3>About Me</h3>
      <p>${about}</p>
      <h3>Education</h3>
      <p>${education}</p>
      <h3>Skills</h3>
      <p>${skills}</p>
      <h3>Projects</h3>
      <p>${projects}</p>
    </div>
  `;

  document.getElementById("output").innerHTML = output;
  document.getElementById("portfolioPreview").classList.remove("hidden");
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
}
