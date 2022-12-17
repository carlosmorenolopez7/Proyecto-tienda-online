class Carrito {
    constructor(products){
        this.products = products;
    }

    getProducts(){
        return this.products;
    }

    addProduct(product){
        this.products.push(product);
    }

    removeProduct(productID, productSize){
        let productsCart = this.products;
        for(let product of this.products){
            if((product.id == productID) && (product.size == productSize)){
                productsCart.splice(productsCart.indexOf(product), 1);
            }
        }
        this.products = productsCart;
        localStorage.articlesList = JSON.stringify(this.products);
    }

    updateProduct(productID, productSize, quantity){
        let productsCart = this.products;
        productsCart.forEach(product =>{
            if((product.id == productID) && (product.size == productSize)){
                product.quantity = parseInt(quantity);
            }
        })
        this.products = productsCart;
        localStorage.articlesList = JSON.stringify(this.products);
    }
    
    calculateSubtotal(){
        var subtotal = 0;
        for(let product of this.products){
            subtotal += product.price * product.quantity;
        }
        return subtotal;
    }

    calculateTotal(){
        return this.calculateSubtotal() + 4.99;
    }
}

if(!localStorage.articlesList){
    var articlesList = [];
}else{
    var articlesList = JSON.parse(localStorage.getItem('articlesList'))
}

var myCart = new Carrito(articlesList);
window.onload = ()=>{
    mainContainer = document.getElementsByTagName("main")[0];
    showHome();
    document.getElementById("header--logo").addEventListener("click", ()=>{
        showHome();
        document.querySelectorAll(".nav--link").forEach(element => {
            element.classList.remove("selected");
        })
    })
    let navLinks = document.querySelectorAll(".nav--link");
    navLinks.forEach(element => {
        element.addEventListener("click", ()=>{
            navLinks.forEach(span => {
                span.classList.remove("selected");
            });
            element.classList.add("selected");
        })
    })
    let sections = document.querySelectorAll(".section");
    for(let i = 0; i < sections.length; i++){
        sections[i].addEventListener("click", ()=>{
            navLinks.forEach(span => {
                span.classList.remove("selected");
            });
            navLinks[i].classList.add("selected");
        })
    }
    navLinks[0].addEventListener("click", ()=>{
        showArticlesSection("Men");
    })
    document.getElementById("men").addEventListener("click", ()=>{
        showArticlesSection("Men");
    })
    navLinks[1].addEventListener("click", ()=>{
        showArticlesSection("Women");
    })
    document.getElementById("women").addEventListener("click", ()=>{
        showArticlesSection("Women");
    })
    navLinks[2].addEventListener("click", ()=>{
        showArticlesSection("Jewelry");
    })
    document.getElementById("jewelry").addEventListener("click", ()=>{
        showArticlesSection("Jewelry");
    })
    navLinks[3].addEventListener("click", ()=>{
        showArticlesSection("Electronics");
    })
    document.getElementById("electronics").addEventListener("click", ()=>{
        showArticlesSection("Electronics");
    })
    document.getElementById("cart").addEventListener("click", ()=>{
        showShoppingCart(myCart);
        document.querySelectorAll(".nav--link").forEach(element => {
            element.classList.remove("selected");
        })
    })
    document.getElementById("login").addEventListener("click", ()=>{
        showLogInRegister();
    })
}

function showHome(){
    mainContainer.id = "home";
    mainContainer.innerHTML = "";
    let home = $(`<div class="section" id="men">
                    <h2 class="sectionTitle">MEN CLOTHING</h2>
                    <div class="sectionImg">
                        <img src="men.jpg" alt="">
                    </div>
                </div>
                <div class="section" id="women">
                    <h2 class="sectionTitle">WOMEN CLOTHING</h2>
                    <div class="sectionImg">
                        <img src="women.jpg" alt="">
                    </div>
                </div>
                <div class="section" id="jewelry">
                    <h2 class="sectionTitle">JEWELRY</h2>
                    <div class="sectionImg">
                        <img src="jewelry.jpg" alt="">
                    </div>
                </div>
                <div class="section" id="electronics">
                    <h2 class="sectionTitle">ELECTRONICS</h2>
                    <div class="sectionImg">
                        <img src="electronics.jpg" alt="">
                    </div>
                </div>`);
    $("#home").append(home);
}

