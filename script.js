const productsData = [
  {
    id: "samurai_cat",
    name: "Samurai Cat",
    price: 120,
    description: "Вініловий стікер 7×7 см",
    image: "assets/products/samurai_cat.png",
    status: "in_stock"
  }
];

const productsEl = document.getElementById("products");
const modal = document.getElementById("modal");
const overlay = document.getElementById("overlay");
const checkoutBtn = document.getElementById("checkout");

let currentProduct = null;
let cart = JSON.parse(localStorage.getItem("cart") || "[]");

/* Render products */
productsData.forEach(p => {
  if (p.status === "out_of_stock") return;

  const div = document.createElement("div");
  div.className = "product";
  div.innerHTML = `
    <img src="${p.image}">
    <h3>${p.name}</h3>
    <p>${p.price} грн</p>
  `;
  div.onclick = () => openModal(p);
  productsEl.appendChild(div);
});

/* Modal */
function openModal(product) {
  currentProduct = product;
  document.getElementById("modalImage").src = product.image;
  document.getElementById("modalName").innerText = product.name;
  document.getElementById("modalDescription").innerText = product.description;
  document.getElementById("modalPrice").innerText = product.price + " грн";

  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
  document.body.style.overflow = "";
}

document.getElementById("closeModal").onclick = closeModal;
overlay.onclick = closeModal;

/* Cart */
document.getElementById("addToCart").onclick = () => {
  cart.push({ id: currentProduct.id, qty: 1 });
  localStorage.setItem("cart", JSON.stringify(cart));
  checkoutBtn.classList.remove("hidden");
  closeModal();
};

/* Checkout → Telegram */
checkoutBtn.onclick = () => {
  const payload = btoa(JSON.stringify({ items: cart }));
  window.open(`https://t.me/YOUR_BOT_USERNAME?start=${payload}`, "_blank");
};
