// import topNavbar from '../components/navbar.js';
// import footerFun  from "../components/footer.js"
import {navbar} from './navbar.js';
document.getElementById("navimport").innerHTML = navbar();
// let nav = document.getElementById("prodnavbar")
// nav.innerHTML = topNavbar()

// let footer = document.getElementById("tata1mgFooter")
// footer.innerHTML = footerFun()

let cityBox =  document.getElementById("location");

// function getLocationWeather() {
//     navigator.geolocation.getCurrentPosition(success);
//     function success(position) {
//         const latitude = position.coords.latitude;
//         const longitude = position.coords.longitude;
//         getCityName(latitude, longitude);
//         console.log(latitude);
//         console.log(longitude);
//     }
// }
// getLocationWeather()

// async function getCityName(lat, lon) {
//     const apikey = "8811ba9db17ed04c19c500b61c2d03e0"
//     console.log(lat);
//     console.log(lon);

//     let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}`

//     let res = await fetch(url)
//     let data = await res.json(); 
//     console.log(data.name)
//     cityBox.value = data.name
//     localStorage.setItem("userlocation", JSON.stringify(data.name));
// }

// getCityName()


//for bharat
// localStorage.setItem("query", "protein")
let query = localStorage.getItem("query");
// localStorage.getItem("query");

// let query= "protein";





//


async function getData() {
    let url = "https://json-server-1017.onrender.com/products/"
    //let url ="https://ballalamit.github.io/tata1mgjsonserver/db.json"
        let res = await fetch(url);
        let data = await res.json();
        return data;
}

let productData = await getData();

let originaldata = productData

let cartArr = JSON.parse(localStorage.getItem("toCart")) || [];

let append = (data) => {
    let container = document.getElementById("productShow");
    container.innerHTML = "";
    data.forEach(ele => {
        // console.log(ele);
        let image = ele.image;
        let title = ele.title;
        let rate  = ele.rate;
        let price = ele.price;
        let count = ele.count;
        let type  = ele.type;
        let off = ele.off
        //console.log(ele.id + "amit")
        // let discount_price = price - Math.floor(price*(off/100));;
        let actualprice = Math.floor(price/(1-off/100));
        // console.log(actualprice);
        let randomNum = Math.floor(Math.random() * 500)

        let img = document.createElement("img");
        img.src = `${image}`;
    
        let addBtn = document.createElement("p");
        addBtn.innerText = "ADD"

        let box  = document.createElement("div");
        box.setAttribute("class", "inDiv");
        

        box.innerHTML  = `
        
        <div class="imgDiv">
            
        </div> 
        <div class="bottomSec">
            <div>
                <h6>${title}</h6>
                <p><span>${type}</span> of <span>${count}</span></p>
            </div>
            <div class="rateDiv">
                <span id="rating">${rate} <i class="fa-solid fa-star"></i></span> <span>${randomNum} ratings</span>
            </div>
            <div class="priceDiv">
                <div>
                    MRP <span class= "mk_linethro">₹${actualprice}</span> <span class="mk_green">${off}% OFF</span> 
                    <p>₹${price}</p> 
                </div>
                <div class="addtoCartBtn">
                    
                </div>
            </div>
        </div>
        
        `
        container.append(box)


        let imgDiv = document.querySelectorAll(".imgDiv").forEach(iteam => {
            iteam.append(img)
        })
        img.addEventListener("click" , () => {
            nextPage(ele.id)
        })

        let addDiv = document.querySelectorAll(".addtoCartBtn").forEach(iteam => {
            iteam.append(addBtn)
        })
        addBtn.addEventListener("click" , () => {
            addToCartFunc(ele)
        })
        localStorage.removeItem('query');
    })
     
}

append(productData)


async function getDataquery() {
    let url = `https://json-server-1017.onrender.com/products/?q=${query}`
        let res = await fetch(url);
        let data = await res.json();
        append(data);
        
}
if (query){
    getDataquery();
}



let nextPage = (ele) => {
    console.log(ele + "kumar")
    
    localStorage.setItem("productid", ele)
    window.location.href = "../productdetail.html"
}


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

