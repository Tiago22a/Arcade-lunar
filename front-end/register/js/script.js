const form = document.getElementById("signup-form");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");

// Track if the user has typed in each input (dirty)
const dirty = {
	name: false,
	email: false,
	password: false,
	confirmPassword: false,
};

// Real-time validation
nameInput.addEventListener("input", () => {
	dirty.name = true;
	validateField("name", true);
});
emailInput.addEventListener("input", () => {
	dirty.email = true;
	validateField("email", true);
});
passwordInput.addEventListener("input", () => {
	dirty.password = true;
	validateField("password", true);
	validateField("confirmPassword", dirty.confirmPassword);
});
confirmPasswordInput.addEventListener("input", () => {
	dirty.confirmPassword = true;
	validateField("confirmPassword", true);
});

form.addEventListener("submit", function (event) {
	// Prevent submit if at least one field is not dirty (user hasn't typed in all inputs)
	if (
		!dirty.name ||
		!dirty.email ||
		!dirty.password ||
		!dirty.confirmPassword
	) {
		event.preventDefault();
		return;
	}

	event.preventDefault();

	let hasError = false;
	if (!validateField("name", true)) hasError = true;
	if (!validateField("email", true)) hasError = true;
	if (!validateField("password", true)) hasError = true;
	if (!validateField("confirmPassword", true)) hasError = true;

	if (hasError) return;

	// TODO: Implement real request to the database

	showPopup();
});

function validateField(field, showErrorIfDirty = false) {
	let value = "";
	let valid = true;
	let show = showErrorIfDirty && dirty[field];
	switch (field) {
		case "name":
			value = nameInput.value.trim();
			if ((!value || value.length < 3) && show) {
				if (!value) showError("name", "Full name is required.");
				else showError("name", "Name must be at least 3 characters.");
				valid = false;
			} else {
				removeError("name");
			}
			break;
		case "email":
			value = emailInput.value.trim();
			if ((!value || !validateEmail(value)) && show) {
				if (!value) showError("email", "Email is required.");
				else showError("email", "Please enter a valid email address.");
				valid = false;
			} else {
				removeError("email");
			}
			break;
		case "password":
			value = passwordInput.value.trim();
			const passwordErrors = [];
			if (!value) {
				passwordErrors.push("Password is required.");
			} else {
				if (value.length < 8)
					passwordErrors.push("At least 8 characters.");
				if (!/[A-Z]/.test(value))
					passwordErrors.push("At least one uppercase letter.");
				if (!/[a-z]/.test(value))
					passwordErrors.push("At least one lowercase letter.");
				if (!/\d/.test(value))
					passwordErrors.push("At least one number.");
				if (!/[\W_]/.test(value))
					passwordErrors.push("At least one special character.");
			}
			if (passwordErrors.length > 0 && show) {
				showError(
					"password",
					passwordErrors.map((e) => `<div>${e}</div>`).join("")
				);
				valid = false;
			} else if (passwordErrors.length === 0) {
				removeError("password");
			} else if (!show) {
				removeError("password");
			}
			break;
		case "confirmPassword":
			const passwordVal = passwordInput.value.trim();
			value = confirmPasswordInput.value.trim();
			if ((!value || value !== passwordVal) && show) {
				if (!value)
					showError(
						"confirmPassword",
						"Please confirm your password."
					);
				else showError("confirmPassword", "Passwords do not match.");
				valid = false;
			} else {
				removeError("confirmPassword");
			}
			break;
	}
	return valid;
}

function showError(inputId, message) {
	const input = document.getElementById(inputId);
	input.classList.add("input-error");
	let errorElem = document.getElementById(inputId + "-error");
	if (!errorElem) {
		errorElem = document.createElement("div");
		errorElem.id = inputId + "-error";
		errorElem.className = "error-message";
		input.parentNode.insertBefore(errorElem, input.nextSibling);
	}
	errorElem.innerHTML = message;
}

function removeError(inputId) {
	const input = document.getElementById(inputId);
	input.classList.remove("input-error");
	const errorElem = document.getElementById(inputId + "-error");
	if (errorElem) errorElem.remove();
}

function clearErrors() {
	["name", "email", "password", "confirmPassword"].forEach(removeError);
}

function validateEmail(email) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showPopup() {
	document.getElementById("confirmationPopup").classList.remove("hidden");
}

function closePopup() {
	document.getElementById("confirmationPopup").classList.add("hidden");
}

function validateStrongPassword(password) {
	return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
}
