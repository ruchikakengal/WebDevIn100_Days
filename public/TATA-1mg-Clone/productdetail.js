import {navbar} from './navbar.js';
document.getElementById("navimport").innerHTML = navbar();


const id= localStorage.getItem("productid");
console.log(id);
// setInterval(function() {
//     var loadlater = document.getElementById("summarycontainer");
    
// },2000)

function smallimagesdisplay(){
    let smallImages = document.querySelectorAll('#smallimages img');
    let mainImage = document.querySelector('#mainimage img');

    smallImages.forEach(smallImage => {
        smallImage.addEventListener('click', () => {
            console.log(smallImage)
        mainImage.src = smallImage.src;
    
        smallImages.forEach(img => img.classList.remove('active'));
        smallImage.classList.add('active');
        });
    });
}

    
const getdata= async () => {
    let url=`https://json-server-1017.onrender.com/products/?id=${id}`;
    //let url =`https://ballalamit.github.io/tata1mgjsonserver/db.json?id=${id}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data)
    displayproduct(data);
    smallimagesdisplay();
}
getdata();

function displayproduct(data){
    document.getElementById("mainimage").innerHTML=""
    data.map(elem =>{
        let image= document.createElement("img");
        image.src = elem.image;
        
        let image1= document.createElement("img");
        image1.src = elem.image;
        image1.classList.add('active');

        let image2 = document.createElement("img");
        image2.src = elem.image2;
        //document.getElementById("smallimages").append(image2);

        let image3 = document.createElement("img");
        image3.src = elem.image3;
        //document.getElementById("smallimages").append(image3);

        let image4 = document.createElement("img");
        image4.src = elem.image4;
        document.getElementById("smallimages").append(image1,image2,image3, image4);
        
        // document.getElementById("mainimage").innerHTML = ''; // clear out previous images
        document.getElementById("mainimage").append(image);

  // code for my mid div

        let title= document.createElement("h1");
        title.textContent=elem.title

        let subtitle = document.createElement("a");
        subtitle.textContent=elem.subTitle
        subtitle.href="https://www.1mg.com/manufacturer/tata-1mg-healthcare-solutions-private-limited-83094";

        

        //rating section

        let ratingsdiv = document.createElement("div");
        ratingsdiv.setAttribute("id", "ratingsdiv");
        let stardiv = document.createElement("div");
        stardiv.setAttribute("class", "stardiv");
        let rating = document.createElement("p");
        rating.textContent=elem.rate;
        let star = document.createElement("i");
        star.setAttribute("class", "fa-solid fa-star");
        stardiv.append(rating, star);
        ratingsdiv.append(stardiv);
        

        let reviewdiv = document.createElement("div");
        reviewdiv.setAttribute("id", "reviewdiv");
        let review = document.createElement("p");
        review.textContent= "355 Ratings & 31 Reviews";
        reviewdiv.append(review);

        let mainratingsdiv = document.createElement("div");
        mainratingsdiv.setAttribute("id", "mainratingsdiv");

        mainratingsdiv.append(ratingsdiv,reviewdiv )

            //packsize
        let packsize=document.createElement("p")
        packsize.textContent="Pack Size (1)"

            //capsule div
        let capsulediv=document.createElement("div");
        capsulediv.setAttribute("class", "capsulediv");
        let capsules=document.createElement("p");
        capsules.textContent=elem.count;
        let capsuleprice= document.createElement("p");
        capsuleprice.textContent= "₹"+elem.price;
        

        capsulediv.append(capsules, capsuleprice)

            //product highlights
       
        let highlights=document.createElement("h4");
        highlights.textContent="Product highlights";

        let highlightsList = document.createElement("ul");
        let highlight1 = document.createElement("li");
        highlight1.textContent = "Contains 30 billion CFU plus 14 live probiotic strains and prebiotic fibre";
        let highlight2 = document.createElement("li");
        highlight2.textContent = "Boosts immune system";
        let highlight3 = document.createElement("li");
        highlight3.textContent = "Relieves gas and bloating";
        let highlight4 = document.createElement("li");
        highlight4.textContent = "Non-GMO with no added preservatives";

        highlightsList.append(highlight1, highlight2, highlight3, highlight4);

      
        let highlightsContainer = document.createElement("div");
        highlightsContainer.setAttribute("class", "highlights-container");

        highlightsContainer.append(highlights, highlightsList);



        document.getElementById("detailscontainer").append(title, subtitle,mainratingsdiv,packsize,capsulediv,highlightsContainer);
    
        //summarycontainer alias right side div

        let normalpricediv = document.createElement("div");
        normalpricediv.setAttribute("class", "normalpricediv");

        let circleicon = document.createElement("i");
        circleicon.setAttribute("class", "fa-regular fa-circle-dot");

        let normalprice = document.createElement("p");
        normalprice.textContent= "₹"+elem.price;

        let dashprice= document.createElement("p");
        // dashprice.textContent= "₹" + (elem.price+100);
        dashprice.textContent= "₹" + Math.floor(elem.price/(1-elem.off/100))
        dashprice.style.textDecoration = "line-through";

        let discountdiv= document.createElement("div");
        discountdiv.setAttribute("class", "discountdiv");
        let discount= document.createElement("p");
        // discount.textContent= Math.round((elem.price + 100)/(elem.price/10)) + "% off";
        discount.textContent=elem.off +"% off";
        discountdiv.append(discount);
        normalpricediv.append(circleicon,normalprice,dashprice,discountdiv);
        document.getElementById("productpricediv").append(normalpricediv);

                //careplan div
        let careplanpricediv = document.createElement("div");
        careplanpricediv.setAttribute("class", "careplanpricediv");

        let circleiconcareplan = document.createElement("i");
        circleiconcareplan.setAttribute("class", "fa-regular fa-circle");

        let rightsidediv=document.createElement("div");
        rightsidediv.setAttribute("class", "rightsidediv");


        let careplantextdiv= document.createElement("div");
        careplantextdiv.setAttribute("class", "careplantextdiv");

        let price = document.createElement("p");
        price.textContent= "₹"+elem.price;

        let careplanimage= document.createElement("img");
        careplanimage.src= "https://onemg.gumlet.io/v1613645053/marketing/phb2bz61etrdmuurfdoq.png"

        let careplanfirsttext= document.createElement("p");
        careplanfirsttext.textContent= "member price"

        careplantextdiv.append(price, careplanimage, careplanfirsttext);

        let careplansecondtext= document.createElement("p");
        careplansecondtext.textContent= "free shipping and 3% Extra NeuCoins"

        rightsidediv.append(careplantextdiv,careplansecondtext);

        careplanpricediv.append(circleiconcareplan,rightsidediv);
        document.getElementById("productpricediv").append(careplanpricediv);
    
        //the below fucntion changes the icon when clicking on it.

        circleiconcareplan.addEventListener("click", function() {
            // remove the old class and add the new one
            circleiconcareplan.classList.remove("fa-circle");
            circleiconcareplan.classList.add("fa-circle-dot");
            circleicon.classList.remove("fa-circle-dot");
            circleicon.classList.add("fa-circle");
        });

        circleicon.addEventListener("click", function() {
            // remove the old class and add the new one
            circleiconcareplan.classList.remove("fa-circle-dot");
            circleiconcareplan.classList.add("fa-circle");
            circleicon.classList.remove("fa-circle");
            circleicon.classList.add("fa-circle-dot");
        });


            // selection div alis 1 boottle of 60 capsules;

        let count= document.getElementById("count");
        count.textContent= elem.count;

        let type1 = document.getElementById("option1");
        type1.textContent = "1 " + elem.type;
        let type2 = document.getElementById("option2");
        type2.textContent = "2 " + elem.type;
        let type3 = document.getElementById("option3");
        type3.textContent = "3 " + elem.type;
        let type4 = document.getElementById("option4");
        type4.textContent = "4 " + elem.type;
        


        document.querySelector(".prodnameHere").textContent=elem.title;
        document.querySelector(".mk_bold").textContent=elem.title;
        document.getElementById("rating_here").textContent=elem.rate
        mainratingsdiv.addEventListener("click", function() {
            // Scroll down to the ratingsdiv element smoothly
            document.querySelector("#rating_div").scrollIntoView({ behavior: 'smooth' });
        });




        addtocartbtn.addEventListener("click", 
        function(){
            
            addtoCart(circleiconcareplan,elem);
        } );
    })
}



