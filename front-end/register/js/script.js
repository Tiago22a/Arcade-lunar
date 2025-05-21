const form = document.getElementById("signup-form");

form.addEventListener("submit", function (event) {
	event.preventDefault(); // impede envio real

	const name = document.getElementById("name").value.trim();
	const email = document.getElementById("email").value.trim();
	const password = document.getElementById("password").value.trim();

	if (!name || !email || !password) {
		alert("Please fill in all required fields before signing up.");
		return;
	}

	// Falta a requisição real para o banco de dados

	// poup up de confirmação de email
	showPopup();
});

function showPopup() {
	document.getElementById("confirmationPopup").classList.remove("hidden");
}

function closePopup() {
	document.getElementById("confirmationPopup").classList.add("hidden");
}
