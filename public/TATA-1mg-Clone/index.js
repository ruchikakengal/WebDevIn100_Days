import {navbar} from './navbar.js';
const healthlist=document.getElementById("healthlist");
const brandlist=document.getElementById("brandlist");
const checkuplist=document.getElementById("checkuplist");
const testlist=document.getElementById("testlist");
const popularlist=document.getElementById("popularlist");

document.getElementById("navimport").innerHTML = navbar();
let checkuplistarr = [
  {
    "id": 1,
    "name": "Comprehensive Gold...",
    "test": "Includes 78 tests",
    "image": "https://onemg.gumlet.io/diagnostics/b1f8f81e-5677-11ec-9fd9-0a65f29f7340.png?format=auto",
    "rating": "4.9 ⭐",
    "price": "₹ 2099",
    "dis": "₹ 4198",
    "off": "50% Off"
  },
  {
      "id": 2,
      "name": "Good Health Smart...",
    "test": "Includes 78 tests",
    "image": "https://onemg.gumlet.io/diagnostics/b1f8f81e-5677-11ec-9fd9-0a65f29f7340.png?format=auto",
    "rating": "4.9 ⭐",
    "price": "₹ 2099",
    "dis": "₹ 4198",
    "off": "50% Off"
  },
  {
    "id": 3,
    "name": "Good Health Smart...",
    "test": "Includes 78 tests",
    "image": "https://onemg.gumlet.io/diagnostics/b1f8f81e-5677-11ec-9fd9-0a65f29f7340.png?format=auto",
    "rating": "4.9 ⭐",
    "price": "₹ 2099",
    "dis": "₹ 4198",
    "off": "50% Off"
  },
  {
      "id": 4,
      "name": "Good Health Smart...",
    "test": "Includes 78 tests",
    "image": "https://onemg.gumlet.io/diagnostics/b1f8f81e-5677-11ec-9fd9-0a65f29f7340.png?format=auto",
    "rating": "4.9 ⭐",
    "price": "₹ 2099",
    "dis": "₹ 4198",
    "off": "50% Off"
  },
  {
    "id": 5,
    "name": "Good Health Smart...",
    "test": "Includes 78 tests",
    "image": "https://onemg.gumlet.io/diagnostics/b1f8f81e-5677-11ec-9fd9-0a65f29f7340.png?format=auto",
    "rating": "4.9 ⭐",
    "price": "₹ 2099",
    "dis": "₹ 4198",
    "off": "50% Off"
  },
  {
    "id": 6,
    "name": "Good Health Smart...",
    "test": "Includes 78 tests",
    "image": "https://onemg.gumlet.io/diagnostics/b1f8f81e-5677-11ec-9fd9-0a65f29f7340.png?format=auto",
    "rating": "4.9 ⭐",
    "price": "₹ 2099",
    "dis": "₹ 4198",
    "off": "50% Off"
  },
  // {
  //     "id": 7,
  //     "name": "Good Health Smart...",
  //   "test": "Includes 78 tests",
  //   "image": "https://onemg.gumlet.io/diagnostics/b1f8f81e-5677-11ec-9fd9-0a65f29f7340.png?format=auto",
  //   "rating": "4.9 ⭐",
  //   "price": "₹ 2099",
  //   "dis": "₹ 4198",
  //   "off": "50% Off"
  //   },
  //   {
  //     "id": 8,
  //     "name": "Good Health Smart...",
  //   "test": "Includes 78 tests",
  //   "image": "https://onemg.gumlet.io/diagnostics/b1f8f81e-5677-11ec-9fd9-0a65f29f7340.png?format=auto",
  //   "rating": "4.9 ⭐",
  //   "price": "₹ 2099",
  //   "dis": "₹ 4198",
  //   "off": "50% Off"
  //   },
  //   {
  //     "id": 9,
  //     "name": "Good Health Smart...",
  //   "test": "Includes 78 tests",
  //   "image": "https://onemg.gumlet.io/diagnostics/b1f8f81e-5677-11ec-9fd9-0a65f29f7340.png?format=auto",
  //   "rating": "4.9 ⭐",
  //   "price": "₹ 2099",
  //   "dis": "₹ 4198",
  //   "off": "50% Off"
  //   },
]

