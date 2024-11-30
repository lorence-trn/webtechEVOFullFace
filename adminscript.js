let products = []; // This will hold the products data
let cart = []; // This will hold the cart items

// Fetch initial products data
fetch("adminjson.json")
    .then(response => response.json())
    .then(data => {
        products = data; // Load products data into the global variable
        renderProducts(products);
    });

// Render the product table dynamically
const renderProducts = (products) => {
    const placeholder = document.querySelector("#data-output");
    placeholder.innerHTML = products.map(product => `
        <tr>
            <td><img src='${product.image}' alt='${product.name}' width='50'></td>
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td>${product.inventory}</td>
            <td>${product.productCode}</td>
            <td>
                <button class="delete-btn" data-code="${product.productCode}">Delete</button>
                <button class="update-btn" data-code="${product.productCode}">Update</button>
            </td>
        </tr>
    `).join('');

    // Attach event listeners to action buttons
    attachButtonListeners();
};

// Attach event listeners to delete and update buttons
const attachButtonListeners = () => {
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', deleteProduct);
    });

    document.querySelectorAll('.update-btn').forEach(button => {
        button.addEventListener('click', openUpdateModal);
    });
};

// Add product modal management
document.getElementById("add-btn").addEventListener("click", () => {
    document.getElementById("add-product-modal").style.display = "block";
});

document.getElementById("close-add-modal").addEventListener("click", () => {
    document.getElementById("add-product-modal").style.display = "none";
});

// Update product modal management
document.getElementById("close-update-modal").addEventListener("click", () => {
    document.getElementById("update-product-modal").style.display = "none";
});

// Add a new product
document.getElementById("add-product-form").addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent form submission

    const newProduct = {
        name: document.getElementById("name").value,
        price: document.getElementById("price").value,
        inventory: document.getElementById("inventory").value,
        productCode: document.getElementById("productCode").value,
        image: document.getElementById("image").value
    };

    // Check for duplicate product code
    if (products.some(product => product.productCode === newProduct.productCode)) {
        alert('A product with the same product code already exists.');
    } else {
        products.push(newProduct);
        renderProducts(products);
        document.getElementById("add-product-form").reset();
        document.getElementById("add-product-modal").style.display = "none";
    }
});

// Open the update modal with pre-filled data
const openUpdateModal = (event) => {
    const productCode = event.target.getAttribute('data-code');
    const product = products.find(p => p.productCode === productCode);

    if (product) {
        document.getElementById("update-productCode").value = product.productCode;
        document.getElementById("update-name").value = product.name;
        document.getElementById("update-price").value = product.price;
        document.getElementById("update-inventory").value = product.inventory;
        document.getElementById("update-image").value = product.image;

        document.getElementById("update-product-modal").style.display = "block";
    }
};

// Update the product
document.getElementById("update-product-form").addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent form submission

    const updatedProduct = {
        productCode: document.getElementById("update-productCode").value,
        name: document.getElementById("update-name").value,
        price: document.getElementById("update-price").value,
        inventory: document.getElementById("update-inventory").value,
        image: document.getElementById("update-image").value
    };

    const index = products.findIndex(p => p.productCode === updatedProduct.productCode);
    if (index !== -1) {
        products[index] = updatedProduct; // Update the product in the array
        renderProducts(products);
        document.getElementById("update-product-modal").style.display = "none";
    }
});

// Delete a product
const deleteProduct = (event) => {
    const productCode = event.target.getAttribute('data-code');
    products = products.filter(product => product.productCode !== productCode);
    renderProducts(products);
};

// Example add-to-cart function
const addToCart = (event) => {
    const productCode = event.target.getAttribute('data-code');
    const product = products.find(p => p.productCode === productCode);

    if (!cart.some(item => item.productCode === productCode)) {
        cart.push(product);
        alert(`${product.name} added to cart!`);
    } else {
        alert(`${product.name} is already in the cart!`);
    }
};
