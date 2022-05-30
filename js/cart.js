// get data in local storage
function getCartFromLocalStorage() {
    let cart = {};
    const data = localStorage.getItem('cart');

    if (data) {
        cart = JSON.parse(data);
    }
    return cart;
}



function getTotalItems() {
    const cart = getCartFromLocalStorage();
    const itemsArray = Object.keys(cart);
    const totalItems = document.querySelector('.total_items');

    totalItems.innerHTML = itemsArray.length;
}

getTotalItems()