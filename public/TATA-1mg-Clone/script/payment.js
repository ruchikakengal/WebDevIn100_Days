var prod =JSON.parse( localStorage.getItem("payment_details"));
 console.log(prod.total_price);

document.querySelector("#to_be_paid" ).innerHTML= prod.total_price  + 40 + 50;
document.querySelector("#total_mrp_item" ).innerHTML= prod.total_price;


document.getElementById("main_card_payment_btn").addEventListener("click", getdata);

function getdata(){
    var card_num=document.getElementById("card_num").value;
    var  exp_date=document.getElementById("exp_date").value;
    var cvv=document.getElementById("cvv").value;
    var card_name=document.getElementById("card_name").value;
    // var check=0;
    if(card_num == "" || exp_date=="" || cvv=="" || card_name==""){
      alert
        ("Please Fill all details properly");
        return;
      
    }

    // document.querySelector("#pay").addEventListener("click", hello);
      // function hello(){
        window.location.href = "otp.html";
      // }
        
    }