function httpGet(api) {
	const headers = new window.Headers();
	headers.append('AuthToken', 'XV1OPVkgaohpSpeQ8w0ZQg6CuqD2dRxd');
	return fetch(api, { headers })
		.then((res) => res.json());
}

function httpPost(api, data) {
	const headers = new window.Headers();
	headers.append('AuthToken', 'XV1OPVkgaohpSpeQ8w0ZQg6CuqD2dRxd');
	return fetch(api, { method: 'POST', headers, body: data })
		.then((res) => res.json());
}

export default { httpGet, httpPost };
