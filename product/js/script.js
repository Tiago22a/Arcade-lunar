import fetchClient from "../../shared/util/fetchClient.js";
import { urlBaseImg } from "../../shared/util/geral.js";

const PAGE_SIZE = 5;
const REVIEWS_PER_PAGE = 3;

function getProductIdFromUrl() {
	const params = new URLSearchParams(window.location.search);
	return params.get("id");
}

function scrollReviewsToTop() {
	const reviewsSec = document.querySelector(
		"section.max-w-7xl.mx-auto.px-4.lg\\:px-8.pb-20"
	);
	if (reviewsSec) reviewsSec.scrollIntoView({ behavior: "smooth" });
}

// --- Reviews Module ---
const Reviews = {
	paged: {
		reviews: [],
		page: 1,
		total: 0,
		totalPages: 1,
	},
	all: {
		reviews: [],
		page: 1,
		totalPages: 1,
	},

	async fetchPaged(productId, selectedPage = 1, pageSize = PAGE_SIZE) {
		const res = await fetchClient(
			`/review/product/${productId}?page=${selectedPage}&pageSize=${pageSize}`,
			{
				headers: { Accept: "application/json" },
				credentials: "include",
			}
		);
		if (res.status === 401) {
			window.location.replace("/login");
			return { reviews: [] };
		}
		if (!res.ok) return { reviews: [] };
		const reviews = await res.json();
		return { reviews };
	},

	async fetchTotal(productId) {
		const res = await fetchClient(`/review/product/${productId}/quantity`, {
			headers: { Accept: "application/json" },
			credentials: "include",
		});
		if (res.status === 401) {
			window.location.replace("/login");
			return 0;
		}
		if (!res.ok) return 0;
		const total = await res.json();
		return Number(total) || 0;
	},

	async renderPaged(productId) {
		const reviewsList = document.querySelector(".space-y-6.mt-6");
		const reviewsStars = document.querySelector(
			"section.max-w-7xl.mx-auto.px-4.lg\\:px-8.pb-20 .text-yellow-400.text-lg"
		);

		const [total, { reviews }] = await Promise.all([
			this.fetchTotal(productId),
			this.fetchPaged(productId, this.paged.page, PAGE_SIZE),
		]);

		this.paged.reviews = reviews || [];
		this.paged.total = total;
		this.paged.totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

		this.renderList(reviewsList, this.paged.reviews, "username", "comment");
		this.renderPagination(this.paged, (page) => {
			this.paged.page = page;
			this.renderPaged(productId);
			scrollReviewsToTop();
		});

		if (reviewsStars) {
			const res = await fetchClient(
				`/review/product/${productId}/average`
			);
			const starsAverage = await res.json();

			for (let i = 0; i < starsAverage; i++) {
				const starImg = document.createElement("img");

				starImg.src = "../../icons/full_star.svg";

				if (starsAverage - i >= 0.5 && starsAverage - i < 1) {
					starImg.src = `../../icons/half_star.svg`;
				}
				reviewsStars.appendChild(starImg);
			}
		}
	},

	async loadAll(productId) {
		const reviewsTitle = document.querySelector(
			"section.max-w-7xl.mx-auto.px-4.lg\\:px-8.pb-20 h2"
		);
		const reviewsStars = document.querySelector(
			"section.max-w-7xl.mx-auto.px-4.lg\\:px-8.pb-20 .text-yellow-400.text-lg"
		);

		try {
			const res = await fetchClient(`/product/${productId}/reviews`, {
				headers: { Accept: "application/json" },
				credentials: "include",
			});
			if (res.status === 401) {
				window.location.replace("/login");
				return;
			}
			if (!res.ok) {
				if (reviewsTitle)
					reviewsTitle.textContent = "Reviews (Unavailable)";
				this.all.reviews = [];
			} else {
				this.all.reviews = await res.json();
			}
		} catch {
			this.all.reviews = [];
		}
		this.all.totalPages = Math.max(
			1,
			Math.ceil(this.all.reviews.length / REVIEWS_PER_PAGE)
		);
		this.all.page = 1;

		if (reviewsStars) {
		}
		this.renderAll();
	},

	renderAll() {
		const reviewsList = document.querySelector(".space-y-6.mt-6");
		if (!reviewsList) return;

		const start = (this.all.page - 1) * REVIEWS_PER_PAGE;
		const end = start + REVIEWS_PER_PAGE;
		const slice = this.all.reviews.slice(start, end);

		this.renderList(reviewsList, slice, "author", "text");
		this.renderPagination(this.all, (page) => {
			this.all.page = page;
			this.renderAll();
			scrollReviewsToTop();
		});
	},

	renderList(container, reviews, userField, textField) {
		if (!container) return;
		container.innerHTML = "";
		if (!reviews || reviews.length === 0) {
			container.innerHTML =
				'<div class="text-gray-400 text-sm">No reviews yet.</div>';
			return;
		}
		for (const review of reviews) {
			const divInner = document.createElement("div");
			divInner.className = "flex items-center gap-3";
			divInner.innerHTML = `
				<span class="bg-purple-500 text-white rounded-full px-3 py-1 text-sm font-semibold">
					${review[userField] || "Anon"}
				</span>
			`;

			let stars = document.createElement("span");
			stars.className = "text-yellow-400 text-base flex gap-1";

			for (let i = 0; i < review["rating"]; i++) {
				const starImg = document.createElement("img");
				starImg.src = "../../icons/full_star.svg";

				if (review["rating"] - i == 0.5) {
					starImg.src = `../../icons/half_star.svg`;
				}

				stars.appendChild(starImg);
			}

			divInner.appendChild(stars);

			const div = document.createElement("div");
			div.className =
				"bg-[#161522] rounded-xl p-6 flex flex-col gap-2 shadow";

			div.appendChild(divInner);

			div.innerHTML += `
				<p class="text-sm text-gray-200">
					${review[textField] || ""}
				</p>
			`;
			container.appendChild(div);
		}
	},

	renderPagination(state, onPageChange) {
		const reviewsSec = document.querySelector(
			"section.max-w-7xl.mx-auto.px-4.lg\\:px-8.pb-20"
		);
		if (!reviewsSec) return;
		let pag = document.getElementById("reviews-pagination");
		if (!pag) {
			pag = document.createElement("div");
			pag.id = "reviews-pagination";
			pag.className = "flex gap-2 justify-end items-center mt-6";
			reviewsSec.appendChild(pag);
		}
		pag.innerHTML = "";

		if (state.totalPages > 1) {
			const prev = document.createElement("button");
			prev.className =
				"px-2 py-1 text-purple-400 rounded hover:bg-[#222048] disabled:opacity-50";
			prev.disabled = state.page === 1;
			prev.textContent = "‹";
			prev.onclick = () => {
				if (state.page > 1) onPageChange(state.page - 1);
			};

			const next = document.createElement("button");
			next.className =
				"px-2 py-1 text-purple-400 rounded hover:bg-[#222048] disabled:opacity-50";
			next.disabled = state.page === state.totalPages;
			next.textContent = "›";
			next.onclick = () => {
				if (state.page < state.totalPages) onPageChange(state.page + 1);
			};

			const span = document.createElement("span");
			span.className = "text-xs text-gray-400 px-2";
			span.textContent = `Page ${state.page} of ${state.totalPages}`;

			pag.appendChild(prev);
			pag.appendChild(span);
			pag.appendChild(next);
		}
	},
};
// --- End Reviews Module ---