let popularlistarr = [
  {
    "id": 1,
    "name": "Top Deals",
    "image": "https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/a234333b-665f-4baf-be30-f32800ce7046.png",
    
  },
  {
      "id": 2,
      "name": "Vitamins & Supplements",
      "image": "https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/a7a50447-24ae-4154-9fc1-e661d663be92.png",
  },
  {
    "id": 3,
    "name": "Nutritional Drinks",
    "image": "https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/42f036d9-971b-4539-9716-10b82179693d.png"
  },
  {
      "id": 4,
      "name": "Personal Care",
      "image": "https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/1dd3a697-8cbc-4f68-956f-74f1b8d890e6.png"
  },
  {
    "id": 5,
    "name": "Skin Care",
    "image": "https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/fddbc927-feb1-4813-9f8b-9ce864284ea7.png"
  },
  {
    "id": 6,
    "name": "Pain Relief",
    "image": "https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/6a7dc1cb-4c12-41e3-a9bb-c9e0fa72edea.png"
  },

  {
    "id": 7,
    "name": "Ayurveda",
    "image": "https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/11ebce0e-fbc8-4f59-a9ab-79ad7d623ce0.png"
},
]

let brandlistarr = [
  {
    "id": 1,
    "name": "Zandu",
    "image": "https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/2236c9a9-37c5-4132-aa2c-c616c7b62980.png",
    
  },
  {
      "id": 2,
      "name": "Dr. Morepen",
      "image": "https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/d0a7a1ef-7196-42e1-80a8-1c027f6d5224.png",
  },
  {
    "id": 3,
    "name": "Optimum Nutrition",
    "image": "https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/63b908c2-f1f1-44ef-ba81-4ee665ec46ba.png"
  },
  {
      "id": 4,
      "name": "Mamaearth",
      "image": "https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/3489fa92-fdd4-4601-98e0-326d3391c1f3.png"
  },
  {
    "id": 5,
    "name": "Baidyanath",
    "image": "https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/e39ed719-0567-4ef7-8679-7396aca9ab04.png"
  },
  {
    "id": 6,
    "name": "Himalaya",
    "image": "https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/a7b20440-e9d7-444f-a7af-9fd1306ddcb2.png"
  },

  {
    "id": 7,
    "name": "Dr Willmar Schwabe",
    "image": "https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/3acf77f5-ca61-48ac-87b8-00d163d37e31.png"
},
// {
//   "id": 8,
//   "name": "Tejasya Ayurveda",
//   "image": "https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/8b77c71c-4e7b-48c5-94d6-811748118d10.png"
// },
// {
//   "id": 9,
//   "name": "TATA 1mg Health Products",
//   "image": "https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/a307b427-631d-436b-bdfc-4a221836588d.png"
// },
]

let healthlistarr = [
    {
      "id": 1,
      "name": "Diabetes Care",
      "image": "https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/c2a0598f-483c-48ff-9783-71e402aa28d3.png",
      
    },
    {
        "id": 2,
        "name": "Cardiac Care",
        "image": "https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/ab1da5f4-c074-47d2-b278-a5fbd2c93f1f.png",
    },
    {
      "id": 3,
      "name": "Stomach Care",
      "image": "https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/702457a8-ff7d-43a6-bd1d-6bcb278ce686.png"
    },
    {
        "id": 4,
        "name": "Liver Care",
        "image": "https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/995e64ba-5bd9-42bc-8db6-5dc0b821c89d.png"
    },
    {
      "id": 5,
      "name": "Joint & Muscle Care",
      "image": "https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/ba975795-98dc-4cd8-8b55-3c20230d70e3.png"
    },
    {
      "id": 6,
      "name": "Kidney care",
      "image": "https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/e77d5099-d905-4462-ab9d-b51802e3739b.png"
    },
    // {
    //     "id": 7,
    //     "name": "Derma care",
    //     "image": "https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/6f9a726a-4a98-42e6-a834-67381be5e330.png"
    // },
    // {
    //   "id": 8,
    //   "name": "Respiratory care",
    //   "image": "https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/4a788b46-97f3-460e-afb6-428368f779ee.png"
    // },
    // {
    //   "id": 9,
    //   "name": "Eye care",
    //   "image": "https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/631e3dca-3d5b-49f8-832b-8341ec4784e7.png"
    // },
]

displayData(healthlistarr);


function displayData(data){
    data.map(function(elem){
        const link=document.createElement("a");
        link.href="productlist.html";
        link.style.textDecoration = "none";

        const card=document.createElement("div");
        
        const img=document.createElement("img");
        img.src=elem.image;

        const span=document.createElement("span");
        span.textContent=elem.name;

        card.append(img, span);
        link.append(card);
        healthlist.append(link);

    })
}

