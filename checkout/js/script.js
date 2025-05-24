import { urlBaseImg } from "/shared/util/geral.js";

const PUBLIC_KEY = "APP_USR-fd35b4c6-d231-4c17-88fa-437dcc01c44f";

// Render products from localStorage
function renderCheckoutProducts() {
	const cart = JSON.parse(localStorage.getItem("cart")) || [];
	const container = document.getElementById("checkout-products");
	const subtotalElem = document.getElementById("summary-subtotal");
	const totalElem = document.getElementById("summary-total");
	let subtotal = 0;

	container.innerHTML = "";

	if (cart.length === 0) {
		container.innerHTML =
			'<div class="text-gray-400 text-center py-8">Your cart is empty.</div>';
		subtotalElem.textContent = "R$ 0.00";
		totalElem.textContent = "R$ 0.00";
		return;
	}

	cart.forEach((product) => {
		const price =
			product.discount && product.discount > 0
				? product.price - (product.discount / 100) * product.price
				: product.price;
		const totalPrice = price * (product.quantity || 1);
		subtotal += totalPrice;

		const div = document.createElement("div");
		div.className =
			"flex items-center gap-4 border-b border-[#35324a] pb-4 last:border-b-0";
		div.innerHTML = `
                    <img src="${urlBaseImg}/products/${
			product.id
		}/card.png" alt="${
			product.name
		}" class="w-14 h-14 object-cover rounded-lg border border-[#35324a]" />
                    <div class="flex-1">
                        <div class="font-semibold text-gray-200">${
							product.name
						}</div>
                        <div class="text-xs text-gray-400">Qty: ${
							product.quantity || 1
						}</div>
                    </div>
                    <div class="text-right">
                        <div class="text-purple-400 font-bold">R$ ${price.toFixed(
							2
						)}</div>
                        <div class="text-xs text-gray-400">Total: R$ ${totalPrice.toFixed(
							2
						)}</div>
                    </div>
                `;
		container.appendChild(div);
	});

	subtotalElem.textContent = `R$ ${subtotal.toFixed(2)}`;
	totalElem.textContent = `R$ ${subtotal.toFixed(2)}`;
}

async function initMercadoPago() {
	const preferenceId = urlSearchParams.get("preferenceId");
    const walletLoading = document.getElementById("wallet-loading");
	const walletContain = document.getElementById("walletBrick_container");

	const mp = new MercadoPago(PUBLIC_KEY);

	const bricksBuilder = mp.bricks();
	const renderWalletBrick = async (bricksBuilder) => {
		await bricksBuilder.create("wallet", "walletBrick_container", {
			initialization: {
				preferenceId: preferenceId,
			},
		});
	};

	await renderWalletBrick(bricksBuilder);

    walletLoading.classList.add("hidden");
	walletContain.classList.remove("hidden");
}

const urlSearchParams = new URLSearchParams(window.location.search);

renderCheckoutProducts();
initMercadoPago();
