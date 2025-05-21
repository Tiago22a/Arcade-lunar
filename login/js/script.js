// Estado centralizado para login
const loginState = {
	form: {
		invalid: true,
		dirty: false,
		submitted: false,
	},
	email: {
		value: "",
		errors: [
			{
				id: "required",
				validator: required,
				isActive: false,
				message: "Email é obrigatório",
			},
			{
				id: "invalidEmail",
				validator: invalidEmail,
				isActive: false,
				message: "Email inválido",
			},
		],
		invalid: true,
	},
	password: {
		value: "",
		errors: [
			{
				id: "required",
				validator: required,
				isActive: false,
				message: "Senha é obrigatória",
			},
		],
		invalid: true,
	},
};

const form = document.getElementById("signup-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const updateFormInvalid = (obj) =>
	(obj.form.invalid = Object.keys(obj).some(k => k !== "form" && obj[k].invalid));

const updateFieldInvalid = (error, fieldObj) =>
	(fieldObj.invalid = !!error.isActive);

const validateFieldErrors = (errors, value, fieldName, obj) => {
	errors.forEach(error => {
		error.isActive = error.validator(value);
		updateFieldInvalid(error, obj[fieldName]);
	});
	updateFormInvalid(obj);
};

function handleInput(field, value) {
	loginState[field].value = value;
	loginState.form.dirty = true;
	validateFieldErrors(
		loginState[field].errors,
		value,
		field,
		loginState
	);
	renderErrors(field);
}

emailInput.addEventListener("input", (e) => handleInput("email", e.target.value));
passwordInput.addEventListener("input", (e) => handleInput("password", e.target.value));

form.addEventListener("submit", function (event) {
	event.preventDefault();
	["email", "password"].forEach(field => {
		validateFieldErrors(
			loginState[field].errors,
			loginState[field].value,
			field,
			loginState
		);
		renderErrors(field);
	});
	updateFormInvalid(loginState);

	if (loginState.form.invalid || !loginState.form.dirty) return;

	// Aqui você pode fazer a requisição de login normalmente
	form.submit();
});

// Renderiza erros do campo
function renderErrors(field) {
	const input = document.getElementById(field);
	removeError(field);
	const activeErrors = loginState[field].errors.filter((e) => e.isActive);
	if (activeErrors.length > 0) {
		input.classList.add("input-error");
		let errorElem = document.getElementById(field + "-error");
		if (!errorElem) {
			errorElem = document.createElement("div");
			errorElem.id = field + "-error";
			errorElem.className = "error-message";
			input.parentNode.insertBefore(errorElem, input.nextSibling);
		}
		errorElem.innerHTML = `<div>${activeErrors[0].message}</div>`;
	} else {
		input.classList.remove("input-error");
		removeError(field);
	}
}

function removeError(field) {
	const input = document.getElementById(field);
	input.classList.remove("input-error");
	const errorElem = document.getElementById(field + "-error");
	if (errorElem) errorElem.remove();
}

function validateEmail(email) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function required(value) {
	return !value || value.trim() === "";
}
function invalidEmail(value) {
	return value && !validateEmail(value);
}

// Inicializa valores se já preenchidos (ex: autocomplete)
["email", "password"].forEach(field => {
	const input = document.getElementById(field);
	if (input.value) {
		loginState[field].value = input.value;
		validateFieldErrors(
			loginState[field].errors,
			input.value,
			field,
			loginState
		);
		renderErrors(field);
	}
});
updateFormInvalid(loginState);
