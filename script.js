document.addEventListener("DOMContentLoaded", () => {
    // Fetch product data and render them dynamically
    fetch('adminjson.json')
        .then(response => response.json()) // Parse the JSON data
        .then(data => {
            const products = data; // Store products from the fetched data
            const productContainer = document.getElementById('product-container'); // Get the container to insert products

            // Loop through each product and create HTML structure dynamically
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.classList.add('product-card'); // Create a product card

                productCard.innerHTML = `
                    <div class="product-image">
                        <img src="${product.image}" class="product-thumb" alt="${product.name}">
                    </div>
                    <div class="product-info">
                        <h2 class="product-name">${product.name}</h2>
                    </div>
                `;

                // Append the product card to the container
                productContainer.appendChild(productCard);
            });

            // Initialize carousel functionality after products are loaded
            initCarousel();
        })
        .catch(error => console.log('Error loading product data:', error));

    // Carousel functionality (next/previous buttons for product scrolling)
    function initCarousel() {
        const productContainers = [...document.querySelectorAll('.product-container')];
        const nxtBtn = [...document.querySelectorAll('.nxt-btn')];
        const preBtn = [...document.querySelectorAll('.pre-btn')];

        // Add event listeners for carousel navigation
        productContainers.forEach((item, i) => {
            let containerDimensions = item.getBoundingClientRect();
            let containerWidth = containerDimensions.width;

            nxtBtn[i].addEventListener('click', () => {
                item.scrollLeft += containerWidth; // Scroll to next product
            });

            preBtn[i].addEventListener('click', () => {
                item.scrollLeft -= containerWidth; // Scroll to previous product
            });
        });
    }

    // Navbar link behavior for smooth scrolling and page navigation
    const navLinks = document.querySelectorAll("nav a"); // Select all navbar links

    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            const targetHref = link.getAttribute("href");

            if (targetHref === "adminpage.html") {
                window.location.href = targetHref; // Direct navigation to AdminPage
            } else if (targetHref === "#Home") {
                // Smooth scroll to the top of the page when "Home" is clicked
                e.preventDefault(); // Prevent default behavior for "Home"
                window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });
            } else if (targetHref === "#Products") {
                e.preventDefault(); // Prevent default behavior for "Products"
            } else {
                // Smooth scroll to specific sections for other links
                const targetId = targetHref.substring(1); // Get target id from the href
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: "smooth", // Smooth scrolling to the section
                        block: "start", // Align the section at the top of the viewport
                    });
                }
            }
        });
    });
});