displayData1(checkuplistarr);
function displayData1(data){

  data.forEach(function(elem){
      const link = document.createElement("a");
      link.href = "productlist.html";
      link.style.textDecoration = "none";

      const card = document.createElement("div");

      const h4 = document.createElement("h6");
      h4.textContent = elem.name;

      const test = document.createElement("span");
      test.textContent = elem.test;

      const img = document.createElement("img");
      img.src = "https://onemg.gumlet.io/diagnostics/b1f8f81e-5677-11ec-9fd9-0a65f29f7340.png?format=auto";

      const rating = document.createElement("span");
      rating.textContent = elem.rating;

      const br = document.createElement("br");

      const price = document.createElement("span");
      price.textContent = elem.price;

      const br1 = document.createElement("br");

      const dis = document.createElement("span");
      dis.textContent = elem.dis;

      const off = document.createElement("span");
      off.textContent = "50% Off";

      card.append(h4, test, br1, img, rating, br, price, );
      link.append(card);
      checkuplist.append(link);

  })
}


displayData12(brandlistarr);


function displayData12(data){
    data.map(function(elem){
        const link=document.createElement("a");
        link.href="productlist.html";
        link.style.textDecoration = "none";

        const card=document.createElement("div");
        
        const img=document.createElement("img");
        img.src=elem.image;

        const span=document.createElement("span");
        span.textContent=elem.name;

        card.append(img, span);
        link.append(card);
        testlist.append(link);

    })
}
// function displayData(data){
//   const carouselContainer = document.querySelector('.carousel');
//   let carouselWidth = 0;

//   data.forEach(function(elem){
//       const link = document.createElement("a");
//       link.href = "https://www.1mg.com/";
//       link.style.textDecoration = "none";

//       const card = document.createElement("div");

//       const img = document.createElement("img");
//       img.src = elem.image;

//       const span = document.createElement("span");
//       span.textContent = elem.name;

//       card.append(img, span);
//       link.append(card);
//       carouselContainer.append(link);

//       // Get the width of each link and add it to carouselWidth
//       carouselWidth += link.offsetWidth;
//   })

//   // Set the width of the carousel container to the total width of the links
//   carouselContainer.style.width = carouselWidth + 'px';
// }

//   // Set the width of the carousel container to the total width of the links
//   checkuplist.style.width = checkuplistWidth + 'px';
// }


// // Get the carousel container and its width
// const carouselContainer = document.querySelector('.carousel');
// const carouselWidth = carouselContainer.offsetWidth;

// // Initialize the current position of the carousel
// let currentPosition = 0;

// // Add event listeners for the next and previous buttons
// document.querySelector('.next-button').addEventListener('click', function(){
//     if (currentPosition > -(carouselWidth - window.innerWidth)) {
//         currentPosition -= 250;
//         carouselContainer.style.transform = `translateX(${currentPosition}px)`;
//     }
// });

// document.querySelector('.prev-button').addEventListener('click', function(){
//     if (currentPosition < 0) {
//         currentPosition += 250;
//         carouselContainer.style.transform = `translateX(${currentPosition}px)`;
//     }
// });

displayData24(popularlistarr);


function displayData24(data){
    data.map(function(elem){
        const link=document.createElement("a");
        link.href="productlist.html";
        link.style.textDecoration = "none";

        const card=document.createElement("div");
        
        const img=document.createElement("img");
        img.src=elem.image;

        const span=document.createElement("span");
        span.textContent=elem.name;

        card.append(img, span);
        link.append(card);
        popularlist.append(link);

    })
}




const search=document.getElementById("searchnav")
 search.addEventListener("input", func)
 search.addEventListener("keypress", func1)
 function func(e){
    const value= e.target.value;
    console.log(value);
    localStorage.setItem("query", value);
    let url=`https://json-server-1017.onrender.com/products/?q=${value}`
    debounce(url);

    
 }

 let timeout;
    function debounce(url) {
        if(timeout){
            clearTimeout(timeout);
        }
        timeout = setTimeout(getdatasug, 2000, url);

    }


 function func1(e){
  if (e.key === "Enter"){
    location.href="productlist.html";
  }
}

async function getdatasug(url){
  try {
      let res=await fetch(url);
      let data=await res.json();
       console.log(data);
       displaydatasug(data);
  } catch (error) {
      console.log(error);
  }
}

function displaydatasug(data){
  document.getElementById("suggestion1").innerHTML="";

  data.forEach(function(elem,i){

  let divcard=document.createElement("div");
  divcard.style.padding = "5px";

  let div=document.createElement("a");
  div.href="productlist.html";
  

  let br=document.createElement("br");
  // let br1=document.createElement("br");

  let title=document.createElement("span");
  title.textContent=elem.title;
  
  div.append(title);
  divcard.append(div);
  document.getElementById("suggestion1").append(divcard);

  })
}

// localStorage.setItem("loggeduser", "7");
loggedfunction();

function loggedfunction(){
  if(localStorage.getItem("loggeduser")){
    document.getElementById("userlog").style.display = "none";
    document.getElementById("userimg").style.display = "inline-block";
  }
}