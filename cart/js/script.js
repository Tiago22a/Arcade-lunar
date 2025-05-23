// Limpa o carrinho apenas na primeira vez
if (!localStorage.getItem("cartInitialized")) {
	localStorage.removeItem("cart");
	localStorage.setItem("cartInitialized", "true");
}

let cart = {};

try {
	cart = JSON.parse(localStorage.getItem("cart")) || {};
} catch {
	cart = {};
}

const container = document.getElementById("cart-container");
const footer = document.getElementById("cart-footer");
const totalEl = document.getElementById("total");

function renderCart() {
	container.innerHTML = "";
	let total = 0;
	const items = Object.values(cart);

	if (items.length === 0) {
		container.innerHTML = `<p class="text-center text-gray-500">Your cart is empty.</p>`;
		footer.classList.add("hidden");
		localStorage.setItem("cart", JSON.stringify(cart)); // atualiza localStorage mesmo se vazio
		return;
	}

	let html = "";
	items.forEach((item) => {
		const subtotal = item.price * item.qty;
		total += subtotal;

		html += `
          <div class="bg-[#1a1a1a] p-4 rounded flex justify-between items-center shadow">
            <div class="flex items-center gap-4">
              <img src="${item.image || ""}" alt="${
			item.name
		}" class="w-16 h-16 object-contain rounded bg-black" />
              <div>
                <h3 class="font-bold">${item.name}</h3>
                <p class="text-sm text-gray-400">$${item.price.toFixed(2)} × ${
			item.qty
		}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="changeQty('${
					item.id
				}', -1)" class="text-white">–</button>
              <span>${item.qty}</span>
              <button onclick="changeQty('${
					item.id
				}', 1)" class="btn btn-purple text-white">+</button>
              <button onclick="removeItem('${
					item.id
				}')" class="bg-red-600 hover:bg-red-700 p-2 rounded text-white">Remove</button>
            </div>
          </div>
        `;
	});

	container.innerHTML = html;
	totalEl.innerText = total.toFixed(2);
	footer.classList.remove("hidden");
	localStorage.setItem("cart", JSON.stringify(cart));
}

function changeQty(id, delta) {
	if (cart[id]) {
		cart[id].qty += delta;
		if (cart[id].qty <= 0) delete cart[id];
		renderCart();
	}
}

function removeItem(id) {
	delete cart[id];
	localStorage.setItem("cart", JSON.stringify(cart)); // **Atualiza localStorage aqui!**
	renderCart();
}

function checkout() {
	const payload = Object.values(cart);
	console.log("Send to backend:", payload);
	alert("Checkout simulated.\nCheck console for payload.");
}

renderCart();
