document.addEventListener("DOMContentLoaded", function() {
    // Animation for the main title (h1)
    const titleOptions = {
        strings: ["100 Days of Web Development"],
        typeSpeed: 50,
        showCursor: false, // We will show only one cursor
        loop: false
    };
    const typedTitle = new Typed('#animated-hero-title', titleOptions);

    // Animation for the subtitle (p)
    const subtitleOptions = {
        strings: [
            "Master web development by building 100 unique projects.",
            "From basic HTML/CSS to advanced JavaScript applications.",
            "Enhance your skills and build an impressive portfolio."
        ],
        typeSpeed: 40,
        backSpeed: 20,
        backDelay: 1500,
        loop: true
    };
    const typedSubtitle = new Typed('#animated-hero-subtitle', subtitleOptions);
});