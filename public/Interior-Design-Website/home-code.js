function clk1(){
  document.getElementById('img-bk').style['width'] = "65px";
  document.getElementById('cls-f').style['margin-left'] = "0px";
  document.getElementById('d6-2-h1').textContent = "Meet designer";
  document.getElementById('d6-2-p').textContent = "Let's get to know you better and we'll share design concepts and a quote";
}
function clk2(){
  document.getElementById('img-bk').style['width'] = "174px";
  document.getElementById('cls-f').style['margin-left'] = "-800px";
  document.getElementById('d6-2-h1').textContent = "Seal the deal";
  document.getElementById('d6-2-p').textContent = "Book Livspace by paying 5% of the final quote or Rs.25000 (whichever is higher)";
}
function clk3(){
  document.getElementById('img-bk').style['width'] = "282px";
  document.getElementById('cls-f').style['margin-left'] = "-1600px";
  document.getElementById('d6-2-h1').textContent = "Place the order";
  document.getElementById('d6-2-p').textContent = "It's execution time! Pay 50% of the final quotation to kickstart the order process";
}
function clk4(){
  document.getElementById('img-bk').style['width'] = "394px";
  document.getElementById('cls-f').style['margin-left'] = "-2400px";
  document.getElementById('d6-2-h1').textContent = "Installation begins";
  document.getElementById('d6-2-p').textContent = "Pay 100% before delivery and watch your home come alive";
}
function clk5(){
  document.getElementById('img-bk').style['width'] = "500px";
  document.getElementById('cls-f').style['margin-left'] = "-3200px";
  document.getElementById('d6-2-h1').textContent = "Move in!";
  document.getElementById('d6-2-p').textContent = "Your Livspace home is now ready! It's time to make new memories!";
}

function im_ch(){
  if (document.getElementById('img-bk').offsetWidth >= 500){
    document.getElementById('ara1').click()
  }
  else if (document.getElementById('img-bk').offsetWidth >= 395){
    document.getElementById('ara5').click()
  }
  else if (document.getElementById('img-bk').offsetWidth >= 282){
    document.getElementById('ara4').click()
  }
  else if (document.getElementById('img-bk').offsetWidth >= 175){
    document.getElementById('ara3').click()
  }
  else if (document.getElementById('img-bk').offsetWidth >= 65){
    document.getElementById('ara2').click()
  }
}


let x = 1
setInterval(function(){
  if(x >= 6){
    im_ch();
    x = 1;
  }
  else{nw = document.getElementById('img-bk').offsetWidth + 10;
  document.getElementById('img-bk').style['width'] = `${nw}px`}
  x++;
}, 1000)