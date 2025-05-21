import fetchClient from "../../shared/util/fetchClient.js";

const verifyEmailButton = document.getElementById("verifyEmailButton");

verifyEmailButton.addEventListener("click", async function () {
	const searchParams = new URLSearchParams(window.location.search);
	const token = searchParams.get("token");
	const userId = searchParams.get("userId");
	const res = await fetchClient(
		`/auth/verify-email?token=${token}&userId=${userId}`
	);

	if (res.status == 404 || res.status == 400 || res.status == 409) {
		window.location.replace(
			"/verify-email/token-expired.html?userId=" + userId
		);
		return;
	}

	window.location.replace("/verify-email/email-verifed.html");
});
