const cart = [];
const cartPanel = document.getElementById("cartPanel");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

const orderForm = document.getElementById("orderForm");

function renderCart() {
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = "<li>لا يوجد منتجات حالياً.</li>";
    cartCount.textContent = "0";
    cartTotal.textContent = "0 EGP";
    return;
  }

  cart.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${item.name} × ${item.qty}</span>
      <strong>${item.price * item.qty} EGP</strong>
    `;
    cartItems.appendChild(li);
  });

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  cartCount.textContent = String(totalQty);
  cartTotal.textContent = `${totalPrice} EGP`;
}

function addToCart(name, price, qty = 1) {
  const existing = cart.find((item) => item.name === name);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ name, price, qty });
  }

  renderCart();
  cartPanel.classList.add("show");
}

document.querySelectorAll(".qty-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const display = button.parentElement.querySelector(".qty-display");
    const currentQty = Number(display.textContent);
    const nextQty = Math.max(1, currentQty + Number(button.dataset.step));
    display.textContent = nextQty;

    const productName = button.dataset.product;
    const price = Number(button.dataset.price);

    const cartButton = document.querySelector(`.btn-cart[onclick*="${productName}"]`);
    if (cartButton) {
      cartButton.setAttribute("onclick", `addToCart('${productName}', ${price}, ${nextQty})`);
    }
  });
});

orderForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const city = document.getElementById("city").value.trim();
  const service = document.getElementById("service").value.trim();
  const notes = document.getElementById("notes").value.trim();

  const itemsText = cart.length
    ? cart.map((item) => `- ${item.name} × ${item.qty} = ${item.price * item.qty} EGP`).join("\n")
    : "لا توجد منتجات مختارة";

  const message = encodeURIComponent(
    `مرحبا، أريد تقديم طلب جديد:\n\n` +
      `الاسم: ${name}\n` +
      `الهاتف: ${phone}\n` +
      `المدينة: ${city || "غير محدد"}\n` +
      `نوع الخدمة: ${service || "غير محدد"}\n` +
      `ملاحظات: ${notes || "لا توجد"}\n\n` +
      `المنتجات:\n${itemsText}`
  );

  window.open(`https://wa.me/966500000000?text=${message}`, "_blank");

  orderForm.reset();
  cart.length = 0;
  renderCart();
  cartPanel.classList.remove("show");
});

renderCart();
