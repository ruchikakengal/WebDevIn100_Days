const products = [
  {id:1,title:'Oversized Jacket',category:'tops',price:2499,img:'https://via.placeholder.com/400x400?text=Jacket'},
  {id:2,title:'Slim Chinos',category:'bottoms',price:1999,img:'https://via.placeholder.com/400x400?text=Chinos'},
  {id:3,title:'Classic Sneakers',category:'shoes',price:3399,img:'https://via.placeholder.com/400x400?text=Sneakers'},
  {id:4,title:'Minimal Tee',category:'tops',price:799,img:'https://via.placeholder.com/400x400?text=Tee'},
  {id:5,title:'Knitted Scarf',category:'accessories',price:599,img:'https://via.placeholder.com/400x400?text=Scarf'},
  {id:6,title:'Pleated Skirt',category:'bottoms',price:1799,img:'https://via.placeholder.com/400x400?text=Skirt'},
  {id:7,title:'Leather Boots',category:'shoes',price:4499,img:'https://via.placeholder.com/400x400?text=Boots'},
  {id:8,title:'Canvas Bag',category:'accessories',price:999,img:'https://via.placeholder.com/400x400?text=Bag'}
];

const productsGrid = document.getElementById('productsGrid');
const categorySelect = document.getElementById('categorySelect');
const searchInput = document.getElementById('searchInput');
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const cartItemsEl = document.getElementById('cartItems');
const closeCart = document.getElementById('closeCart');
const cartCountEl = document.getElementById('cartCount');
const cartTotalEl = document.getElementById('cartTotal');
const exploreBtn = document.querySelector('.explore-btn');

let cart = JSON.parse(localStorage.getItem('modo_cart') || '[]');

function renderProducts(list){
  productsGrid.innerHTML = '';
  list.forEach(p=>{
    const card = document.createElement('article');
    card.className = 'card fade-in';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <div class="meta">
        <div>
          <h4>${p.title}</h4>
          <p>${p.category}</p>
        </div>
        <div class="price">₹${p.price}</div>
      </div>
      <div class="actions">
        <button class="btn add" data-id="${p.id}">Add</button>
        <button class="btn quick">Quick view</button>
      </div>
    `;
    productsGrid.appendChild(card);
  });

  document.querySelectorAll('.add').forEach(b => b.addEventListener('click', e=>{
    addToCart(+e.target.dataset.id);
  }));

  document.querySelectorAll('.quick').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const id = +e.target.closest('.card').querySelector('.add').dataset.id;
      const item = products.find(p=>p.id===id);
      alert(`Quick View:\n${item.title}\nCategory: ${item.category}\nPrice: ₹${item.price}`);
    });
  });
}

function addToCart(id){
  const item = products.find(p=>p.id===id);
  const existing = cart.find(c=>c.id===id);
  if(existing) existing.qty++;
  else cart.push({...item, qty:1});
  saveCart();
  updateCartUI();
  showCart();
}

function saveCart(){ localStorage.setItem('modo_cart', JSON.stringify(cart)); }
function updateCartUI(){
  cartCountEl.textContent = cart.reduce((s,i)=>s+i.qty,0);
  cartTotalEl.textContent = '₹' + cart.reduce((s,i)=>s+i.price*i.qty,0);
}

function showCart(){
  renderCartItems();
  cartModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function hideCart(){
  cartModal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

function renderCartItems(){
  cartItemsEl.innerHTML = '';
  if(cart.length===0){ cartItemsEl.innerHTML = '<p style="color:#6b7280">Your cart is empty.</p>'; return; }
  cart.forEach(ci=>{
    const el = document.createElement('div'); el.className='cart-item';
    el.innerHTML = `
      <img src="${ci.img}" alt="">
      <div style="flex:1"><strong>${ci.title}</strong><div style="color:#6b7280">₹${ci.price} • ${ci.qty} qty</div></div>
      <div>
        <button class="btn" data-id="${ci.id}" data-op="inc">+</button>
        <button class="btn" data-id="${ci.id}" data-op="dec">-</button>
      </div>
    `;
    cartItemsEl.appendChild(el);
  });
  cartItemsEl.querySelectorAll('button[data-op]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const id = +e.target.dataset.id; const op = e.target.dataset.op;
      const it = cart.find(c=>c.id===id);
      if(op==='inc') it.qty++;
      else it.qty = Math.max(0, it.qty-1);
      cart = cart.filter(i=>i.qty>0);
      saveCart(); renderCartItems(); updateCartUI();
    });
  });
}

function applyFilters(){
  let out = [...products];
  const cat = categorySelect.value;
  if(cat !== 'all') out = out.filter(p=>p.category===cat);
  const q = searchInput.value.trim().toLowerCase();
  if(q) out = out.filter(p => p.title.toLowerCase().includes(q) || p.category.includes(q));
  renderProducts(out);
}

// events
categorySelect.addEventListener('change', applyFilters);
searchInput.addEventListener('input', () => setTimeout(applyFilters, 150));
cartBtn.addEventListener('click', showCart);
closeCart.addEventListener('click', hideCart);
cartModal.addEventListener('click', (e)=>{ if(e.target === cartModal) hideCart(); });
exploreBtn.addEventListener('click', () => window.scrollTo({ top: productsGrid.offsetTop - 60, behavior: 'smooth' }));

// init
renderProducts(products);
updateCartUI();