function showArticlesSection(section){
    mainContainer.id = "mainArticles";
    mainContainer.innerHTML = "";
    let sectionName;
    if(section == "Men" || section == "Women"){
        sectionName = section.toUpperCase() + " CLOTHING";
    }else if(section == "Jewelry"){
        sectionName = "JEWELRY";
    }else if(section == "Electronics"){
        sectionName = "ELECTRONICS";
    }
    let mainHeader = $(`<div class="mainHeader">
        <h2>${sectionName}</h2>
        <div class="orderBy">
            <span>Order: </span>
            <select class="order">
                <option value="asc">Upwards</option>
                <option value="desc">Downwards</option>
            </select>
        </div>
    </div>`);
    $("#mainArticles").append(mainHeader);
    let divArticles = $(`<div class="divArticles"></div>`);
    $("#mainArticles").append(divArticles);
    lanzarPeticionSeccion(section, "asc");
    $(".order").change(function(){
       lanzarPeticionSeccion(section, $(".order").val());
    });
}

function showArticleInfo(id){
    mainContainer.id = "mainArticleInfo";
    mainContainer.innerHTML = "";
    lanzarPeticionarticle(id);
}

function addArticleToCart(id, name, description, price, img, quantity, size, category){
    var Article = {
        id: id,
        title: name,
        description: description,
        price: price,
        img: img,
        quantity: quantity,
        size: size,
        category: category
    }
    console.log(Article)
    var productExists = false;
    articlesList.forEach(article =>{
        if(article.id == Article.id && article.size == Article.size){
            article.quantity += quantity;
            myCart.subtotal += Article.price;
            productExists = true;
        }
    })
    if(!productExists){
        articlesList.push(Article);
        myCart.subtotal += Article.price;
    }
    localStorage.articlesList = JSON.stringify(articlesList);
}

function showShoppingCart(myCart){
    mainContainer.id = "shoppingCart";
    mainContainer.innerHTML = "";
    let emptyShoppingCart = '';
    if(myCart.products.length == 0){
        emptyShoppingCart += `<h3>There are no products in your cart</h3>`;
    }else{
        myCart.products.forEach(product =>{
            let size;
            if((product.category == "electronics") || (product.category == "jewelery")){
                size = "";
            }else{
                size = " / " + product.size;
            }
            emptyShoppingCart += `<div class="shoppinCartProduct">
                <figure>
                    <img src="${product.img}" alt="">
                </figure>
                <div class="productInfo">
                    <div class="productName">
                        <h3>${product.title}${size}</h3>
                    </div>
                    <div class="productPrice">
                        <h4>${(product.price * product.quantity).toFixed(2)} $</h4>
                        <div class="quantity">
                            <span>Quantity: </span>
                            <input type="number" class="productQuantity" value="${product.quantity}" min=1>
                        </div>
                    </div>
                </div>
                <span class="deleteProductBtn">x</span>
                <input type="hidden" value="${product.id}" class="productID">
                <input type="hidden" value="${product.size}" class="productSize">
            </div>`;
        })
    }
    let shoppingTitle = $(`<h2 id="shoppingTitle">Your Cart</h2>`); 
    let shoppingContainer = $(`<div id="shoppingContainer">
            <section id="shoppingContainer--products">
                ${emptyShoppingCart}
            </section>
            <section id="shoppingContainer--price">
                <div id="price">
                    <div id="subtotal">
                        <p class="subtotal--text">Subtotal: <span id="subtotal--price">${(myCart.calculateSubtotal()).toFixed(2)} $</span></p>
                        <p id="subtotal--text">Shipping costs: <span id="subtotal--price">4.99 $</span></p>
                    </div>
                    <div id="total">
                        <p id="total--text">Total: <span id="total--price">${(myCart.calculateTotal()).toFixed(2)}$</span></p>
                    </div>
                </div>
                <div id="linkComprar">
                    <button id="buy">Buy</button>
                </div>
            </section>
        </div>`);
    $("#shoppingCart").append(shoppingTitle);
    $("#shoppingCart").append(shoppingContainer);
    $(".deleteProductBtn").click(function(){
        if($(this).siblings(".productSize").val() == "undefined"){
            myCart.removeProduct($(this).siblings(".productID").val(), "");
        }else{
            myCart.removeProduct($(this).siblings(".productID").val(), $(this).siblings(".productSize").val());
        }
        
        $(this).parent().slideUp();
        setTimeout(function(){
            showShoppingCart(myCart);
        }, 400);
    })
    $(".productQuantity").change(function(){
        if($(this).siblings(".productSize").val() == "undefined"){
            myCart.updateProduct($(this).parent().parent().parent().siblings(".productID").val(), $(this).parent().parent().parent().siblings(".productSize").val(), $(this).val());
        }else{
            myCart.updateProduct($(this).parent().parent().parent().siblings(".productID").val(), $(this).parent().parent().parent().siblings(".productSize").val(), $(this).val());
        }
        myCart.updateProduct()
        showShoppingCart(myCart);
    })
    $("#buy").click(function(){
        showCheckOut();
    })
}

