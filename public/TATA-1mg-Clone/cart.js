


let locbox = document.getElementById("location") 
locbox.style.color = "#ff6f61"

function getLocationWeather() {
    navigator.geolocation.getCurrentPosition(success);
    function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        getCityName(latitude, longitude);
        console.log(latitude);
        console.log(longitude);
    }
}
getLocationWeather()

async function getCityName(lat, lon) {
    const apikey = "8811ba9db17ed04c19c500b61c2d03e0"
    console.log(lat);
    console.log(lon);

    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}`

    let res = await fetch(url)
    let data = await res.json(); 
    console.log(data.name)
    locbox.innerText  = data.name
}







let carePlan = JSON.parse(localStorage.getItem("carPlan"));
console.log(carePlan)
let carePlanValue = 0;
let carePlanDiv =  document.getElementById("carePlanHere");
if(carePlan == "true") {
    carePlanValue = 165;
    carePlanDiv.innerHTML = `
    <div id="carePlanDiv">
         <div>
         <h6><i class="fa-solid fa-circle-check"></i>Membership added to cart</h6>
         <p>Save an additional 7% on prescription medicine & earn 5% NeuCoins on other health products. Get same day, next day with Rapid and free standard delivery.</p>
         
         <div id="planDiv">
              <div>
                   <div id="redPlam">Care Plan</div>
                   <p>3 months membership</p>
                   <p>See all benefits <i class="fa-solid fa-circle-chevron-right"></i></p>
              </div>
              <div>
                   <p id="priceP"><span id="mrpLine">₹549</span> ₹165</p>
                   <p id="removePlan">REMOVE</p>
              </div>
         </div>
         </div>
    </div>
    
    `
    let cpDiv = document.getElementById("cPdiv")
    cpDiv.innerHTML = `
         <p>Care Plan</p>
         <p id="cpValue">₹0</p>
    `

    let removePlan = () => {
         localStorage.setItem("carPlan", JSON.stringify("false"))
         carePlanDiv.innerHTML = "";
    }
    document.getElementById("removePlan").addEventListener("click", removePlan)


}
else {
    carePlanDiv.innerHTML = "";
}





let data= JSON.parse(localStorage.getItem("toCart"))
console.log(data)
// blankcart function part

function blankcart(data){
   if(data == null || data.length==0 ){
      document.getElementById("blankcart").style.display="block"

      document.getElementById("bottom").style.display="none"
   }
   else{
      document.getElementById("bottom").style.display="flex"
      document.getElementById("blankcart").style.display="none"
   }
}
blankcart(data)


// slideshow append part


function getdata(el,cont){

    let div = document.createElement("div")
    div.setAttribute("id","append_div")    

    // let image = document.createElement("img")
    // image.src=el.image;

    let h3 = document.createElement("h3")
    h3.setAttribute("id","firsth3")
    h3.innerText=el.title;

    let p =document.createElement("p")
    p.setAttribute("id","firstpara")
    p.innerText=`${el.type} of  ${el.count}`

    let div2 = document.createElement("div")
    div2.setAttribute("id","seconddiv")
    

    let span1 = document.createElement("span")
    span1.setAttribute("id","firstspan")
    span1.innerHTML=`${el.rate}<i class="fa fa-star"></i>`

    let span2 = document.createElement("span")
    span2.setAttribute("id","secondspan")
    span2.innerText=el.total_ratings+ " ratings";

    div2.append(span1,span2)

    let div3 = document.createElement("div")
    div3.setAttribute("id","thirddiv")

    let p1 = document.createElement("P")
    p1.setAttribute("id","firstpara")
    p1.innerText=`₹${el.price}`;

    let p2 = document.createElement("P")
    p2.setAttribute("id","secondpara")
    p2.innerText=`${el.off}%off`

    div3.append(p1,p2)

    let div4 =document.createElement("div4")
    div4.setAttribute("id","fourthdiv")

    let p3 = document.createElement("P")
    p3.setAttribute("id","firstpara")

    p3.innerText= "₹"+Math.floor(el.price-((el.price*el.off)/100))
    console.log(el.price)
    let p4 = document.createElement("P")
    p4.setAttribute("id","secondpara")
    p4.innerText="Add"
    p4.addEventListener("click",()=>{
    clickme(el,p4)
    })
    div4.append(p3,p4)
    div.append(image,h3,p,div2,div3,div4)
    cont.append(div)
}


// for(let i=0;i<ORSL.length;i++){
//    if(i>=0 && i<=4){
//     cont= document.getElementById("slidedata1")
//     getdata(ORSL[i],cont)
//    }
//    else  if(i>=5 && i<=8){
//     cont= document.getElementById("slidedata2")
//     getdata(ORSL[i],cont)
//    }
// }

// for(let i=0;i<DOD.length;i++){
//    if(i>=0 && i<=4){
//     cont= document.getElementById("slidedata3")
//     getdata(DOD[i],cont)
//    }
//    else  if(i>=5 && i<=8){
//     cont= document.getElementById("slidedata4")
//     getdata(DOD[i],cont)
//    }
// }

// for(let i=0;i<spotlight.length;i++){
//    if(i>=0 && i<=4){
//     cont= document.getElementById("slidedata5")
//     getdata(spotlight[i],cont)
//    }
//    else  if(i>=5 && i<=8){
//     cont= document.getElementById("slidedata6")
//     getdata(spotlight[i],cont)
//    }
// }

// displayItems();


function displayItems() {
    //document.querySelector(".data").textContent = "";
    data.forEach(function (elm, idx) {
        var div1 = document.createElement("div");
        var div = document.createElement("div");

        var image = document.createElement("img");
        image.setAttribute("src",elm.image);

        var name = document.createElement("h5");
        name.textContent = elm.title;

        var price = document.createElement("p");
        price.textContent = "MRP ₹ - " + elm.price;

        div.append(image, name, price);

        var button = document.createElement("button");
        button.textContent = "Remove item";
        button.addEventListener("click", function () {
            deleteProduct(idx);
        });
        div1.append(div, button);
        document.querySelector("#secondleft").append(div1);
        
    });
  
}



// healthcheck thankyou div function part


let status=false;
document.getElementById("healthcheck").addEventListener("click",checkit)
function checkit(){
    if(status){
         status=false;
         document.getElementById("seccheck").style.display="block"
         document.getElementById("thankdiv").style.display="none"
    }
    else{
         status=true;
         document.getElementById("seccheck").style.display="none"
         document.getElementById("thankdiv").style.display="block"
    }

}


// increase, decrease, remove and cart product append part

append(data)

function append(data){
    document.getElementById("firstleft").innerHTML=null
    document.getElementById("totalspan").innerText=data.length
    data.forEach((el,index)=>{
         let div=document.createElement("div")
         div.setAttribute("id","firstdiv")
         let div2=document.createElement("div")
         div2.setAttribute("id","seconddiv")
         let h31= document.createElement("h2")
         h31.setAttribute("id","titleh3")
         h31.innerText=el.title;
         let h32 = document.createElement("h3")
         h32.setAttribute("id","titlepriceh3")
         let dis_price=Math.floor(el.price-((el.price*el.off)/100))
         h32.innerText= "₹"+ (dis_price*el.quantity)
         div2.append(h31,h32)
         let div3=document.createElement("div")
         div3.setAttribute("id","thirddiv")
         div3.innerHTML=`${el.type} of ${el.count}`
         let div4=document.createElement("div")
         div4.setAttribute("id","fourthdiv")
         div4.innerHTML=`<p id="pricepara"> MRP <span id="pricespan">₹${el.price*el.quantity}</span></p>`
         let div5=document.createElement("div")
         div5.setAttribute("id","fifthdiv")
         div5.append(div3,div4)



let image1=document.createElement("img")
image1.src="https://img.1mg.com/images/delete_icon.svg"
image1.addEventListener("click",()=>{
         removeme(el,index)
    })
    image1.style.cursor="pointer"


let p1=document.createElement("p")
p1.innerText="Remove";
p1.style.cursor="pointer"
p1.style.marginTop="14px"
p1.addEventListener("click",()=>{
         removeme(el,index)
    })
let div6 = document.createElement("div")
    div6.setAttribute("id","sixthdiv")
    div6.append(image1,p1)
    
    let div7 = document.createElement("div")
    div7.setAttribute("id","seventhdiv")
    let image2=document.createElement("img")
         
    image2.src="https://www.1mg.com/images/minus-cart.svg"
    image2.addEventListener("click",()=>{
              decrease(el,index)
         })
         image2.style.cursor="pointer"
    
    let image3=document.createElement("img")
    image3.src="https://www.1mg.com/images/plus-cart.svg"
    image3.addEventListener("click",()=>{
              increase(el,index)
         })
         image3.style.cursor="pointer"
    
    let p2=document.createElement("p")
    p2.innerText=el.quantity
    p2.style.marginTop="14px"
    console.log(el.quantity)
         div7.append(image2,p2,image3)
         let div8=document.createElement("div");
         div8.setAttribute("id","eighthdiv")
         div8.append(div6,div7)

         div.append(div2,div5,div8)
         document.getElementById("firstleft").append(div);
    })
    }

function increase(el,index){
    console.log(data[index])
    data[index].quantity++;
    append(data)
    localStorage.setItem("toCart", JSON.stringify(data))
    totalamount(data)
}

function decrease(el,index){
    if(el.quantity==1){
         removeme(el,index)
    }
    else{ 
         data[index].quantity--;
         totalamount(data)
         localStorage.setItem("toCart", JSON.stringify(data))
         append(data)
    }
}


function removeme(el,index){
    data.splice(index,1)
    localStorage.setItem("toCart", JSON.stringify(data))
    append(data)
    totalamount(data)
    blankcart(data)
}



// total amount, discount function part

function totalamount(data){
    let sum = data.reduce((accumulator, el) => {
         return accumulator + el.price*el.quantity},0)
    document.getElementById("totalp").innerHTML=`₹${sum}`
    
    let sum2 = data.reduce((accumulator, el) => {
         return accumulator + (Math.ceil((el.price*el.off)/100)*el.quantity)
    },0)
    
    document.getElementById("discp").innerHTML=`-₹${sum2}`
    
    let sum3=0;
    let packagecharge=0;
    if(sum<500){
         document.getElementById("packagingp").innerText=`₹29`
         sum3=sum-sum2+29
         packagecharge=29
    // console.log(sum3)
    }
    else if(sum>500 && sum<1000){
         document.getElementById("packagingp").innerText=`₹19`
         sum3=sum-sum2+19
         packagecharge=19
    
    }
    else{
         document.getElementById("packagingp").innerText=`₹5`
         sum3=sum-sum2+5
         packagecharge=5
    
    }
    
    
    function amount(sum3,sum2,packagecharge){
         this.total_price=sum3;
         this.discount=sum2;
         this.packaging_charge=packagecharge
    }
    
    
    let details=new amount(sum3,sum2,packagecharge)
    localStorage.setItem("payment_details",JSON.stringify(details))
    
    
    if(carePlan == "true") {

         document.getElementById("cpValue").innerText=`₹${165}`
         document.getElementById("tobepaidp").innerText=`₹${sum3 + 165}`
    }
    else {
         document.getElementById("tobepaidp").innerText=`₹${sum3}`
    } 


    document.getElementById("totalsavp").innerText=`₹${sum2}`
    document.getElementById("totalsavp").style.color="#1aab2a"
    document.getElementById("totalsavp").style.fontSize="16px"
}
totalamount(data)