// when click on add to cart it send the id and quantity in local storage

let addtocartbtn = document.getElementById("addtocartbtn");



// function addtoCart(circleiconcareplan){

//     var quantitySelect = document.getElementById("quantity-select");
//     var quantity = quantitySelect.value;
//     localStorage.setItem("id", id);
//     localStorage.setItem("quantity", quantity);
//     if(circleiconcareplan.classList.contains("fa-circle-dot")){
//         localStorage.setItem("memberbershipplan", "care");
//     }
//     else{
//         localStorage.setItem("memberbershipplan", "normal");
//     }

   
//     var addtocartbtn = document.getElementById("addtocartbtn");
//     addtocartbtn.textContent = "ADDING...";
//     setTimeout(function() {
//         addtocartbtn.textContent = "ADDED ✔";
//             setTimeout(function() {
//                 addtocartbtn.textContent = "ADD TO CART";
//             }, 2000);
        
//     }, 2000);

// }
//clone code

let cartArr = JSON.parse(localStorage.getItem("toCart")) || [];

let checkCart = (data) => {
    let isExist = false
    cartArr.forEach(cIteams => {
        if(cIteams.id == data.id) {
            isExist = true
        }
        // console.log(cIteams.id,  data.id )
    })
    return isExist;
}

function addtoCart(circleiconcareplan,elem){
    var quantitySelect = document.getElementById("quantity-select");
    var quantity = quantitySelect.value;
    // localStorage.setItem("id", id);
    localStorage.setItem("quantity", quantity);

    if(checkCart(elem)) {
        //elem.quantity++;
        elem.quantity = parseInt(elem.quantity);
        elem.quantity += parseInt(document.getElementById("quantity-select").value);
        console.log(elem.quantity);
        localStorage.setItem("toCart", JSON.stringify(cartArr))
        alert("Increased Item Quantity")
    }
    else {

        elem.quantity= document.getElementById("quantity-select").value;
        
        
        
        cartArr.push(elem)
        localStorage.setItem("toCart", JSON.stringify(cartArr))
        //alert("Item Added Successfully")
    }

    var plan = ""; 

    if(circleiconcareplan.classList.contains("fa-circle-dot")){
        localStorage.setItem("memberbershipplan", "care");
        plan = "care"; 
    }
    else{
        localStorage.setItem("memberbershipplan", "normal");
        plan = "normal"; 
    }

    var addtocartbtn = document.getElementById("addtocartbtn");
    addtocartbtn.textContent = "ADDING...";
    setTimeout(function() {
        addtocartbtn.textContent = "ADDED ✔";

        var popup = document.getElementById("order-summary-popup");
        popup.querySelector(".product-name").textContent = elem.title;
        popup.querySelector(".care-plan-text").textContent = plan;
        popup.querySelector(".product-quantity").textContent=elem.quantity;

        // Show the popup
        popup.style.display = "flex";

        // Add an event listener to the "Proceed to Cart" button that will redirect to the cart page
        var proceedToCartBtn = document.getElementById("proceed-to-cart-btn");
        proceedToCartBtn.addEventListener("click", function() {
            window.location.href = "cart.html";
        });

        setTimeout(function() {
            addtocartbtn.textContent = "ADD TO CART";
            popup.style.display = "none";
        }, 3000);
    }, 2000);
}





// below is the code for scrolling back up to top of the page
let backToTopButton = document.createElement("button");
backToTopButton.setAttribute("class", "backToTopButton")
backToTopButton.innerHTML = '<i class="fa-solid fa-angle-up"></i>';


// Add the button to the page
document.body.appendChild(backToTopButton);

// Add a scroll event listener to the window
window.addEventListener("scroll", function() {
    // Check if the user has scrolled past 30% of the page
    if (window.scrollY > (document.body.clientHeight * 0.3)) {
        // Display the back to top button
        backToTopButton.style.display = "block";
    } else {
        // Hide the back to top button
        backToTopButton.style.display = "none";
    }
});

// Add a click event listener to the back to top button
backToTopButton.addEventListener("click", function() {
    // Scroll back to the top of the page smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
