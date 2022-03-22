(function () {

    // Element select function
    function $(selector) {
        return document.querySelector(selector);
    }


    // Select required element
    const nav = $("#navbar");
    const foodContainer = $(".food_container");
    const modal = $(".modal");
    const overlay = $(".overlay");
    const close = $(".close");




    // Menu toggle event
    $(".menu_toggle").addEventListener('click', function (e) {
        nav.classList.toggle("show");
    })



    // Load data from database
    window.onload = getCategories;
    let categories;

    async function getCategories() {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');

        const data = await response.json();
        categories = data.categories;
        showCategories();
    }



    // Show the data on UI
    function showCategories() {
        foodContainer.innerHTML = '';
        categories.forEach(({ idCategory, strCategory, strCategoryThumb, strCategoryDescription }) => {
            // console.log(categories);
            const div = document.createElement('div');
            div.className = 'category_card';
            div.innerHTML = `
            <div class="category_img">
                <img src="${strCategoryThumb}" alt="" />
            </div>
            <h3>${strCategory}</h3>
            <div class="category_bottom">
                <button id="seeMore_btn">See More</button>
                <button onClick="inDetails(${idCategory})">In Details</button>
            </div>
            `
            foodContainer.appendChild(div);
        })
    }


    // Overlay onclick function
    overlay.onclick = closeModal;
    close.onclick = closeModal;


    // Close modal function
    function closeModal() {
        modal.style.display = "none";
    }

})()