function showLogInRegister(){
    mainContainer.id = "loginRegister";
    mainContainer.innerHTML = "";
    let forms = $(`<form action="" id="logIn" class="form">
            <h2>Log In</h2>
            <div class="inputs">
                <div class="input">
                    <label for="username">Username</label>
                    <input type="text" id="username">
                </div>
                <div class="input">
                    <label for="password">Password</label>
                    <input type="password" id="password">
                </div>
            </div>
            <input type="submit" value="Log In">
        </form>
        <form action="" id="register" class="form">
            <h2>Register</h2>
            <div class="inputs">
                <div class="input">
                    <label for="name">Name</label>
                    <input type="text" id="name">
                </div>
                <div class="input">
                    <label for="surnames">Surname</label>
                    <input type="text" id="surnames">
                </div>
                <div class="input">
                    <label for="username">Username</label>
                    <input type="text" id="username">
                </div>
                <div class="input">
                    <label for="email">Email</label>
                    <input type="email" id="email">
                </div>
                <div class="input">
                    <label for="password">Password</label>
                    <input type="password" id="password">
                </div>
            </div>
            <input type="submit" value="Register">
        </form>`);
    $("#loginRegister").append(forms);
    $(".form").submit(function(e){
        e.preventDefault();
    })
}

function showCheckOut(){
    mainContainer.id = "checkOut";
    mainContainer.innerHTML = "";
    let form = $(`<form action="" id="checkOutForm">
            <div id="directionData">
                <h2>Check Out</h2>
                <div class="input">
                    <label for="name">Name</label>
                    <input type="text" id="name" name="name">
                </div>
                <div class="input">
                    <label for="surnames">Surname</label>
                    <input type="text" id="surnames" name="surname">
                </div>
                <div class="input">
                    <label for="direction">Address</label>
                    <input type="text" id="direction" name="direction">
                </div>
                <div class="input">
                    <label for="email">Email</label>
                    <input type="email" id="email" required pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}">
                </div>
            </div>
            <div id="paymentData">
                <h2>Payment</h2>
                <div class="input">
                    <label for="headliner">Headliner</label>
                    <input type="text" id="headliner">
                </div>
                <div class="input">
                    <label for="cardNumber">Card Number</label>
                    <input type="text" id="cardNumber" required maxlength="16" pattern="^[0-9]{16}$" >
                </div>
                <div>
                    <label for="expiry">Date of Expiry</label>
                    <div class="select">
                        <select name="month" id="months">
                            <option hidden selected value="MM">Month</option>
                            <option value="1">01</option>
                            <option value="2">02</option>
                            <option value="3">03</option>
                            <option value="4">04</option>
                            <option value="5">05</option>
                            <option value="6">06</option>
                            <option value="7">07</option>
                            <option value="8">08</option>
                            <option value="9">09</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                        </select>
                        <select name="year" id="years">
                            <option hidden selected value="YY">Year</option>
                            <option value="2021">2021</option>
                            <option value="2022">2022</option>
                            <option value="2023">2023</option>
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                            <option value="2027">2027</option>
                            <option value="2028">2028</option>
                            <option value="2029">2029</option>
                            <option value="2030">2030</option>
                            <option value="2031">2031</option>
                        </select>
                    </div>
                </div>
                <div class="input">
                    <label for="cvv">CVV</label>
                    <input type="text" id="cvv" required  maxlenght="3">
                </div>
            </div>
            <input type="submit" value="Pay" id="submitCheckOut">
        </form>`);
    $("#checkOut").append(form);

}

