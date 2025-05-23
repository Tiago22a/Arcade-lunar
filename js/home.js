import fetchClient from "/shared/util/fetchClient.js";
import { urlBaseImg } from "/shared/util/geral.js";

const PAGE_SIZE = 10; // Número de produtos por página

const paginationDiv = document.getElementById("paginationDiv");

const cartDiv = document.getElementById("cartDiv");
cartDiv.addEventListener("click", () => window.location.replace("/cart"));

async function loadProductsByType(typeId, page = 1) {
	const grid = document.getElementById("productGrid");
	if (!grid) return;

	paginationDiv.innerHTML = ""; // Limpa a paginação existente

	// Mostra spinner enquanto carrega produtos
	grid.innerHTML = `
		<div style="grid-column: 1/-1; display: flex; justify-content: center; align-items: center; min-height: 120px;">
			<span class="spinner" style="margin-right:10px;"></span>
			<span style="color:#a78bfa;font-weight:500;">Loading products...</span>
		</div>
	`;

	// Busca quantidade total de produtos para paginação
	const quantityRes = await fetchClient(`/product/type/${typeId}/quantity`, {
		credentials: "include",
		headers: { Accept: "application/json" },
	});
	if (quantityRes.status === 401) {
		window.location.replace("/login");
		return;
	}
	let total = 0;
	if (quantityRes.ok) {
		const data = await quantityRes.json();
		total = typeof data === "number" ? data : data?.quantity ?? 0;
	}

	// Busca produtos da página atual
	const res = await fetchClient(
		`/product/type/${typeId}?page=${page}&pageSize=${PAGE_SIZE}`,
		{
			credentials: "include",
			headers: { Accept: "application/json" },
		}
	);
	if (res.status === 401) {
		window.location.replace("/login");
		return;
	}
	if (!res.ok) {
		grid.innerHTML = `<span style="color:#e53e3e;">Failed to load products</span>`;
		return;
	}
	const products = await res.json();

	grid.innerHTML = "";

	if (!products || !products.length) {
		grid.innerHTML = `
			<div style="grid-column: 1/-1; display: flex; justify-content: center; align-items: center; min-height: 120px;">
				<span style="color:#a78bfa; font-size:1.1em;">No products found for this category.</span>
			</div>
		`;
		renderPagination(typeId, total, page);
		return;
	}

	products.forEach((product) => {
		const article = document.createElement("article");
		article.className =
			"bg-[#1a1a1a] rounded-xl flex flex-col justify-between transition-transform duration-300 hover:scale-110";

		article.setAttribute("data-product-id", product.id);
		article.setAttribute("data-product-name", product.name);
		article.setAttribute("data-product-price", product.price);
		article.setAttribute("data-product-discount", product.discount ?? "");

		let priceHtml;
		if (product.discount) {
			const finalPrice = (
				product.price -
				(product.discount / 100) * product.price
			).toFixed(2);
			priceHtml = `
		<div class="flex flex-wrap gap-2 font-bold min-h-[60px] items-center">
			<span class="text-purple-400">R$ ${finalPrice}</span>
			<span class="line-through text-gray-400">R$ ${product.price.toFixed(2)}</span>
		</div>
	`;
		} else {
			priceHtml = `<div class="min-h-[60px] font-bold flex items-center">R$ ${product.price.toFixed(
				2
			)}</div>`;
		}

		article.innerHTML = `
			<div class="flex-1 flex items-center justify-center p-6 relative">
				<figure style="position: relative; width: 100%;">
					${
						product.discount
							? `
					<div style="
						position: absolute;
						top: 0;
						right: 0;
						background: #22c55e;
						color: #fff;
						font-weight: bold;
						font-size: 1rem;
						padding: 4px 12px;
						border-radius: 999px;
						box-shadow: 0 2px 8px rgba(34,197,94,0.18);
						z-index: 2;
						letter-spacing: 0.5px;
					">
						-${product.discount.toFixed(0)}%
					</div>
				`
							: ""
					}
					<img 
						src="${urlBaseImg}/products/${product.id}/card.png" 
						alt="${product.name}" 
						style="width:100%;height:250px;object-fit:cover;object-position:center;display:block;border-radius:10px;"
						loading="lazy"/>
				</figure>
			</div>
			<div class="p-6">
				<h3 class="font-semibold text-md">${product.name}</h3>
				<p class="font-bold text-sm mt-2">
					${priceHtml}
				</p>
				<button
					class="w-full mt-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 transition selling-now-btn"
					data-product-id="${product.id}">
					Selling now
				</button>
			</div>
		`;
		grid.appendChild(article);
	});

	// Adiciona event listener para todos os botões Selling now
	const sellingBtns = grid.querySelectorAll(".selling-now-btn");
	sellingBtns.forEach((btn) => {
		btn.addEventListener("click", (e) => {
			const productId = btn.getAttribute("data-product-id");
			window.location.replace(`product/?id=${productId}`);
		});
	});

	renderPagination(typeId, total, page);
}

