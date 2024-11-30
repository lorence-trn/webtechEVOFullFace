// Function to extract query parameters from the URL
function getQueryParameter(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Get the cart items and totalCost from the URL
const cartItemsData = getQueryParameter('cartItems');
const totalCost = getQueryParameter('totalCost');

// Parse cart items data (assuming it's a JSON string)
let cartItems = [];
if (cartItemsData) {
    try {
        cartItems = JSON.parse(decodeURIComponent(cartItemsData));
    } catch (error) {
        console.error("Error parsing cart items data:", error);
    }
}

// Display the total cost in the Order Summary section
const totalPriceElement = document.getElementById('total-price');
if (totalCost) {
    totalPriceElement.textContent = `Total Price: $${parseFloat(totalCost).toFixed(2)}`;
} else {
    totalPriceElement.textContent = '';
}

// Function to render the cart items in the Order Summary
const renderOrderSummary = () => {
    const orderItemsElement = document.getElementById('order-items');
    orderItemsElement.innerHTML = ''; // Clear previous content

    if (cartItems.length === 0) {
        orderItemsElement.innerHTML = "<p>No items in the cart.</p>";
    } else {
        cartItems.forEach(item => {
            orderItemsElement.innerHTML += `
                <div class="order-item">
                    <p><strong>${item.name}</strong></p>
                    <p>Quantity: ${item.quantity}</p>
                    <p>Price: $${(item.price * item.quantity).toFixed(2)}</p>
                </div>
            `;
        });
    }
};

// Render the order summary when the page loads
renderOrderSummary();

// Place Order Button Event Listener
document.getElementById('place-order-btn').addEventListener('click', () => {
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const contact = document.getElementById('contact').value;
    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;

    if (name && address && contact && paymentMethod) {
        alert(`Thank you, ${name}! Your order has been placed.\n\nPayment Method: ${paymentMethod}\nShipping Address: ${address}\nTotal Amount: $${parseFloat(totalCost).toFixed(2)}`);
        // Redirect to a thank-you page or reset form here
        // window.location.href = "thankyou.html"; // Uncomment to redirect to a thank-you page
    } else {
        alert("Please fill in all the required details.");
    }
});
// Place Order Button Event Listener
document.getElementById('place-order-btn').addEventListener('click', () => {
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const contact = document.getElementById('contact').value;
    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;

    if (name && address && contact && paymentMethod) {
        alert(`Thank you, ${name}! Your order has been placed.\n\nPayment Method: ${paymentMethod}\nShipping Address: ${address}\nTotal Amount: $${parseFloat(totalCost).toFixed(2)}`);

        // Reset all the input fields after the alert
        document.getElementById('checkout-form').reset(); // Reset the form fields (name, address, contact)
        document.getElementById('payment-form').reset();  // Reset the payment method (radio buttons)

        // Reset the Order Summary
        const orderItemsElement = document.getElementById('order-items');
        orderItemsElement.innerHTML = ''; // Clear the order items
        const totalPriceElement = document.getElementById('total-price');
        totalPriceElement.textContent = ''; // Clear the total price

        // Remove the query parameters from the URL to avoid showing the same cart items
        const url = window.location.href.split('?')[0]; // Get the current URL without the query string
        window.history.replaceState({}, '', url); // Replace the URL without the query parameters

        // Redirect to the main page (index.html)
        window.location.href = "index.html"; // This line navigates to index.html
    } else {
        alert("Please fill in all the required details.");
    }
});
