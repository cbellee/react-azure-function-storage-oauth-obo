import { loginRequest } from "../authConfig";
import { msalInstance } from "../index";
const fs = require('fs')

// list blobs in container
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

// get blob
export async function callGetBlobApi(endpoint, blobName) {
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

// query SQL database
export async function callQueryAzureDbApi(endpoint) {
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

// insert into SQL database
export async function callInsertAzureDbApi(endpoint, inputData) {
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
	headers.append('Content-Type', 'application/json');

	const options = {
		method: "POST",
		headers: headers,
		body: JSON.stringify(inputData)
	};

	return fetch(endpoint, options)
		.then(response => response.json())
		.catch(error => console.log(error));
}
