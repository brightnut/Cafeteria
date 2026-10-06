const menu = [
  {id:1,name:"Cappuccino",category:"Coffee",price:79,old:99,emoji:"☕",desc:"Smooth espresso with creamy milk foam."},
  {id:2,name:"Cold Coffee",category:"Coffee",price:89,old:109,emoji:"🧋",desc:"Chilled coffee blended with rich milk."},
  {id:3,name:"Americano",category:"Coffee",price:69,old:89,emoji:"☕",desc:"Bold espresso topped with hot water."},
  {id:4,name:"Masala Tea",category:"Coffee",price:39,old:49,emoji:"🍵",desc:"Classic Indian tea with aromatic spices."},
  {id:5,name:"Veg Sandwich",category:"Snacks",price:69,old:89,emoji:"🥪",desc:"Fresh vegetables, cheese and toasted bread."},
  {id:6,name:"Paneer Wrap",category:"Snacks",price:89,old:109,emoji:"🌯",desc:"Spiced paneer with fresh veggies in a wrap."},
  {id:7,name:"Samosa",category:"Snacks",price:25,old:30,emoji:"🥟",desc:"Crispy pastry filled with spiced potato."},
  {id:8,name:"French Fries",category:"Snacks",price:59,old:69,emoji:"🍟",desc:"Golden, crispy and lightly salted."},
  {id:9,name:"Veg Biryani",category:"Meals",price:119,old:139,emoji:"🍛",desc:"Aromatic basmati rice with seasonal vegetables."},
  {id:10,name:"Paneer Rice Bowl",category:"Meals",price:129,old:149,emoji:"🍚",desc:"Rice bowl topped with delicious paneer."},
  {id:11,name:"Rajma Rice",category:"Meals",price:99,old:119,emoji:"🍲",desc:"Comforting rajma served with steamed rice."},
  {id:12,name:"Veg Noodles",category:"Meals",price:109,old:129,emoji:"🍜",desc:"Wok-tossed noodles with fresh vegetables."},
  {id:13,name:"Chocolate Brownie",category:"Desserts",price:59,old:69,emoji:"🍫",desc:"Warm, fudgy chocolate brownie."},
  {id:14,name:"Gulab Jamun",category:"Desserts",price:39,old:49,emoji:"🍮",desc:"Soft milk-solid dumplings in sweet syrup."},
  {id:15,name:"Ice Cream Cup",category:"Desserts",price:49,old:59,emoji:"🍨",desc:"Creamy vanilla ice cream served chilled."},
  {id:16,name:"Cookie",category:"Desserts",price:29,old:35,emoji:"🍪",desc:"Freshly baked crunchy chocolate cookie."}
];

let cart = JSON.parse(localStorage.getItem("cafeteriaCart") || "[]");
let activeCategory = "All";

const grid = document.getElementById("menuGrid");
const searchInput = document.getElementById("searchInput");
const emptyState = document.getElementById("emptyState");

function money(n){ return `₹${n.toFixed(0)}`; }

function renderMenu(){
  const q = searchInput.value.trim().toLowerCase();
  const items = menu.filter(x => (activeCategory === "All" || x.category === activeCategory) &&
    (x.name.toLowerCase().includes(q) || x.category.toLowerCase().includes(q) || x.desc.toLowerCase().includes(q)));
  grid.innerHTML = items.map(item => `
    <article class="food-card">
      <div class="food-image">${item.emoji}</div>
      <div class="food-info">
        <div class="food-meta"><h3>${item.name}</h3><span class="category">${item.category}</span></div>
        <p>${item.desc}</p>
        <div class="food-meta"><span class="price">${money(item.price)} <del>${money(item.old)}</del></span>
        <button class="add-btn" onclick="addToCart(${item.id})">+ Add</button></div>
      </div>
    </article>`).join("");
  emptyState.classList.toggle("hidden", items.length !== 0);
}

