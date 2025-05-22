import fetchClient from "../../shared/util/fetchClient.js";
import { urlBaseImg } from "../../shared/util/geral.js";

function getProductIdFromUrl() {
	const params = new URLSearchParams(window.location.search);
	return params.get("id");
}

async function loadProduct() {
	const productId = getProductIdFromUrl();
	if (!productId) return;

	const mainImg = document.getElementById("mainImg");
	const titleElem = document.querySelector("h1.text-3xl, h1.md\\:text-4xl");
	const categoryElem = document.querySelector(
		".flex.flex-col.justify-start > p.text-xs"
	);
	const priceLine = document.querySelector(
		".flex.flex-col.justify-start > p.mt-3.text-sm"
	);
	const buyBtn = document.querySelector("button.w-full.py-3");
	const lineThrough = priceLine?.querySelector(".line-through");
	const priceNow = priceLine?.querySelector(".text-purple-400.font-bold");
	const installmentsElem = document.querySelector(
		".flex.flex-col.justify-start > p.mt-2.text-xs.text-gray-400"
	);

	if (mainImg) {
		mainImg.src =
			"https://upload.wikimedia.org/wikipedia/commons/5/5f/Google_Play_Arrow_logo.png";
	}

	if (titleElem) titleElem.textContent = "Loading...";

	const res = await fetchClient(`/product/${productId}`, {
		headers: { Accept: "application/json" },
		credentials: "include",
	});
	if (res.status === 401) {
		window.location.replace("/login");
		return;
	}
	if (!res.ok) {
		if (titleElem) titleElem.textContent = "Product not found";
		return;
	}
	const product = await res.json();

	// Carrega miniaturas dinamicamente
	const thumbnails = document.querySelectorAll(".thumbnail");
	const miniaturesRes = await fetchClient(
		`/product/${productId}/miniatures/quantity`,
		{
			headers: { Accept: "application/json" },
			credentials: "include",
		}
	);
	if (miniaturesRes.status === 401) {
		window.location.replace("/login");
		return;
	}
	let miniatureQuantity = 0;
	if (miniaturesRes.ok) {
		miniatureQuantity = await miniaturesRes.json();
		thumbnails.forEach((thumb, idx) => {
			if (idx < miniatureQuantity - 1) {
				thumb.src = `${urlBaseImg}/products/${productId}/${idx + 1}.jpg`;
				thumb.style.display = "";
				thumb.setAttribute("data-img-idx", idx + 1);
			} else {
				thumb.style.display = "none";
			}
		});
	}

	// Atualiza imagem principal (começa na primeira miniatura se houver, senão card.png)
	let currentImgIdx = 1;
	function setMainImg(idx) {
		mainImg.src = `${urlBaseImg}/products/${productId}/${idx}.jpg`;
		mainImg.setAttribute("data-current-idx", idx);
		thumbnails.forEach((thumb) => {
			thumb.classList.toggle("active", Number(thumb.getAttribute("data-img-idx")) === idx);
		});
	}
	if (miniatureQuantity > 1) {
		setMainImg(1);
	} else if (mainImg) {
		mainImg.src = `${urlBaseImg}/products/${product.id}/card.png`;
		mainImg.setAttribute("data-current-idx", "card");
	}

	// Troca imagem ao clicar em thumbnail
	thumbnails.forEach((thumb) => {
		thumb.onclick = function () {
			const idx = Number(thumb.getAttribute("data-img-idx"));
			if (idx) setMainImg(idx);
		};
	});

	// Troca imagem ao clicar nas setas
	const leftBtn = document.querySelector(".arrow-btn:first-of-type");
	const rightBtn = document.querySelector(".arrow-btn:last-of-type");
	if (leftBtn && rightBtn && miniatureQuantity > 1) {
		leftBtn.onclick = function () {
			let idx = Number(mainImg.getAttribute("data-current-idx")) || 1;
			idx = idx <= 1 ? miniatureQuantity - 1 : idx - 1;
			setMainImg(idx);
		};
		rightBtn.onclick = function () {
			let idx = Number(mainImg.getAttribute("data-current-idx")) || 1;
			idx = idx >= miniatureQuantity - 1 ? 1 : idx + 1;
			setMainImg(idx);
		};
	}

	// Atualiza preço
	let finalPrice = product.price;
	if (product.discount && product.discount > 0) {
		finalPrice = product.price - (product.discount / 100) * product.price;
	}
	if (priceLine) {
		if (product.discount && product.discount > 0) {
			if (lineThrough)
				lineThrough.textContent = `R$ ${product.price.toFixed(2)}`;
			if (priceNow) priceNow.textContent = `R$ ${finalPrice.toFixed(2)}`;
			priceLine.innerHTML = `from <span class="line-through">R$ ${product.price.toFixed(
				2
			)}</span> to only <span class="text-purple-400 font-bold">R$ ${finalPrice.toFixed(
				2
			)}</span>`;
		} else {
			priceLine.innerHTML = `<span class="text-purple-400 font-bold">R$ ${finalPrice.toFixed(
				2
			)}</span>`;
		}
	}

	// Atualiza parcelas (6x sem juros)
	if (installmentsElem) {
		const installments = 6;
		const installmentValue = (finalPrice / installments).toFixed(2);
		installmentsElem.textContent = `Up to ${installments}x of ${installmentValue} with no interest`;
	}

	// Atualiza título
	if (titleElem) titleElem.textContent = product.name;

	// Atualiza categoria
	if (categoryElem)
		categoryElem.textContent = product.type?.name
			? product.type.name.charAt(0).toUpperCase() +
			  product.type.name.slice(1)
			: "";

	// Atualiza botão de compra (opcional: pode adicionar lógica de compra)
	if (buyBtn) {
		buyBtn.onclick = () => {
			alert(`Comprar: ${product.name}`);
		};
	}
}

loadProduct();
