const tBody = document.getElementById('cart_items');

// get data in local storage
function getCartFromLocalStorage() {
    let cart = {};
    const data = localStorage.getItem('cart');

    if (data) {
        cart = JSON.parse(data);
    }
    return cart;
}


// get cart data from local storage
function getTotalItems() {
    const cart = getCartFromLocalStorage();
    const itemsArray = Object.keys(cart);
    const totalItems = document.querySelector('.total_items');

    totalItems.innerHTML = itemsArray.length;
}
getTotalItems();

let cartItems = [];


// Fetch data from json file
async function getFoods() {
    const response = await fetch('./../resources/foods.json');
    const { meals } = await response.json();
    // console.log(meals);

    const cart = getCartFromLocalStorage();
    const itemsArray = Object.keys(cart);
    // console.log(itemsArray);


    itemsArray.forEach(id => {
        meals.forEach(food => {
            if (food.idMeal === id) {
                food.quantity = cart[id];
                food.subTotal = food.price * food.quantity;
                cartItems.push(food);
            }
        })
    })
    // console.log(cartItems);

    cartItems.forEach(
        ({ strMeal, quantity, price, subTotal, idMeal }) => {
            const tr = document.createElement("tr");

            tr.addEventListener("click", function (e) {
                const newTr = this;
                changeItem(e, newTr, idMeal, price)
            });

            tr.innerHTML = `
                <td style="text-align: left">${strMeal}</td>
                <td id="quantity">
                <button id="increment">+</button>
                <input value=${quantity} type="text" readonly />
                <button id="decrement">-</button>
                </td>
                <td><span id='subtotal'>${subTotal} Tk.</span></td>
                <td id="removeItem"><i id="remove" class="fas fa-times"></i></td>
                `;
            // console.log(tr);
            tBody.appendChild(tr)
        });
    getSubTotalAmount();
}

getFoods();



// Get sub total amount
function getSubTotalAmount() {

    let subTotal = 0;
    cartItems.forEach(food => {
        subTotal += food.subTotal;
    })

    document.getElementById('subTotal').innerHTML = `${subTotal} Tk`;
}



// Remove, Increment and decrement cart data from UI and Local Storage
function changeItem(e, tr, id, price) {

    const cart = getCartFromLocalStorage();
    const targetElement = e.target;
    const input = [...targetElement.parentElement.children].find(item => item.type === "text");

    if (targetElement.id === 'remove') {

        delete cart[id];
        const newFoodArray = [];
        cartItems.forEach(food => {
            if (food.idMeal !== id) {
                newFoodArray.push(food);
            }
        })
        cartItems = newFoodArray;

        getTotalItems();
        getSubTotalAmount();
        tr.remove();
    }
    else if (targetElement.id === 'increment') {

        input.value = Number(input.value) + 1;
        const subTotal = input.value * price;
        const sub = tr.querySelector("#subtotal");
        ++cart[id];
        sub.innerHTML = `${subTotal} Tk.`;
        updateTotalAmount(id, subTotal);
    }
    else if (targetElement.id === 'decrement') {

        if (input.value === '1') return;
        input.value = Number(input.value) - 1;
        const subTotal = input.value * price;
        const sub = tr.querySelector("#subtotal");
        --cart[id];
        sub.innerHTML = `${subTotal} Tk.`;
        updateTotalAmount(id, subTotal);

    }
    localStorage.setItem('cart', JSON.stringify(cart));
}


function updateTotalAmount(id, subTotal) {
    cartItems.forEach((food) => {
        if (food.idMeal === id) {
            food.subTotal = subTotal;
            getSubTotalAmount();
        }
    });
}


document.getElementById('checkout').addEventListener('click', function (e) {
    localStorage.clear();
    location.pathname = './../checkOut.html';
})