import fetchClient from "../../shared/util/fetchClient.js";

// Estado centralizado do formulário
const state = {
	form: {
		invalid: true,
		dirty: false,
		submitted: false,
	},
	name: {
		value: "",
		errors: [
			{
				id: "required",
				validator: required,
				isActive: false,
				message: "Name is required",
			},
			{
				id: "minLength",
				validator: (v) => v.length < 3,
				isActive: false,
				message: "Name must be at least 3 characters",
			},
		],
		invalid: true,
	},
	email: {
		value: "",
		errors: [
			{
				id: "required",
				validator: required,
				isActive: false,
				message: "Email is required",
			},
			{
				id: "invalidEmail",
				validator: invalidEmail,
				isActive: false,
				message: "Invalid email",
			},
			{
				id: "emailAlreadyExists",
				validator: () => false,
				isActive: false,
				message: "This email is already registered",
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
				message: "Password is required",
			},
			{
				id: "passwordStrength",
				validator: passwordStrength,
				isActive: false,
				message:
					"1. At least 8 characters.<br>2. One uppercase letter.<br>3. One number.<br>4. One special character.",
			},
		],
		invalid: true,
	},
	confirmPassword: {
		value: "",
		errors: [
			{
				id: "required",
				validator: required,
				isActive: false,
				message: "Password confirmation is required",
			},
			{
				id: "passwordMatch",
				validator: (v) => v !== state.password.value,
				isActive: false,
				message: "Passwords do not match",
			},
		],
		invalid: true,
	},
};

const form = document.getElementById("signup-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");

// Helpers compactos
const updateFormInvalid = (obj) =>
	(obj.form.invalid = Object.keys(obj).some(
		(k) => k !== "form" && obj[k].invalid
	));

const updateFieldInvalid = (error, fieldObj) =>
	(fieldObj.invalid = !!error.isActive);

const validateFieldErrors = (errors, value, fieldName, obj, passwordValue) => {
	errors.forEach((error) => {
		error.isActive =
			error.id === "passwordMatch"
				? error.validator(value, passwordValue)
				: error.validator(value);
		updateFieldInvalid(error, obj[fieldName]);
	});
	updateFormInvalid(obj);
};

const validatePasswordMatch = (confirmObj, passwordValue, obj) => {
	const err = confirmObj.errors.find((e) => e.id === "passwordMatch");
	err.isActive = err.validator(confirmObj.value, passwordValue);
	updateFieldInvalid(err, confirmObj);
	updateFormInvalid(obj);
};

const handleFormAPIStatus = (obj, status) => {
	if (status === 200) return (obj.form.submitted = true);
	if (status === 409) {
		const err = obj.email.errors.find((e) => e.id === "emailAlreadyExists");
		err.isActive = true;
		updateFieldInvalid(err, obj.email);
		updateFormInvalid(obj);
		return;
	}
	if (status === 422) {
		const err = obj.password.errors.find(
			(e) => e.id === "passwordStrength"
		);
		err.isActive = true;
		updateFieldInvalid(err, obj.password);
		updateFormInvalid(obj);
	}
};

let isLoading = false;

function setLoading(loading) {
	isLoading = loading;
	const btn = document.querySelector("#signup-form button[type='submit']");
	if (btn) {
		btn.disabled = loading;
		btn.innerHTML = loading
			? '<span class="spinner" style="margin-right:8px;"></span>Sending...'
			: "Sign Up";
	}
}

// Atualiza valor e valida campo
function handleInput(field, value) {
	state[field].value = value;
	state.form.dirty = true;
	validateFieldErrors(
		state[field].errors,
		value,
		field,
		state,
		field === "confirmPassword" ? state.password.value : undefined
	);
	if (field === "password") {
		validatePasswordMatch(state.confirmPassword, value, state);
		renderErrors("confirmPassword");
	}
	renderErrors(field);
}

nameInput.addEventListener("input", (e) => handleInput("name", e.target.value));
emailInput.addEventListener("input", (e) => {
	handleInput("email", e.target.value);
	const err = state.email.errors.find((e) => e.id === "emailAlreadyExists");
	if (err) err.isActive = false;
	renderErrors("email");
	updateFormInvalid(state);
});
passwordInput.addEventListener("input", (e) =>
	handleInput("password", e.target.value)
);
confirmPasswordInput.addEventListener("input", (e) =>
	handleInput("confirmPassword", e.target.value)
);

form.addEventListener("submit", async function (event) {
	event.preventDefault();
	["name", "email", "password", "confirmPassword"].forEach((field) => {
		validateFieldErrors(
			state[field].errors,
			state[field].value,
			field,
			state,
			field === "confirmPassword" ? state.password.value : undefined
		);
		renderErrors(field);
	});
	updateFormInvalid(state);

	if (state.form.invalid || !state.form.dirty) return;

	setLoading(true);

	const formData = {
		name: state.name.value.trim(),
		email: state.email.value.trim(),
		password: state.password.value.trim(),
	};

	const res = await fetchClient("/auth/register", {
		method: "POST",
		body: JSON.stringify(formData),
	});

	handleFormAPIStatus(state, res.status);
	renderErrors("email");
	renderErrors("password");
	updateFormInvalid(state);

	setLoading(false);

	if (state.form.submitted) showPopup();
});

document
	.querySelector("#closePopupBtn")
	.addEventListener("click", () => window.location.replace("/login"));

// Validação de campo
function validateField(field) {
	let invalid = false;
	state[field].errors.forEach((err) => {
		const active = err.validator(state[field].value);
		err.isActive = !!active;
		if (active) invalid = true;
	});
	state[field].invalid = invalid;
}

// Validação de todos os campos
function validateAllFields() {
	validateField("name");
	renderErrors("name");
	validateField("email");
	renderErrors("email");
	validateField("password");
	renderErrors("password");
	validateField("confirmPassword");
	renderErrors("confirmPassword");
	validateForm();
}

// Validação do formulário
function validateForm() {
	state.form.invalid =
		state.name.invalid ||
		state.email.invalid ||
		state.password.invalid ||
		state.confirmPassword.invalid;
}

// Renderiza erros do campo
function renderErrors(field) {
	const input = document.getElementById(field);
	removeError(field);
	const activeErrors = state[field].errors.filter((e) => e.isActive);
	if (activeErrors.length > 0) {
		input.classList.add("input-error");
		let errorElem = document.getElementById(field + "-error");
		if (!errorElem) {
			errorElem = document.createElement("div");
			errorElem.id = field + "-error";
			errorElem.className = "error-message";
			input.parentNode.insertBefore(errorElem, input.nextSibling);
		}
		// Mostra apenas o primeiro erro ativo
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

// Funções de validação
function required(value) {
	return !value || value.trim() === "";
}
function invalidEmail(value) {
	return value && !validateEmail(value);
}
function passwordStrength(value) {
	return !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value);
}

function showPopup() {
	document.getElementById("confirmationPopup").classList.remove("hidden");
}
function closePopup() {
	document.getElementById("confirmationPopup").classList.add("hidden");
}

// Inicializa valores se já preenchidos (ex: autocomplete)
["name", "email", "password", "confirmPassword"].forEach((field) => {
	const input = document.getElementById(field);
	if (input.value) {
		state[field].value = input.value;
		validateFieldErrors(
			state[field].errors,
			input.value,
			field,
			state,
			field === "confirmPassword" ? state.password.value : undefined
		);
		renderErrors(field);
	}
});
updateFormInvalid(state);
