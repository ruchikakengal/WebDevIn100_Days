window.addEventListener('resize', function(){
  if( window.innerHeight  != screen.height){
    elem.style['visibility']='hidden';
    elem.style['display']='none';
    elem.pause();
  }
})

function btn(link){
  location.href = link;
}

function showorhide(id) {
  if (document.getElementById(id).style.display == 'none'){
  document.getElementById(id).style.display = 'block';
  }
  else{
      document.getElementById(id).style.display = 'none';
  }
}

function openvid(val) {
  elem = document.getElementById('myvideo');
  if (elem.requestFullscreen) {
    elem.style['visibility']='visible';
    elem.style['display']='unset';
    elem.setAttribute('src', val)
    elem.load();
    elem.play();
    elem.requestFullscreen();
  }
}

window.addEventListener('scroll', function(){
  var scroll = document.querySelector('.up');
  scroll.classList.toggle("active", window.scrollY > window.innerHeight)
})
function totop(){
  window.scrollTo({
      top: 0
  })
}