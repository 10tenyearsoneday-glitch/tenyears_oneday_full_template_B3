
const API = "https://script.google.com/macros/s/AKfycby06D9BwO2SF3CauIxlBfb2cCyEvuaMLnoOPPhwoyQh57T_wP8Al9L2fQuw2617cLF8/exec";

// ---------- products ----------
async function getProducts() {
  const r = await fetch(API + "?path=products");
  const j = await r.json();
  return j.ok ? j.products : [];
}

function byCategory(list, cat) {
  return list.filter(p => String(p.category).includes(cat));
}

// ---------- cart ----------
function getCart(){ return JSON.parse(localStorage.getItem("cart")||"[]"); }
function saveCart(c){ localStorage.setItem("cart", JSON.stringify(c)); }
function addToCart(p){ 
  const c=getCart(); 
  const ex=c.find(x=>x.id===p.id); 
  if(ex) ex.qty++; else c.push({id:p.id,title:p.title,price:p.price,qty:1}); 
  saveCart(c); alert("已加入購物車"); 
}

// ---------- render ----------
async function renderGrid(el, category){
  const all = await getProducts();
  const list = byCategory(all, category);
  el.innerHTML = "";
  list.forEach(p=>{
    const d=document.createElement("div");
    d.className="card";
    d.innerHTML=`<img src="${p.image||''}"><h4>${p.title}</h4>
      <div class="price">NT$ ${p.price}</div>
      <button>加入購物車</button>`;
    d.querySelector("button").onclick=()=>addToCart(p);
    el.appendChild(d);
  });
}

async function renderCart(el){ 
  const c=getCart(); let sum=0; el.innerHTML="";
  c.forEach(i=>{ sum+=i.price*i.qty;
    el.innerHTML+=`<div class="cart-row"><span>${i.title} x${i.qty}</span><span>NT$ ${i.price*i.qty}</span></div>`;
  });
  el.innerHTML+=`<hr><div class="cart-row"><b>合計</b><b>NT$ ${sum}</b></div>`;
}

window.renderGrid = renderGrid;
window.renderCart = renderCart;
