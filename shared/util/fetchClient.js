import { urlBase } from "./geral.js";

export default async function fetchClient(url, options) {
	const headers = {
		"Content-Type": "application/json",
		"Cache-Control": "no-cache",
		"Content-Security-Policy": "frame-ancestors 'none'",
		"Strict-Transport-Security":
			"max-age=31536000; includeSubDomains; preload",
		"X-Content-Type-Options": "nosniff",
		"X-Frame-Options": "DENY",
	};

	const res = await fetch(urlBase + url, {
		headers: {
			...headers,
			...(options?.headers || {}),
		},
		...options,
	});

	return res;
}