function renderPagination(typeId, total, currentPage) {
	const grid = document.getElementById("productGrid");
	const totalPages = Math.ceil(total / PAGE_SIZE);
	if (totalPages <= 1) return;

	paginationDiv.innerHTML = ""; // Limpa a paginação existente

	for (let i = 1; i <= totalPages; i++) {
		const btn = document.createElement("button");
		btn.className =
			"page w-8 h-8 rounded-full " +
			(i === currentPage
				? "bg-purple-600 text-white"
				: "bg-gray-700 hover:bg-purple-600 text-white");
		btn.textContent = i;
		btn.addEventListener("click", () => {
			loadProductsByType(typeId, i);
			window.scrollTo({ top: 0, behavior: "smooth" });
		});
		paginationDiv.appendChild(btn);
	}
}

async function loadCategories() {
	const tabsContainer = document.getElementById("categoryTabs");
	if (!tabsContainer) return;

	// Mostra spinner enquanto carrega
	tabsContainer.innerHTML = `
		<div id="category-spinner" style="display:flex;align-items:center;justify-content:center;height:40px;">
			<span class="spinner" style="margin-right:10px;"></span>
			<span style="color:#a78bfa;font-weight:500;">Loading categories...</span>
		</div>
	`;

	const res = await fetchClient("/product-type", {
		headers: {
			Accept: "application/json",
		},
		credentials: "include",
	});
	if (res.status === 401) {
		window.location.replace("/login");
		return;
	}
	if (!res.ok) {
		tabsContainer.innerHTML = `<span style="color:#e53e3e;">Failed to load categories</span>`;
		return;
	}
	const categories = await res.json();

	// Limpa spinner
	tabsContainer.innerHTML = "";

	categories.forEach((cat, idx) => {
		const btn = document.createElement("button");
		btn.setAttribute("productTypeId", cat.id);
		btn.className = "tab" + (idx === 0 ? " active text-purple-400" : "");
		const label = (cat.name || cat.title || cat).toString();
		btn.textContent = label.charAt(0).toUpperCase() + label.slice(1);
		tabsContainer.appendChild(btn);
	});

	// Adiciona event listeners para navegação de categoria
	const tabBtns = tabsContainer.querySelectorAll(".tab");
	tabBtns.forEach((tab, idx) => {
		tab.addEventListener("click", () => {
			tabBtns.forEach((t) =>
				t.classList.remove("text-purple-400", "active")
			);
			tab.classList.add("text-purple-400", "active");
			const typeId = tab.getAttribute("productTypeId");
			loadProductsByType(typeId, 1);
		});
	});

	// Carrega produtos da primeira categoria por padrão
	if (categories.length > 0) {
		loadProductsByType(categories[0].id, 1);
	}
}

// Chama ao carregar a página
loadCategories();

// Spinner CSS (adicione ao seu CSS global se ainda não tiver)
if (!document.getElementById("global-spinner-style")) {
	const style = document.createElement("style");
	style.id = "global-spinner-style";
	style.innerHTML = `
	.spinner {
		display: inline-block;
		width: 22px;
		height: 22px;
		border: 3px solid #ddd;
		border-top: 3px solid #a78bfa;
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
	}
	@keyframes spin {
		0% { transform: rotate(0deg);}
		100% { transform: rotate(360deg);}
	}
	`;
	document.head.appendChild(style);
}