let addToCartFunc = (ele) => {
    console.log(checkCart(ele))
    // checkCart(ele)
    if(checkCart(ele)) {
        ele.quantity++;
        localStorage.setItem("toCart", JSON.stringify(cartArr))
        alert("Increased Item Quantity")
    }
    else {
        cartArr.push(ele)
        localStorage.setItem("toCart", JSON.stringify(cartArr))
        alert("Item Added Successfully")
    }
}


document.getElementById(
    "sort_prod").onchange = function() {
        handleSort()
};

function handleSort() {
    let selected = document.getElementById("sort_prod").value;
    console.log(selected)
    if(selected == "HTL") {
        productData.sort(function(a, b){
            return b.price - a.price;
        });
        append(productData);
        document.getElementById("prod_type").innerText = `High to Low Poducts`
    }
    if (selected == "LTH") {
        productData.sort(function(a, b){
            return a.price - b.price;
        });
        append(productData);
        document.getElementById("prod_type").innerText = `Low to High Poducts`
    }
    if (selected == "DISCOUNT") {
        productData.sort(function(a, b){
            return b.off - a.off;
        });
        append(productData);
        document.getElementById("prod_type").innerText = `Great Deals`
    }
    if (selected == "higherRate") {
        productData.sort(function(a, b){
            return b.rate - a.rate;
        });
        append(productData);
        document.getElementById("prod_type").innerText = `Great Rating Products`
    }
    if (selected == "all") {
        productData.sort(function(a, b){
            return a.id - b.id;
        });
        append(productData);
        document.getElementById("prod_type").innerText = `All Products`
    
    }
}


//  Discount filter section 

function discountFilterFunction() {
    let disSelected = this.id
    let discountFilter_Prod = [];
    if (disSelected ==  "bten") {
        productData.forEach(ele => {
            if(ele.off < 10) {
                discountFilter_Prod.push(ele)
            }
        })
        document.getElementById("prod_type").innerText = `Discount Less than 10%`
        window.location.href = "#prod_type"
    }
    if (disSelected ==  "aten") {
        productData.forEach(ele => {
            if(ele.off >= 10 && ele.off < 20) {
                discountFilter_Prod.push(ele)
            }
        })
        document.getElementById("prod_type").innerText = `Discount 10% and above`
        window.location.href = "#prod_type"
    }
    if (disSelected ==  "atwen") {
        productData.forEach(ele => {
            if(ele.off >= 20 && ele.off < 30) {
                discountFilter_Prod.push(ele)
            }
        })
        document.getElementById("prod_type").innerText = `Discount 20% and above`
        window.location.href = "#prod_type"
    }
    if (disSelected ==  "athy") {
        productData.forEach(ele => {
            if(ele.off >= 30) {
                discountFilter_Prod.push(ele)
            }
        })
        document.getElementById("prod_type").innerText = `Discount 30% and above`
        window.location.href = "#prod_type"
    }
    append(discountFilter_Prod );
    console.log(disSelected);
}



let discountFilter = document.getElementById("discount_div").children

for(let el of discountFilter) {
    el.addEventListener("click", discountFilterFunction)
    el.style.cursor = "pointer"
}



// category filter;


function cateFilterFunction() {
    let selectedCate = (this.id).toLowerCase()
    let cateFilterArr = [];
    console.log(selectedCate);
    if (selectedCate ==  "covid") {
        productData.forEach(ele => {
            if((ele.category).toLowerCase() == selectedCate) {
                cateFilterArr.push(ele)
            }
        })
        document.getElementById("prod_type").innerText = `Covid Essentials`
        window.location.href = "#prod_type"
    }

    if (selectedCate ==  "supplement") {
        productData.forEach(ele => {
            if((ele.category).toLowerCase() == selectedCate) {
                cateFilterArr.push(ele)
            }
        })
        document.getElementById("prod_type").innerText = `Vitamins & Nutrition`
        window.location.href = "#prod_type"
        
    }

    if (selectedCate ==  "diabetes") {
        productData.forEach(ele => {
            if((ele.category).toLowerCase() == selectedCate) {
                cateFilterArr.push(ele)
            }
        })
        document.getElementById("prod_type").innerText = `Diabetes`
        window.location.href = "#prod_type"
    }

    if (selectedCate ==  "devices") {
        productData.forEach(ele => {
            if((ele.category).toLowerCase() == selectedCate) {
                cateFilterArr.push(ele)
            }
        })
        document.getElementById("prod_type").innerText = `Healthcare Devices`
        window.location.href = "#prod_type"
    }
    append(cateFilterArr);
}




