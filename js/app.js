

// Element select function
function $(selector) {
    return document.querySelector(selector);
}


// Select required element
const nav = $("#navbar");
const display = $(".food_container");
const modal = $(".modal");
const overlay = $(".overlay");
const closeBtn = $(".close");
const toggler = $('.menu_toggle');
const modalContent = $('.modal_content')


// Overlay onclick function
overlay.onclick = close;
closeBtn.onclick = close;


// Close modal function
function close() {
    modal.style.display = "none";
}
close();

function modalOpen() {
    modal.style.display = 'block';
}

toggler.onclick = function () {
    nav.classList.toggle('show');
}

// Menu toggle event
$(".menu_toggle").addEventListener('click', function (e) {
    nav.classList.toggle("show");
})



// Load data from database
window.onload = getCategories;
let categories;

async function getCategories() {
    const response = await fetch('./../resources/categories.json');

    const data = await response.json();
    categories = data.categories;
    showCategories();
}



// Show the data on UI
function showCategories() {
    display.innerHTML = '';

    categories.forEach(({ idCategory, strCategory, strCategoryThumb, strCategoryDescription }) => {

        const div = document.createElement('div');
        div.className = 'category_card';
        div.innerHTML = `
            <div class="category_img">
                <img src="${strCategoryThumb}" alt="" />
            </div>
            <h3>${strCategory}</h3>
            <div class="category_bottom">
                <button id="seeMore_btn" onclick="getCategory('${strCategory}')">See More</button>
                <button onclick="getDetails(${idCategory})">Get Details</button>
            </div>
            `
        console.log(idCategory);
        display.appendChild(div);
    })
}


// Show details on UI
function getDetails(id) {
    modalOpen();
    const selectedCategory = categories.find(category => category.idCategory === id + '');
    modalContent.innerHTML = `
        <div className="category_details">
        <div class="food_img">
        <img src=${selectedCategory.strCategoryThumb} alt="">
        </div>
        <h2>Category: ${selectedCategory.strCategory}</h2>
        <p style="margin-top:20px"><b>Description</b>: ${selectedCategory?.strCategoryDescription?.slice(0, 500)}</p>
        </div>
        `
    modalContent.appendChild(div);
}



async function getCategory(catName) {
    console.log(catName);

    const response = await fetch('./../resources/foods.json');
    const { meals } = await response.json();
    const filteredFoods = meals.filter(food => food.category === catName);

    display.innerHTML = '';
    filteredFoods.forEach(
        ({ idMeal, category, strMeal, strMealThumb, price }) => {
            const div = document.createElement('div');
            div.className = 'category_card';
            div.innerHTML = `
                    <div class="category_img">
                    <img style="width:350px" src="${strMealThumb}" alt="" /></div>
                    <h3>Price: ${price} TK.</h3>
                    <p style="margin:5px 15px">Name: ${strMeal.slice(0, 20)}</p>
                    <div class="category_bottom">
                    <button id="seeBtn" onclick="addToCart('${idMeal}')">Add to card</button>
                    </div>`;

            display.appendChild(div);
        }
    )
}



function getCartFromLocalStorage() {
    let cart = {};
    const data = localStorage.getItem('cart');

    if (data) {
        cart = JSON.parse(data);
    }
    return cart;
}


function addToCart(id) {
    const cart = getCartFromLocalStorage();
    const itemsArray = Object.keys(cart);
    const isExist = itemsArray.find(item => item === id);

    if (isExist) {
        cart[id] += 1;
    }
    else {
        cart[id] = 1
    }

    const totalItems = document.querySelector('.total_items');
    totalItems.innerHTML = itemsArray.length;

    localStorage.setItem('cart', JSON.stringify(cart))
}

