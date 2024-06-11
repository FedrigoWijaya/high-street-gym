document.addEventListener("DOMContentLoaded", function() {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    // Add event listener to the hamburger menu icon
    hamburger.addEventListener("click", function() {
        // Toggle the 'active' class on both the hamburger menu and the navigation menu
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    });

    // Add event listeners to all navigation links to close the menu when a link is clicked
    document.querySelectorAll(".nav-link").forEach(function(link) {
        link.addEventListener("click", function() {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
        });
    });
});

