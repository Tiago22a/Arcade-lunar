import { urlBaseImg } from "../../shared/util/geral.js";
import fetchClient from "../../shared/util/fetchClient.js";

const PUBLIC_KEY = "APP_USR-fd35b4c6-d231-4c17-88fa-437dcc01c44f";

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
			<td class="py-4 flex flex-col sm:flex-row items-start gap-2 sm:gap-4 max-w-[150px]">
				<img src="${urlBaseImg}/products/${product.id}/card.png" alt="${
			product.name
		}" class="w-16 h-16 object-cover rounded-lg border border-[#35324a]" />
				<div class="flex-1 w-full">
					<div class="font-semibold text-gray-200">${product.name}</div>
					<div class="text-xs text-gray-400">ID: ${product.id}</div>
					<div class="text-xs text-gray-400">Category: ${product.type?.name || ""}</div>
					<div class="text-xs mt-1">
						<button class="text-red-400 hover:underline" onclick="removeFromCart(${
							product.id
						})">Remove</button>
					</div>
					<!-- Quantity selector below product info -->
					<div class="flex items-center gap-2 mt-3">
						<button class="bg-[#232136] text-purple-400 px-2 py-1 rounded hover:bg-[#2a2740]" onclick="updateQty(${
							product.id
						}, -1)">-</button>
						<span class="font-bold">${product.quantity || 1}</span>
						<button class="bg-[#232136] text-purple-400 px-2 py-1 rounded hover:bg-[#2a2740]" onclick="updateQty(${
							product.id
						}, 1)">+</button>
					</div>
				</div>
			</td>
			<td class="py-4 align-top w-32 text-[16px] sm:w-32">
				<div>
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
				</div>
			</td>
			<td class="py-4 align-top w-24 text-[16px] sm:w-24">
				<!-- Add spacing between price and total on mobile -->
				<div class="font-bold text-gray-200">R$ ${totalPrice.toFixed(2)}</div>
			</td>
			<td class="py-4 align-top"></td>
		`;
		cartContainer.appendChild(tr);
	});

	if (subtotalElem) subtotalElem.textContent = `R$ ${subtotal.toFixed(2)}`;
	if (totalElem) totalElem.textContent = `R$ ${subtotal.toFixed(2)}`;
	if (shippingElem) shippingElem.textContent = "Free";
	if (taxElem) taxElem.textContent = "None";
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

const checkoutBtn = document.getElementById("checkoutBtn");
checkoutBtn.addEventListener("click", async function () {
	const cart = JSON.parse(localStorage.getItem("cart")) || [];
	if (cart.length === 0) {
		return;
	}

	// Remove erro anterior, se houver
	let errorElem = document.getElementById("cart-error-message");
	if (errorElem) errorElem.remove();

	const bodyJson = cart.map((product) => ({
		productId: product.id,
		quantity: product.quantity || 1,
	}));

	const res = await fetchClient("/order", {
		method: "POST",
		body: JSON.stringify(bodyJson),
	});
	const data = await res.json();

	if (res.status === 404) {
		const cartSection = document.querySelector("section.flex-1");
		if (cartSection) {
			const errorDiv = document.createElement("div");
			errorDiv.id = "cart-error-message";
			errorDiv.className =
				"bg-red-500/10 border border-red-500 text-red-400 rounded-lg px-4 py-3 mb-4 mt-2 text-center font-semibold";
			errorDiv.textContent =
				"One of the products in your cart was not found.";
			cartSection.prepend(errorDiv);
		}
		return;
	}

	// ...existing code for success or other errors...
	if (res.status === 201) {
		window.location.replace(
			"/checkout/?preferenceId=" + data.mercadoPagoPreferenceId
		);
	} else {
		const cartSection = document.querySelector("section.flex-1");
		if (cartSection) {
			const errorDiv = document.createElement("div");
			errorDiv.id = "cart-error-message";
			errorDiv.className =
				"bg-red-500/10 border border-red-500 text-red-400 rounded-lg px-4 py-3 mb-4 mt-2 text-center font-semibold";
			errorDiv.textContent =
				"An error occurred while processing your order. Please try again.";
			cartSection.prepend(errorDiv);
		}
	}
});