// --- Product Loader ---
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

	await renderProductImages(productId, product, mainImg);

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

	if (installmentsElem) {
		const installments = 6;
		const installmentValue = (finalPrice / installments).toFixed(2);
		installmentsElem.textContent = `Up to ${installments}x of ${installmentValue} with no interest`;
	}

	if (titleElem) titleElem.textContent = product.name;

	if (categoryElem)
		categoryElem.textContent = product.type?.name
			? product.type.name.charAt(0).toUpperCase() +
			  product.type.name.slice(1)
			: "";

	if (buyBtn) {
		buyBtn.onclick = () => {
			alert(`Comprar: ${product.name}`);
		};
	}

	await Reviews.renderPaged(productId); // <-- Troquei de loadAll para renderPaged
}

async function renderProductImages(productId, product, mainImg) {
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
				thumb.src = `${urlBaseImg}/products/${productId}/${
					idx + 1
				}.jpg`;
				thumb.style.display = "";
				thumb.setAttribute("data-img-idx", idx + 1);
			} else {
				thumb.style.display = "none";
			}
		});
	}

	function setMainImg(idx) {
		mainImg.src = `${urlBaseImg}/products/${productId}/${idx}.jpg`;
		mainImg.setAttribute("data-current-idx", idx);
		thumbnails.forEach((thumb) => {
			thumb.classList.toggle(
				"active",
				Number(thumb.getAttribute("data-img-idx")) === idx
			);
		});
	}
	if (miniatureQuantity > 1) {
		setMainImg(1);
	} else if (mainImg) {
		mainImg.src = `${urlBaseImg}/products/${product.id}/card.png`;
		mainImg.setAttribute("data-current-idx", "card");
	}

	thumbnails.forEach((thumb) => {
		thumb.onclick = function () {
			const idx = Number(thumb.getAttribute("data-img-idx"));
			if (idx) setMainImg(idx);
		};
	});

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
}

// --- End Product Loader ---

// Inicialização
loadProduct();