function addToCart(id, qty=1){
  const item = menu.find(x=>x.id===id);
  const existing = cart.find(x=>x.id===id);
  if(existing) existing.qty += qty; else cart.push({id,qty});
  saveCart(); renderCart();
  openCart();
}

function changeQty(id, delta){
  const item = cart.find(x=>x.id===id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) cart = cart.filter(x=>x.id!==id);
  saveCart(); renderCart();
}

function saveCart(){
  localStorage.setItem("cafeteriaCart", JSON.stringify(cart));
  document.getElementById("cartCount").textContent = cart.reduce((s,x)=>s+x.qty,0);
}

function renderCart(){
  const box = document.getElementById("cartItems");
  if(!cart.length){
    box.innerHTML = `<div class="empty-cart"><div style="font-size:3rem">🛒</div><p>Your cart is empty.</p><small>Add something delicious from the menu.</small></div>`;
  } else {
    box.innerHTML = cart.map(c => {
      const item = menu.find(x=>x.id===c.id);
      return `<div class="cart-item">
        <div class="cart-thumb">${item.emoji}</div>
        <div class="cart-item-main"><strong>${item.name}</strong><small>${money(item.price)} each</small>
        <div class="qty"><button onclick="changeQty(${item.id},-1)">−</button><span>${c.qty}</span><button onclick="changeQty(${item.id},1)">+</button></div></div>
        <strong>${money(item.price*c.qty)}</strong>
      </div>`;
    }).join("");
  }
  const subtotal = cart.reduce((s,c)=>{const i=menu.find(x=>x.id===c.id); return s+i.price*c.qty},0);
  const gst = subtotal*0.05;
  document.getElementById("subtotal").textContent=money(subtotal);
  document.getElementById("gst").textContent=money(gst);
  document.getElementById("total").textContent=money(subtotal+gst);
  document.getElementById("cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0);
  document.getElementById("checkoutBtn").disabled=!cart.length;
  document.getElementById("checkoutBtn").style.opacity=cart.length?1:.5;
}

const panel=document.getElementById("cartPanel"), overlay=document.getElementById("overlay");
function openCart(){panel.classList.add("open");overlay.classList.add("show")}
function closeCart(){panel.classList.remove("open");overlay.classList.remove("show")}
document.getElementById("cartBtn").onclick=openCart;
document.getElementById("heroCartBtn").onclick=openCart;
document.getElementById("closeCart").onclick=closeCart;
overlay.onclick=closeCart;

document.querySelectorAll(".filter").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active"); activeCategory=btn.dataset.category; renderMenu();
  });
});
searchInput.addEventListener("input",renderMenu);

document.getElementById("offerBtn").onclick=()=>{
  [1,5,13].forEach(id=>{const x=cart.find(c=>c.id===id); if(x)x.qty++; else cart.push({id,qty:1})});
  // Keep the advertised combo close to the stated price by adding the items individually.
  saveCart(); renderCart(); openCart();
};

const checkoutModal=document.getElementById("checkoutModal");
document.getElementById("checkoutBtn").onclick=()=>{if(cart.length){checkoutModal.classList.remove("hidden");closeCart()}};
document.getElementById("closeModal").onclick=()=>checkoutModal.classList.add("hidden");

document.getElementById("checkoutForm").addEventListener("submit",e=>{
  e.preventDefault();
  const orderId="CAF-"+Date.now().toString().slice(-6);
  document.getElementById("orderId").textContent=orderId;
  checkoutModal.classList.add("hidden");
  document.getElementById("successModal").classList.remove("hidden");
  cart=[];saveCart();renderCart();e.target.reset();
});
document.getElementById("doneBtn").onclick=()=>document.getElementById("successModal").classList.add("hidden");

document.getElementById("contactForm").addEventListener("submit",e=>{
  e.preventDefault(); alert("Thanks! Your message has been received."); e.target.reset();
});

document.getElementById("menuBtn").onclick=()=>document.getElementById("nav").classList.toggle("mobile-open");

renderMenu();renderCart();
