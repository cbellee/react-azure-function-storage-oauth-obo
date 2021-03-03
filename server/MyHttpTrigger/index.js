const express = require('express');
const passport = require('passport');
const fetch = require('node-fetch');
const auth = require('../auth.json');
const http = require('http');
const https = require('https');

const DOMParser = require('xmldom').DOMParser;

const createHandler = require('azure-function-express').createHandler;
const BearerStrategy = require('passport-azure-ad').BearerStrategy;
const { response } = require('express');

const options = {
	identityMetadata: `https://${auth.authority}/${auth.tenantID}/${auth.version}/${auth.discovery}`,
	issuer: `https://${auth.authority}/${auth.tenantID}/${auth.version}`,
	clientID: auth.clientID,
	validateIssuer: auth.validateIssuer,
	audience: auth.audience,
	loggingLevel: auth.loggingLevel,
	passReqToCallback: auth.passReqToCallback,
};

const bearerStrategy = new BearerStrategy(options, (token, done) => {
	done(null, {}, token);
});

const app = express();

app.use(require('morgan')('combined'));
app.use(require('body-parser').urlencoded({ 'extended': true }));
app.use(passport.initialize());
passport.use(bearerStrategy);

// Enable CORS (for local testing only -remove in production/deployment)
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
	next();
});

// get blob from storage container
app.get('/api/download', passport.authenticate('oauth-bearer', { session: false }),
	async (req, res) => {
		const { container, blob } = req.query;
		console.log('container: ', container, 'blob: ', blob);
		console.log('Validated claims: ', JSON.stringify(req.authInfo));

		// the access token the user originally sent to the API
		const userToken = req.get('authorization');

		// request a new token and use it to call resource API on user's behalf
		let tokenObj = await getAccessToken(userToken);
		let accessToken = tokenObj['access_token'];

		let options = {
			method: 'GET',
			host: `${auth.storageAccountName}.blob.core.windows.net`,
			path: `/${container}/${blob}`,
			port: 443,
			headers: {
				'Authorization': `Bearer ${accessToken}`,
				'x-ms-version': '2017-11-09'
			}
		};

		console.log('options: ', options);

		callback = function (response) {
			var data = [];
			console.log(`statusCode: ${response.statusCode}`)

			response.on('data', function (chunk) {
				data.push(chunk);
			});

			response.on('end', function () {
				data = Buffer.concat(data);
				console.log('requested content length: ', response.headers['content-length']);
				console.log('parsed content length: ', data.length);
				res.writeHead(200, {
					'Content-Type': 'application/octet-stream',
					'Content-Disposition': `attachment; filename=${blob}`
					//'Content-Length': data.length doesn't work & returns a content length mismatch error...?
				});
				res.end(data);
			});
		}

		var request = https.request(options, callback);
		request.flushHeaders();
		request.end();
	});

// list blobs in storage account container
app.get('/api/list', passport.authenticate('oauth-bearer', { session: false }),
	async (req, res) => {
		// access http query string parameters
		const { container } = req.query;
		console.log('container: ', container);
		const userToken = req.get('authorization');

		// get access token on behalf of the calling user
		let tokenObj = await getAccessToken(userToken);

		// get list of blobs in container
		await listBlobs(tokenObj['access_token'], auth.storageAccountName, container)
			.then(str => new DOMParser().parseFromString(str, "text/xml"))
			.then(xml => {
				let blobList = Array.from(xml.getElementsByTagName('Blob'));
				var arr = [];
				var i = 0;
				blobList.forEach(async blob => {
					arr.push({
						id: i++,
						name: blob.childNodes[0].textContent,
						container: container,
						uri: `${container}/${blob.childNodes[0].textContent}`,
						publicUri: `https://${auth.storageAccountName}.blob.core.windows.net/${container}/${blob.childNodes[0].textContent}`
					});
				})
				console.log(JSON.stringify(arr));
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify(arr));
			});
	}
)

// post blob to storage account container
app.post('/api/upload', passport.authenticate('oauth-bearer', { session: false }),
	async (req, res) => {
		const { container, blob } = req.query;
		console.log('container: ', container, 'blob: ', blob);
		console.log('Validated claims: ', JSON.stringify(req.authInfo));

		// the access token the user sent
		const userToken = req.get('authorization');

		// request new token and use it to call resource API on user's behalf
		let tokenObj = await getAccessToken(userToken);

		await createBlob(tokenObj['access_token'], auth.storageAccountName, container, blob)
			.then(data => { data.pipe(writableStream) })
			.then(res.status(200));
	}
);

// get blob from storage account container
async function getBlob(accessToken, storageAccountName, containerName, blobName) {
	let myHeaders = new fetch.Headers();
	myHeaders.append('Authorization', 'Bearer ' + accessToken);
	myHeaders.append('x-ms-version', '2017-11-09');

	let url = `https://${storageAccountName}.blob.core.windows.net/${containerName}/${blobName}`

	let options = {
		method: 'GET',
		headers: myHeaders
	};
}

// list blobs in storage account container
async function listBlobs(accessToken, storageAccountName, containerName) {
	let myHeaders = new fetch.Headers();
	myHeaders.append('Authorization', 'Bearer ' + accessToken);
	myHeaders.append('x-ms-version', '2017-11-09');

	let url = `https://${storageAccountName}.blob.core.windows.net/${containerName}?restype=container&comp=list`;

	let options = {
		method: 'GET',
		headers: myHeaders
	};

	return fetch(url, options)
		.then(handleErrors)
		.then(res => res.text())
		.catch(error => console.log(error));
}

// create blob in storage account container
async function createBlob(accessToken, storageAccountName, containerName, blobName) {
	let myHeaders = new fetch.Headers();
	myHeaders.append('Authorization', 'Bearer ' + accessToken);
	myHeaders.append('x-ms-version', '2017-11-09');

	let url = `https://${storageAccountName}.blob.core.windows.net/${containerName}/${blobName}`

	let options = {
		method: 'POST',
		headers: myHeaders
	};

	let response = await fetch(url, options)
		.then(handleErrors)
		.then(res => res.body)
		.catch(error => console.log(error));
	let json = response.json();
	return json;
}

// get azure storage access token on behalf of user
async function getAccessToken(userToken) {

	const [bearer, tokenValue] = userToken.split(' ');
	const tokenEndpoint = `https://${auth.authority}/${auth.tenantName}/oauth2/${auth.version}/token`;

	let myHeaders = new fetch.Headers();
	myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

	let urlencoded = new URLSearchParams();
	urlencoded.append('grant_type', 'urn:ietf:params:oauth:grant-type:jwt-bearer');
	urlencoded.append('client_id', auth.clientID);
	urlencoded.append('client_secret', auth.clientSecret);
	urlencoded.append('assertion', tokenValue);
	urlencoded.append('scope', ...auth.resourceScope);
	urlencoded.append('requested_token_use', 'on_behalf_of');

	let options = {
		method: 'POST',
		headers: myHeaders,
		body: urlencoded,
		redirect: 'follow'
	};

	try {
		let response = await fetch(tokenEndpoint, options);
		let json = response.json();
		return json;
	} catch (err) {
		console.log('error occurred: ', err)
	}
}

// error handler function
function handleErrors(res) {
	if (!res.ok) {
		throw Error(res.statusText);
	}
	return res;
}

module.exports = createHandler(app);
