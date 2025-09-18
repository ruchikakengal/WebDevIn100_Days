setInterval(function(){
    if(document.getElementById('radio1').checked){
        document.getElementById("radio2").checked = true;
      }
    else if(document.getElementById('radio2').checked){
        document.getElementById("radio3").checked = true;
      }
    else if(document.getElementById('radio3').checked){
        document.getElementById("radio4").checked = true;
      }
    else if(document.getElementById('radio4').checked){
        document.getElementById("radio5").checked = true;
      }
    else if(document.getElementById('radio5').checked){
        document.getElementById("radio6").checked = true;
      }
    else if(document.getElementById('radio6').checked){
        document.getElementById("radio1").checked = true;
      }
  }, 4500)