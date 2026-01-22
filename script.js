const productsEl = document.getElementById("products");
const modal = document.getElementById("modal");
const overlay = document.getElementById("overlay");
const checkoutBtn = document.getElementById("checkout");

let products = [];
let currentProduct = null;
let cart = JSON.parse(localStorage.getItem("cart") || "[]");

/* Load products */
fetch("data/products.json")
  .then(r => r.json())
  .then(data => {
    products = data.products;
    renderProducts();
  });

function renderProducts() {
  products.forEach(p => {
    if (p.status === "out_of_stock") return;

    const div = document.createElement("div");
    div.className = "product";

    div.innerHTML = `
      <img src="${p.image}">
      <h3>${p.name}</h3>
      <p>${p.price} грн</p>
      ${p.status === "low_stock" ? '<p class="status-low">Закінчується</p>' : ''}
    `;

    div.onclick = () => openModal(p);
    productsEl.appendChild(div);
  });
}

/* MODAL */
function openModal(product) {
  currentProduct = product;

  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");

  requestAnimationFrame(() => {
    modal.classList.add("show");
    overlay.classList.add("show");
  });

  document.getElementById("modalImage").src = product.image;
  document.getElementById("modalName").innerText = product.name;
  document.getElementById("modalDescription").innerText = product.description;
  document.getElementById("modalPrice").innerText = product.price + " грн";
  document.getElementById("modalStatus").innerText =
    product.status === "low_stock" ? "Закінчується" : "В наявності";

  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.remove("show");
  overlay.classList.remove("show");

  setTimeout(() => {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
  }, 250);

  document.body.style.overflow = "";
}

document.getElementById("closeModal").onclick = closeModal;
overlay.onclick = closeModal;

/* CART */
document.getElementById("addToCart").onclick = () => {
  cart.push({ id: currentProduct.id, qty: 1 });
  localStorage.setItem("cart", JSON.stringify(cart));
  checkoutBtn.classList.remove("hidden");
  closeModal();
};

/* TELEGRAM */
checkoutBtn.onclick = () => {
  const payload = btoa(JSON.stringify({ items: cart }));
  window.open(
    `https://t.me/patcheddotfunbot?start=${payload}`,
    "_blank"
  );
};