var httpRequest = new XMLHttpRequest();

function lanzarPeticionSeccion(section, orderBy){
    let sectionName;
    if(section == "Men"){
        sectionName = "men's%20clothing";
    }else if(section == "Women"){
        sectionName = "women's%20clothing";
    }else if(section == "Jewelry"){
        sectionName = "jewelery";
    }else if(section == "Electronics"){
        sectionName = "electronics";
    }
    httpRequest.open("GET", "https://fakestoreapi.com/products/category/"+sectionName+"?sort="+orderBy);
    httpRequest.onreadystatechange = tratarPeticionSeccion;
    httpRequest.send();
}

function tratarPeticionSeccion(){
    if(httpRequest.readyState === XMLHttpRequest.DONE){
        if(httpRequest.status === 200){
            $(".divArticles").html("");
            articles = JSON.parse(httpRequest.responseText);
            articles.forEach(article =>{
                let articleCard = $(`
                <div class='articleCard'>
                    <div class='articleCard--image'>
                        <img src='${article.image}' alt=''>
                    </div>
                    <div class='articleCard--info'>
                        <span class='articleCard--name'>${article.title}</span>
                        <span class='articleCard--price'>${article.price} $</span>
                    </div>
                    <input type="hidden" value=${article.id} class="articleID">
                </div>`);
                $(".divArticles").append(articleCard);
            })
            $(".articleCard--image").click(function(){
                showArticleInfo($(this).siblings(".articleID").val())
            })
            $(".articleCard--name").click(function(){
                showArticleInfo($(this).parent().siblings(".articleID").val())
            })
        }
    }
}

function lanzarPeticionarticle(id){
    httpRequest.open("GET", "https://fakestoreapi.com/products/"+id);
    httpRequest.onreadystatechange = tratarInfoarticle;
    httpRequest.send();
}

function tratarInfoarticle(){
    if(httpRequest.readyState === XMLHttpRequest.DONE){
        if(httpRequest.status === 200){
            info = JSON.parse(httpRequest.responseText);
            let size = "";
            if((info.category == "electronics") || (info.category == "jewelery")){
                size = "";
            }else{
                size = `<div class="size">
                <h4>Size</h4>
                <select name="" id="size">
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                </select>
            </div>`;
            }
            articleDiv = $(`<div class='articleDiv--image'>
                    <img src='${info.image}' alt=''>
                </div>
                <div class='articleDiv--info'>
                    <h2>${info.title}</h2>
                    <h3>Description</h3>
                    <p class="articleDiv--description">${info.description}</p>
                    <p class="articleDiv--price">${info.price} $</p>
                    <div class="shoppingDetails">
                    <div class="quantity">
                        <h4>Quantity</h4>
                        <select name="" id="quantity">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </select>
                    </div>
                    ${size}
                    <input type="hidden" value="${info.category}" id="productCategory">
                </div>
                <div class="addToCart">Add to cart</div>
                </div>`);
        }
        $("#mainArticleInfo").append(articleDiv);
        $(".addToCart").click(function(){
            if($("#size").val() == undefined){
                addArticleToCart(info.id, info.title, info.description, info.price, info.image, parseInt($("#quantity").val(), 10), "", info.category);
            }else{
                addArticleToCart(info.id, info.title, info.description, info.price, info.image, parseInt($("#quantity").val(), 10), $("#size").val(), info.category);
            }
        })
    }
}
