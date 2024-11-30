let allProducts = []; // Store the fetched product data for global access
let cart = []; // Array to store products added to the cart



// Fetch product data from JSON file
fetch("adminjson.json")
    .then(response => response.json())
    .then(products => {
        allProducts = products; // Save the product list
        renderProducts(products); // Render the initial list
    })
    .catch(error => {
        console.error("Error loading products:", error);
        alert("Failed to load products. Please try again later.");
    });

// Function to render products in cards
const renderProducts = (products) => {
    const productList = document.getElementById("product-list");
    productList.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-details">
                <h2 class="product-name">${product.name}</h2>
                <p class="product-price">Price: $${product.price}</p>
                <p class="product-inventory">Stock: ${product.inventory}</p>
                <p class="product-code">Code: ${product.productCode}</p>
                <button class="add-to-cart-btn" data-id="${product.id}" data-image="${product.image}" data-name="${product.name}" data-price="${product.price}" data-inventory="${product.inventory}">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');

    // Attach event listeners to "Add to Cart" buttons
    document.querySelectorAll(".add-to-cart-btn").forEach(button => {
        button.addEventListener("click", (event) => {
            const { id, image, name, price, inventory } = event.target.dataset;
            addToCart({ id, image, name, price, inventory });
        });
    });
};

// Function to add product to cart
const addToCart = (product) => {
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    // Display a temporary message
    showTemporaryMessage(`${product.name} has been added to your cart!`);
};

// Function to show a temporary message
const showTemporaryMessage = (message) => {
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.classList.add("notification"); // Apply the notification style

    document.body.appendChild(notification);

    // Remove the notification after 0.5 seconds with a fade-out effect
    setTimeout(() => {
        notification.classList.add("notification-hidden"); // Add hidden class
        notification.addEventListener("transitionend", () => {
            document.body.removeChild(notification); // Remove after transition
        });
    }, 500); // Show for 0.5 seconds
};

// Function to render the cart modal
const openCartModal = () => {
    const cartModal = document.getElementById("cart-modal");
    const cartItems = document.getElementById("cart-items");
    const checkoutBtn = document.getElementById("checkout-btn"); // Get checkout button

    cartItems.innerHTML = ''; // Clear cart items content

    if (cart.length === 0) {
        cartItems.innerHTML = "<p class='empty-cart-message'>Your cart is empty.</p>";
        checkoutBtn.style.display = "none"; // Hide checkout button if no items in the cart
    } else {
        cart.forEach((product, index) => {
            cartItems.innerHTML += `
                <div class="cart-item" style="position: relative;">
                    <button class="cart-item-remove" data-index="${index}">×</button>
                    <img src="${product.image}" alt="${product.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <p class="cart-item-name">${product.name}</p>
                        <p class="cart-item-price">Price: $${(product.price * product.quantity).toFixed(2)}</p>
                        <div class="cart-item-quantity-controls">
                            <span>Quantity:</span>
                            <button class="decrement-btn" data-index="${index}">-</button>
                            <span class="cart-item-quantity">${product.quantity}</span>
                            <button class="increment-btn" data-index="${index}">+</button>
                        </div>
                    </div>
                </div>
            `;
        });
        checkoutBtn.style.display = "inline-block"; // Show checkout button if there are items
    }

    cartModal.style.display = "block"; // Show the cart modal

    // Attach event listeners to increment, decrement, and remove buttons
    document.querySelectorAll(".increment-btn").forEach(button => {
        button.addEventListener("click", (event) => {
            const index = event.target.dataset.index;
            incrementQuantity(index);
        });
    });

    document.querySelectorAll(".decrement-btn").forEach(button => {
        button.addEventListener("click", (event) => {
            const index = event.target.dataset.index;
            decrementQuantity(index);
        });
    });

    document.querySelectorAll(".cart-item-remove").forEach(button => {
        button.addEventListener("click", (event) => {
            const index = event.target.dataset.index;
            removeFromCart(index);
        });
    });
};


// Increment quantity
const incrementQuantity = (index) => {
    cart[index].quantity++;
    openCartModal();
};

// Decrement quantity
const decrementQuantity = (index) => {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    } else {
        removeFromCart(index);
    }
    openCartModal();
};

// Remove item from cart
const removeFromCart = (index) => {
    cart.splice(index, 1); // Remove the item
    openCartModal();
};

// Function to close cart modal
const closeCartModal = () => {
    document.getElementById("cart-modal").style.display = "none";
};

window.onclick = function(event) {
    const modal = document.getElementById("cart-modal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

// Attach event listener for "My Cart" button
document.getElementById("cart-btn").addEventListener("click", openCartModal);

// Close cart modal functionality
document.getElementById("close-cart-modal").addEventListener("click", closeCartModal);

// Checkout button functionality
document.getElementById("checkout-btn").addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Your cart is empty. Add items before checkout.");
    } else {
        // Calculate the total cost of items in the cart
        const totalCost = cart.reduce((sum, product) => sum + product.price * product.quantity, 0);

        // Pass the cart items and total cost as query parameters in the URL
        const cartItems = encodeURIComponent(JSON.stringify(cart)); // Encode the cart items array
        window.location.href = `checkoutpage.html?cartItems=${cartItems}&totalCost=${totalCost}`;
    }
});

// Sorting functionality
document.getElementById("sort-select").addEventListener("change", (event) => {
    const sortValue = event.target.value;
    let sortedProducts = [...allProducts];

    switch (sortValue) {
        case "price-asc":
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case "price-desc":
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case "productCode-asc":
            sortedProducts.sort((a, b) => a.productCode.localeCompare(b.productCode));
            break;
        case "productCode-desc":
            sortedProducts.sort((a, b) => b.productCode.localeCompare(a.productCode));
            break;
        default:
            break;
    }

    renderProducts(sortedProducts);
});

// Search functionality
document.getElementById("search-input").addEventListener("input", (event) => {
    const query = event.target.value.toLowerCase();
    const filteredProducts = allProducts.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.productCode.toLowerCase().includes(query)
    );
    renderProducts(filteredProducts);
});
