import { loginRequest, apiConfig } from "../authConfig";
import { msalInstance } from "../index";
const fs = require('fs')

export async function callListBlobApi(endpoint) {
	const account = msalInstance.getActiveAccount();
	if (!account) {
		throw Error("No active account! Verify a user has been signed in and setActiveAccount has been called.");
	}

	const response = await msalInstance.acquireTokenSilent({
		...loginRequest,
		account: account
	});

	const headers = new Headers();
	const bearer = `Bearer ${response.accessToken}`;

	headers.append("Authorization", bearer);

	const options = {
		method: "GET",
		headers: headers
	};

	return fetch(endpoint, options)
		.then(response => response.json())
		.catch(error => console.log(error));
}

export async function callGetBloblApi(endpoint, blobName) {
	const account = msalInstance.getActiveAccount();
	if (!account) {
		throw Error("No active account! Verify a user has been signed in and setActiveAccount has been called.");
	}

	const response = await msalInstance.acquireTokenSilent({
		...loginRequest,
		account: account
	});

	const headers = new Headers();
	const bearer = `Bearer ${response.accessToken}`;

	headers.append("Authorization", bearer);

	const options = {
		method: "GET",
		headers: headers
	};

	//var url = `${endpoint}/download?container=${containerName}&blob=${blobName}`

	fetch(endpoint, options)
		.then(response => {
			response.blob().then(blob => {
				let url = window.URL.createObjectURL(blob);
				let a = document.createElement('a');
				a.href = url;
				a.download = blobName;
				a.click();
			});
		})
}
