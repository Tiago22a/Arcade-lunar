import { urlBaseImg } from "../../shared/util/geral.js";

function getProducts() {
	const cart = JSON.parse(localStorage.getItem("cart")) || [];
	const cartContainer = document.getElementById("cart-container");
	const subtotalElem = document.getElementById("subtotal");
	const totalElem = document.getElementById("total");
	const shippingElem = document.getElementById("shipping");
	const taxElem = document.getElementById("tax");
	const emptyMsg = document.getElementById("empty-cart-message");

	if (!cartContainer) return;

	cartContainer.innerHTML = "";

	if (cart.length === 0) {
		if (emptyMsg) emptyMsg.classList.remove("hidden");
		if (subtotalElem) subtotalElem.textContent = "R$ 0.00";
		if (totalElem) totalElem.textContent = "R$ 0.00";
		return;
	} else {
		if (emptyMsg) emptyMsg.classList.add("hidden");
	}

	let subtotal = 0;

	cart.forEach((product) => {
		const price =
			product.discount && product.discount > 0
				? product.price - (product.discount / 100) * product.price
				: product.price;
		const totalPrice = price * (product.quantity || 1);
		subtotal += totalPrice;

		const tr = document.createElement("tr");
		tr.className =
			"border-b border-[#232136] hover:bg-[#1b1a2b] transition";
		tr.innerHTML = `
			<td class="py-4 flex items-center gap-4 min-w-[220px]">
				<img src="${urlBaseImg}/products/${product.id}/card.png" alt="${
			product.name
		}" class="w-16 h-16 object-cover rounded-lg border border-[#35324a]" />
				<div>
					<div class="font-semibold text-gray-200">${product.name}</div>
					<div class="text-xs text-gray-400">ID: ${product.id}</div>
					<div class="text-xs text-gray-400">Category: ${product.type?.name || ""}</div>
					<div class="text-xs text-gray-400">Qty: ${product.quantity || 1}</div>
					<div class="text-xs mt-1">
						<button class="text-red-400 hover:underline" onclick="removeFromCart(${
							product.id
						})">Remove</button>
					</div>
				</div>
			</td>
			<td class="py-4 align-top">
				${
					product.discount && product.discount > 0
						? `<div class="text-xs text-gray-400 line-through">R$ ${product.price.toFixed(
								2
						  )}</div>
					   <div class="text-purple-400 font-bold">R$ ${price.toFixed(2)}</div>`
						: `<div class="text-purple-400 font-bold">R$ ${price.toFixed(
								2
						  )}</div>`
				}
			</td>
			<td class="py-4 align-top">
				<div class="font-bold text-gray-200">R$ ${totalPrice.toFixed(2)}</div>
			</td>
			<td class="py-4 align-top">
				<div class="flex items-center gap-2">
					<button class="bg-[#232136] text-purple-400 px-2 py-1 rounded hover:bg-[#2a2740]" onclick="updateQty(${
						product.id
					}, -1)">-</button>
					<span class="font-bold">${product.quantity || 1}</span>
					<button class="bg-[#232136] text-purple-400 px-2 py-1 rounded hover:bg-[#2a2740]" onclick="updateQty(${
						product.id
					}, 1)">+</button>
				</div>
			</td>
		`;
		cartContainer.appendChild(tr);
	});

	if (subtotalElem) subtotalElem.textContent = `R$ ${subtotal.toFixed(2)}`;
	if (totalElem) totalElem.textContent = `R$ ${subtotal.toFixed(2)}`;
	if (shippingElem) shippingElem.textContent = "TBD";
	if (taxElem) taxElem.textContent = "TBD";
}

// Funções para remover e atualizar quantidade
window.removeFromCart = function (id) {
	let cart = JSON.parse(localStorage.getItem("cart")) || [];
	cart = cart.filter((p) => p.id !== id);
	localStorage.setItem("cart", JSON.stringify(cart));
	getProducts();
};

window.updateQty = function (id, delta) {
	let cart = JSON.parse(localStorage.getItem("cart")) || [];
	const idx = cart.findIndex((p) => p.id === id);
	if (idx !== -1) {
		cart[idx].quantity = Math.max(1, (cart[idx].quantity || 1) + delta);
		localStorage.setItem("cart", JSON.stringify(cart));
		getProducts();
	}
};

getProducts();
