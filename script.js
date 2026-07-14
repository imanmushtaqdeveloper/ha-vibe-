
const STORE = {
  name: "HA Vibe",
  phone: "923207036412",
  currency: "Rs."
};

const products = [
  {id:"1",name:"No Limit Graphic Tee",price:1499,image:"images/product1.jpeg",description:"Make a bold statement with the No Limit Graphic Tee. Premium soft cotton, breathable comfort and an edgy streetwear look for everyday wear.",colors:[{name:"White",image:"images/product1.jpeg"},{name:"Black",image:"images/nolimit-black.jpg"}]},
  {id:"2",name:"GOAT Ronaldo T-Shirt",price:1499,image:"images/product2.jpeg",description:"Celebrate football greatness with the GOAT Ronaldo T-Shirt. A sporty statement graphic on premium cotton with a soft, modern fit.",colors:[{name:"Sky",image:"images/product2.jpeg"},{name:"Black",image:"images/Ronaldo-black.jpg"}]},
  {id:"3",name:"Spider Graphic Tee",price:1499,image:"images/product3.jpeg",description:"A clean, bold Spider Graphic Tee made for modern streetwear. Soft premium cotton keeps it comfortable for everyday use.",colors:[{name:"White",image:"images/product3.jpeg"}]},
  {id:"4",name:"Superhero Graphic Tee",price:1499,image:"images/product4.jpeg",description:"Upgrade your everyday style with a bold superhero-inspired graphic, premium cotton and a comfortable modern fit.",colors:[{name:"Black",image:"images/product4.jpeg"}]},
  {id:"5",name:"Live Alone Like a Lion Tee",price:1499,image:"images/product5.jpeg",description:"A powerful lion-inspired statement tee representing courage, confidence and individuality. Soft, breathable and made for everyday style.",colors:[{name:"Black",image:"images/product5.jpeg"},{name:"White",image:"images/lion-white.jpg"}]},
  {id:"6",name:"Samurai Graphic Tee",price:1499,image:"images/product6.jpeg",description:"A striking Samurai-inspired graphic tee with premium cotton comfort and a modern streetwear fit.",colors:[{name:"Grey",image:"images/product9.jpeg"},{name:"White",image:"images/product6.jpeg"},{name:"Sky Blue",image:"images/samurai-sky.webp"}]},
  {id:"7",name:"Alone Warrior Graphic T-Shirt",price:1499,image:"images/product7.jpeg",description:"Stand out with the Alone Warrior Graphic T-Shirt. The bold warrior artwork represents strength, confidence and individuality.",colors:[{name:"White",image:"images/warrior-white.webp"},{name:"Black",image:"images/product7.jpeg"},{name:"Brown",image:"images/warrior-brown.webp"},{name:"Sky",image:"images/warrior-sky.webp"}]},
  {id:"10",name:"GOAT Messi T-Shirt",price:1499,image:"images/product10.jpeg",description:"Celebrate football greatness with the GOAT Messi T-Shirt. Premium cotton, breathable comfort and a sporty graphic for fans.",colors:[{name:"Sky",image:"images/product10.jpeg"}]}
];

function getProduct(id){ return products.find(p => p.id === String(id)); }
function getList(key){ try{return JSON.parse(localStorage.getItem(key)) || [];}catch(e){return [];} }
function saveList(key,list){ localStorage.setItem(key,JSON.stringify(list)); updateCounts(); }
function variantKey(item){ return `${item.id}-${item.color || ""}-${item.size || ""}`; }
function money(value){ return `${STORE.currency} ${Number(value).toLocaleString()}`; }

function updateCounts(){
  const cartCount=document.getElementById("cart-count");
  const wishlistCount=document.getElementById("wishlist-count");
  if(cartCount) cartCount.textContent=getList("cart").reduce((sum,item)=>sum+(item.quantity||1),0);
  if(wishlistCount) wishlistCount.textContent=getList("wishlist").length;
}
document.addEventListener("DOMContentLoaded", updateCounts);

const topBtn=document.getElementById("topBtn");
if(topBtn){
  window.addEventListener("scroll",()=>topBtn.style.display=window.scrollY>300?"block":"none");
  topBtn.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));
}