let cateFilter = document.getElementById("categoriesDiv").children

for(let el of cateFilter) {
    el.addEventListener("click", cateFilterFunction)
    el.style.cursor = "pointer"
}


// barnd filter 


function brandFilterFunction() {
    let selectedBrand = this.id
    let brandArr = [];

    if (selectedBrand ==  "tata") {
        productData.forEach(ele => {
            if((ele.subTitle).toLowerCase().includes("tata")) {
                brandArr.push(ele)
            }
        })
        document.getElementById("prod_type").innerText = `Tata 1mg Healthcare Solutions Private Limited`
        window.location.href = "#prod_type"
    }
    if (selectedBrand ==  "dabur") {
        productData.forEach(ele => {
            if((ele.subTitle).toLowerCase().includes("dabur")) {
                brandArr.push(ele)
            }
        })
        document.getElementById("prod_type").innerText = `Dabur India Ltd`
        window.location.href = "#prod_type"
    }
    if (selectedBrand ==  "goqii") {
        productData.forEach(ele => {
            if((ele.subTitle).toLowerCase().includes("goqii")) {
                brandArr.push(ele)
            }
        })
        document.getElementById("prod_type").innerText = `GOQii Technologies Pvt Ltd`
        window.location.href = "#prod_type"
    }
    if (selectedBrand ==  "accu") {
        productData.forEach(ele => {
            if((ele.subTitle).toLowerCase().includes("roche")) {
                brandArr.push(ele)
            }
        })
        document.getElementById("prod_type").innerText = `Roche Diabetes Care India Pvt Ltd`
        window.location.href = "#prod_type"
    }
    if (selectedBrand ==  "hindustan") {
        productData.forEach(ele => {
            if((ele.subTitle).toLowerCase().includes("hindustan")) {
                brandArr.push(ele)
            }
        })
        document.getElementById("prod_type").innerText = `Hindustan Unilever`
        window.location.href = "#prod_type"
    }
    append(brandArr);
}


let brandFilter = document.getElementById("brand_div").children

for(let el of brandFilter) {
    el.addEventListener("click", brandFilterFunction)
    el.style.cursor = "pointer"
}


// type filter

function typeFilterFunction() {
    let selectedType = this.id;
    let typeArr = [];

    if (selectedType ==  "box") {
        productData.forEach(ele => {
            if((ele.type).toLowerCase() == selectedType) {
                typeArr.push(ele)
            }
        })
    }
    if (selectedType ==  "jar") {
        productData.forEach(ele => {
            if((ele.type).toLowerCase() == selectedType) {
                typeArr.push(ele)
            }
        })
    }
    if (selectedType ==  "tablet") {
        productData.forEach(ele => {
            if((ele.count).toLowerCase().includes("tablet")) {
                typeArr.push(ele)
            }
        })
    }
    if (selectedType ==  "kit") {
        productData.forEach(ele => {
            if((ele.count).toLowerCase().includes("kit")) {
                typeArr.push(ele)
            }
        })
    }
    if (selectedType ==  "bottle") {
        productData.forEach(ele => {
            if((ele.type).toLowerCase().includes("bottle")) {
                typeArr.push(ele)
            }
        })
    }
    if (selectedType ==  "unit") {
        productData.forEach(ele => {
            if((ele.count).toLowerCase().includes("unit")) {
                typeArr.push(ele)
            }
        })
    }
    append(typeArr);
}


let typeFilter = document.getElementById("type_div").children

for(let el of typeFilter) {
    el.addEventListener("click", typeFilterFunction)
    el.style.cursor = "pointer"
}
