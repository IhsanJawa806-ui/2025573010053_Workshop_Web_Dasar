// Data produk
const produkList = [
  { id: 1, nama: "Produk 1", harga: 10000 },
  { id: 2, nama: "Produk 2", harga: 15000 },
  { id: 3, nama: "Produk 3", harga: 20000 },
  { id: 4, nama: "Produk 4", harga: 25000 },
  { id: 5, nama: "Produk 5", harga: 30000 },
];

let cart = [];

// Render produk
function renderProduk() {
  const container = document.getElementById("produk");
  container.innerHTML = "";

  produkList.forEach((p) => {
    container.innerHTML += `
      <div class="card">
        <img src="https://picsum.photos/150?random=${p.id}" />
        <h4>${p.nama}</h4>
        <p>Rp ${p.harga}</p>
        <button data-id="${p.id}">Tambah</button>
      </div>
    `;
  });
}

// Tambah ke cart
function tambahKeCart(id) {
  const item = cart.find((i) => i.id === id);

  if (item) {
    item.qty++;
  } else {
    const produk = produkList.find((p) => p.id === id);
    cart.push({ ...produk, qty: 1 });
  }

  renderCart();
}

// Render cart
function renderCart() {
  const list = document.getElementById("cart-list");
  const totalEl = document.getElementById("total");
  const badge = document.getElementById("badge");

  list.innerHTML = "";

  let total = 0;
  let totalItem = 0;

  cart.forEach((item) => {
    total += item.harga * item.qty;
    totalItem += item.qty;

    list.innerHTML += `
      <div class="item">
        <strong>${item.nama}</strong><br>
        Rp ${item.harga} x ${item.qty} <br>
        <button data-action="minus" data-id="${item.id}">-</button>
        <button data-action="plus" data-id="${item.id}">+</button>
        <button data-action="hapus" data-id="${item.id}">Hapus</button>
      </div>
    `;
  });

  totalEl.textContent = total;
  badge.textContent = totalItem;
}

// Event produk (delegation)
document.getElementById("produk").addEventListener("click", (e) => {
  const id = e.target.dataset.id;
  if (id) tambahKeCart(Number(id));
});

// Event cart (delegation)
document.getElementById("cart-list").addEventListener("click", (e) => {
  const id = Number(e.target.dataset.id);
  const action = e.target.dataset.action;

  const item = cart.find((i) => i.id === id);
  if (!item) return;

  if (action === "plus") item.qty++;
  if (action === "minus") item.qty--;
  if (action === "hapus") cart = cart.filter((i) => i.id !== id);

  // hapus jika qty 0
  cart = cart.filter((i) => i.qty > 0);

  renderCart();
});

// Checkout
document.getElementById("checkout").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Keranjang kosong!");
    return;
  }

  let summary = "Ringkasan Order:\n\n";
  let total = 0;

  cart.forEach((item) => {
    summary += `${item.nama} x${item.qty} = Rp ${item.harga * item.qty}\n`;
    total += item.harga * item.qty;
  });

  summary += `\nTotal: Rp ${total}`;

  alert(summary);
});

// Init
renderProduk();
renderCart();