document.querySelectorAll(".view-btn").forEach(button=>button.addEventListener("click",function(){
  const card=this.closest(".product-card");
  if(card) localStorage.setItem("selectedProductId",card.dataset.id);
}));

document.querySelectorAll(".wishlist").forEach(button=>button.addEventListener("click",function(){
  const card=this.closest(".product-card");
  const product=card && getProduct(card.dataset.id);
  if(!product) return;
  const item={...product,color:product.colors[0].name,image:product.colors[0].image};
  const wishlist=getList("wishlist");
  if(wishlist.some(x=>x.id===item.id && x.color===item.color)){ alert("Already in Wishlist!"); return; }
  wishlist.push(item); saveList("wishlist",wishlist); this.textContent="❤️"; alert("Added to Wishlist!");
}));

const productImage=document.getElementById("product-image");
if(productImage){
  const params=new URLSearchParams(location.search);
  const id=params.get("id") || localStorage.getItem("selectedProductId");
  const product=getProduct(id);
  if(product){
    localStorage.setItem("selectedProductId",product.id);
    let selectedColor=product.colors[0], selectedSize="";
    document.getElementById("product-name").textContent=product.name;
    document.getElementById("product-price").textContent=money(product.price);
    document.getElementById("product-description").textContent=product.description;
    productImage.src=selectedColor.image;
    productImage.alt=`${product.name} - ${selectedColor.name}`;

    const colors=document.getElementById("color-options");
    product.colors.forEach((variant,index)=>{
      const btn=document.createElement("button");
      btn.className="color-option"+(index===0?" active":"");
      btn.type="button";
      btn.innerHTML=`<span class="swatch swatch-${variant.name.toLowerCase().replace(/\s+/g,"-")}"></span>${variant.name}`;
      btn.addEventListener("click",()=>{
        selectedColor=variant;
        productImage.classList.add("changing");
        setTimeout(()=>{ productImage.src=variant.image; productImage.alt=`${product.name} - ${variant.name}`; productImage.classList.remove("changing"); },120);
        colors.querySelectorAll(".color-option").forEach(x=>x.classList.remove("active"));
        btn.classList.add("active");
        document.getElementById("selected-color").textContent=variant.name;
      });
      colors.appendChild(btn);
    });
    document.getElementById("selected-color").textContent=selectedColor.name;

    document.querySelectorAll(".size-option").forEach(btn=>btn.addEventListener("click",()=>{
      selectedSize=btn.dataset.size;
      document.querySelectorAll(".size-option").forEach(x=>x.classList.remove("active"));
      btn.classList.add("active");
    }));

    const currentItem=()=>({...product,color:selectedColor.name,size:selectedSize,image:selectedColor.image,quantity:1});
    document.getElementById("addToCartBtn").addEventListener("click",()=>{
      if(!selectedSize){ alert("Please select a size first."); return; }
      const item=currentItem(), cart=getList("cart"), existing=cart.find(x=>variantKey(x)===variantKey(item));
      if(existing) existing.quantity=(existing.quantity||1)+1; else cart.push(item);
      saveList("cart",cart);
      alert(`${item.name} (${item.color}, ${item.size}) added to cart!`);
    });
    document.getElementById("wishlistBtn").addEventListener("click",()=>{
      const item=currentItem(), wishlist=getList("wishlist");
      if(wishlist.some(x=>x.id===item.id && x.color===item.color)){ alert("This color is already in your Wishlist!"); return; }
      wishlist.push(item); saveList("wishlist",wishlist); alert(`${item.name} (${item.color}) added to Wishlist!`);
    });
  } else {
    document.querySelector(".product-details").innerHTML='<div class="product-not-found"><h1>Product not found</h1><a class="btn" href="shop.html">Back to Shop</a></div>';
  }
}

const clearWishlistBtn=document.getElementById("clearWishlist");
if(clearWishlistBtn) clearWishlistBtn.addEventListener("click",()=>{localStorage.removeItem("wishlist");location.reload();});

function checkout(){
  const cart=getList("cart");
  if(!cart.length){ alert("Your cart is empty!"); return; }
  location.href="checkout.html";
}
