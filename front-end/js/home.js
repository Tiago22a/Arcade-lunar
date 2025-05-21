const tabs = document.querySelectorAll(".tab");
tabs.forEach((tab) => {
	tab.addEventListener("click", () => {
		tabs.forEach((t) => t.classList.remove("text-purple-400"));
		tab.classList.add("text-purple-400");
	});
});
