const len = document.getElementById('len');
const lenVal = document.getElementById('lenVal');
const out = document.getElementById('output');
const strengthEl = document.getElementById('strength');
const copyBtn = document.getElementById('copyBtn');

const sets = {
  lc: 'abcdefghijklmnopqrstuvwxyz',
  uc: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  num: '0123456789',
  sym: '!@#$%^&*()_+-=[]{};:,./?'
};

len.addEventListener('input', ()=> lenVal.textContent = len.value);

function getSelectedSets(){
  let chars = '';
  for(const id of Object.keys(sets)){
    if(document.getElementById(id).checked) chars += sets[id];
  }
  return chars;
}

function generate(){
  const chars = getSelectedSets();
  const n = +len.value;
  if(!chars){ out.value = 'Select at least one set'; return; }
  let pwd = '';
  for(let i=0;i<n;i++){
    pwd += chars[Math.floor(Math.random()*chars.length)];
  }
  out.value = pwd;
  strengthEl.textContent = 'Strength: ' + strength(pwd);
}

function strength(pwd){
  let score = 0;
  if(pwd.length >= 12) score++;
  if(/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
  if(/[0-9]/.test(pwd)) score++;
  if(/[^A-Za-z0-9]/.test(pwd)) score++;
  return ['Weak','Okay','Good','Strong','Very Strong'][score];
}

document.getElementById('gen').addEventListener('click', generate);
copyBtn.addEventListener('click', async ()=>{
  try{ await navigator.clipboard.writeText(out.value); copyBtn.textContent='Copied!'; setTimeout(()=>copyBtn.textContent='Copy',800);}catch(e){}
});