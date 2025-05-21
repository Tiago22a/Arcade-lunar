const form = document.getElementById("signup-form");

form.addEventListener("submit", function (event) {
	const name = document.getElementById("name").value.trim();
	const email = document.getElementById("email").value.trim();
	const password = document.getElementById("password").value.trim();

	if (!name || !email || !password) {
		alert("Please fill in all required fields before signing up.");
		event.preventDefault();
	}
});
