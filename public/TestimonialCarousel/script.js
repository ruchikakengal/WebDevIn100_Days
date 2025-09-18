const testimonials = [
  {
    name: "Aarav Sharma",
    photoUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "This platform really helped me improve my skills and gain confidence!"
  },
  {
    name: "Simran Kaur",
    photoUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    text: "The courses are well-structured and the mentors are very supportive."
  },
  {
    name: "Rohan Verma",
    photoUrl: "https://randomuser.me/api/portraits/men/85.jpg",
    text: "I loved the interactive projects — they made learning so much fun!"
  },
  {
    name: "Ananya Gupta",
    photoUrl: "https://randomuser.me/api/portraits/women/66.jpg",
    text: "A great learning experience! I made new friends and improved my coding."
  },
  {
    name: "Kabir Singh",
    photoUrl: "https://randomuser.me/api/portraits/men/50.jpg",
    text: "Amazing UI and very smooth learning journey."
  },
  {
    name: "Ishita Mehra",
    photoUrl: "https://randomuser.me/api/portraits/women/12.jpg",
    text: "The mentorship sessions were truly eye-opening and motivational."
  },
  {
    name: "Devansh Patel",
    photoUrl: "https://randomuser.me/api/portraits/men/71.jpg",
    text: "I enjoyed collaborating with peers and working on real-world projects."
  },
  {
    name: "Mehak Chawla",
    photoUrl: "https://randomuser.me/api/portraits/women/22.jpg",
    text: "The community support was wonderful — I never felt stuck or alone."
  },
  {
    name: "Aditya Singh",
    photoUrl: "https://randomuser.me/api/portraits/men/21.jpg",
    text: "Collaborating on real projects boosted my confidence massively."
  },
  {
    name: "Nisha Rao",
    photoUrl: "https://randomuser.me/api/portraits/women/11.jpg",
    text: "Learnt to apply machine learning with web apps. Such a rewarding experience."
  },
  {
    name: "Vikram Patel",
    photoUrl: "https://randomuser.me/api/portraits/men/27.jpg",
    text: "I gained both skills and friends. The environment is positive and motivating."
  },
  {
    name: "Rahul Khanna",
    photoUrl: "https://randomuser.me/api/portraits/men/41.jpg",
    text: "I love the open-source vibe here. Everyone supports each other so much!"
  }
];

const imgEl = document.getElementById("user-img");
const textEl = document.getElementById("text");
const usernameEl = document.getElementById("username");
const dotsContainer = document.getElementById("dots");
const testimonialGrid = document.getElementById("testimonialGrid");

let idx = 0;
let autoSlide;

// Create dots
testimonials.forEach((_, i) => {
  const dot = document.createElement("div");
  dot.classList.add("dot");
  if (i === 0) dot.classList.add("active");
  dot.addEventListener("click", () => {
    idx = i;
    updateTestimonial();
    resetAutoSlide();
  });
  dotsContainer.appendChild(dot);
});

// Update carousel
function updateTestimonial() {
  const { name, photoUrl, text } = testimonials[idx];
  imgEl.src = photoUrl;
  textEl.innerText = text;
  usernameEl.innerText = name;
  updateDots();
}
function updateDots() {
  document.querySelectorAll(".dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === idx);
  });
}
function nextTestimonial() {
  idx = (idx + 1) % testimonials.length;
  updateTestimonial();
}
function prevTestimonial() {
  idx = (idx - 1 + testimonials.length) % testimonials.length;
  updateTestimonial();
}

// Buttons
document.getElementById("next").addEventListener("click", () => {
  nextTestimonial();
  resetAutoSlide();
});
document.getElementById("prev").addEventListener("click", () => {
  prevTestimonial();
  resetAutoSlide();
});

// Auto slide
function startAutoSlide() {
  autoSlide = setInterval(nextTestimonial, 8000);
}
function resetAutoSlide() {
  clearInterval(autoSlide);
  startAutoSlide();
}

// Init
updateTestimonial();
startAutoSlide();

// Build 12 testimonial cards
testimonials.forEach(({ name, photoUrl, text }) => {
  const card = document.createElement("div");
  card.classList.add("testimonial-card");
  card.innerHTML = `
    <img src="${photoUrl}" alt="${name}" />
    <h3>${name}</h3>
    <p class="review">${text}</p>
  `;
  testimonialGrid.appendChild(card);
});
