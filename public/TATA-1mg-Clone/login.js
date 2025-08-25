var slideIndex = 1;

var myTimer;

var user_details = {};

window.addEventListener("load", function () {
  showSlides(slideIndex);
  myTimer = setInterval(function () {
    plusSlides(1);
  }, 3000);
});

function plusSlides(n) {
  clearInterval(myTimer);
  if (n < 0) {
    showSlides((slideIndex -= 1));
  } else {
    showSlides((slideIndex += 1));
  }

  if (n === -1) {
    myTimer = setInterval(function () {
      plusSlides(n + 2);
    }, 3000);
  } else {
    myTimer = setInterval(function () {
      plusSlides(n + 1);
    }, 3000);
  }
}

function currentSlide(n) {
  clearInterval(myTimer);
  myTimer = setInterval(function () {
    plusSlides(n + 1);
  }, 3000);
  showSlides((slideIndex = n));
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}

pause = () => {
  clearInterval(myTimer);
};

resume = () => {
  clearInterval(myTimer);
  myTimer = setInterval(function () {
    plusSlides(slideIndex);
  }, 3000);
};

var otp = 1234;
document.getElementById("login_span").addEventListener("click", function () {
  let a = document.getElementById("account_1");
  let b = document.getElementById("account_2");
  let c = document.getElementById("verify_otp");
  let d = document.getElementById("email_id_new");
  a.style.display = "none";
  c.style.display = "none";
  d.style.display = "none";
  b.style.display = "block";
});

document.getElementById("signup_span").addEventListener("click", function () {
  let a = document.getElementById("account_2");
  let b = document.getElementById("account_1");
  let c = document.getElementById("verify_otp");
  let d = document.getElementById("email_id_new");
  a.style.display = "none";
  c.style.display = "none";
  d.style.display = "none";
  b.style.display = "block";
});

document.getElementById("edit_button").addEventListener("click", function () {
  let a = document.getElementById("account_2");
  let b = document.getElementById("account_1");
  let c = document.getElementById("verify_otp");
  let d = document.getElementById("email_id_new");
  a.style.display = "none";
  b.style.display = "block";
  d.style.display = "none";
  c.style.display = "none";
});

document
  .getElementById("account_continue")
  .addEventListener("click", function () {
    let number = document.getElementById("mobile_number").value;
    let string = number.toString();

    if (string.length != 10) {
      document.getElementById("account_invalid_num").style.display = "block";
      document.getElementById("account_continue").style.marginTop = "20px";
    } else {
      user_details.number = number;
      localStorage.setItem("loggeduser", JSON.stringify(user_details));
      document.getElementById("user_mobile").textContent = number;
      let a = document.getElementById("account_2");
      let b = document.getElementById("account_1");
      let c = document.getElementById("verify_otp");
      let d = document.getElementById("email_id_new");
      a.style.display = "none";
      b.style.display = "none";
      c.style.display = "block";
      d.style.display = "none";
      document.getElementById("account_invalid_num").style.display = "none";
      document.getElementById("account_continue").style.marginTop = "70px";
    }
  });

document
  .getElementById("login_button-1")
  .addEventListener("click", function () {
    let number = document.getElementById("login_mobile_number").value;
    let string = number.toString();

    // console.log(string.length);
    if (string.length != 10) {
      document.getElementById("login_invalid_num").style.display = "block";
      document.getElementById("login_button-1").style.marginTop = "20px";
    } else {
      user_details.number = number;
      localStorage.setItem("loggeduser", JSON.stringify(user_details));
      //   localStorage.setItem("mobile_number", JSON.stringify(number));
      document.getElementById("user_mobile").textContent = number;
      let a = document.getElementById("account_2");
      let b = document.getElementById("account_1");
      let c = document.getElementById("verify_otp");
      let d = document.getElementById("email_id_new");
      a.style.display = "none";
      b.style.display = "none";
      c.style.display = "block";
      d.style.display = "none";
      document.getElementById("login_invalid_num").style.display = "none";
      document.getElementById("login_button-1").style.marginTop = "70px";

      //   console.log("Snackbar code")

      //snackbar code
      const otp_snack = document.getElementById("snackbar_otp");
      otp_snack.textContent = "Your OTP:" + otp;
      //   console.log(otp_snack);
      otp_snack.className = "show";
      setTimeout(function () {
        otp_snack.className = otp_snack.className.replace("show", "");
      }, 3000);
    }
  });

document.getElementById("done").addEventListener("click", function () {
  //otp verification
  let user_otp = document.getElementById("one_time_p").value;
  if (user_otp != otp) {
    document.getElementById("wrong_otp").style.display = "block";
    const otp_snack = document.getElementById("snackbar_otp");
    otp_snack.textContent = "Your OTP:" + otp;
    //   console.log(otp_snack);
    otp_snack.className = "show";
    setTimeout(function () {
      otp_snack.className = otp_snack.className.replace("show", "");
    }, 5000);
  } else {
    user_details.otp = user_otp;
    localStorage.setItem("loggeduser", JSON.stringify(user_details));
    let a = document.getElementById("account_2");
    let b = document.getElementById("account_1");
    let c = document.getElementById("verify_otp");
    let d = document.getElementById("email_id_new");
    a.style.display = "none";
    b.style.display = "none";
    c.style.display = "none";
    d.style.display = "block";
    document.getElementById("wrong_otp").style.display = "none";
  }
});

document
  .getElementById("email_continue")
  .addEventListener("click", function () {
    if (document.getElementById("email_new").value.length == 0) {
      document.getElementById("invalid_email").style.display = "block";
      document.getElementById("email_continue").style.marginTop = "20px";
    } else {
      let user_email = document.getElementById("email_new").value;
      user_details.email = user_email;
      localStorage.setItem("loggeduser", JSON.stringify(user_details));
      //   save in local storage
      window.location.href = "index.html";
      document.getElementById("invalid_email").style.display = "none";
      document.getElementById("email_continue").style.marginTop = "125px";
    }
  });

document.getElementById("otp_sms").addEventListener("click", function () {
  document.getElementById("error").innerHTML =
    "You will soon receive an SMS with the OTP";
  document.getElementById("error").style.color = "green";
});
document.getElementById("otp_call").addEventListener("click", function () {
  document.getElementById("error").innerHTML =
    "You will soon receive an call with the OTP";
  document.getElementById("error").style.color = "green";
});

// let go_to_home = document.getElementById("close_btn");

// go_to_home.addEventListener("click",function(){
//     console.log("close clicked");
//     window.location.href="index.html";
// });