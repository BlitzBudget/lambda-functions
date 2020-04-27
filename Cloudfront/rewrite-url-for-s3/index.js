/* Public domain project by Cloud Under (https://cloudunder.io).
 * Repository: https://github.com/CloudUnder/lambda-edge-nice-urls
 */

const config = {
	suffix: '.html',
	removeHTMLExtenstion: true,
	removeTrailingSlash: true,
};

const regexSuffixless = /\/[^/.]+$/; // e.g. "/some/page" but not "/", "/some/" or "/some.jpg"
const regexTrailingSlash = /.+\/$/; // e.g. "/some/" or "/some/page/" but not root "/"

exports.handler =  async function(event, context) {
	const { request } = event.Records[0].cf;
	const { uri } = request;
	const { suffix, removeTrailingSlash } = config;

	// Append ".html" to origin request
	if (suffix && uri.match(regexSuffixless)) {
		request.uri = uri + suffix;
		return request;
	}
	
	// Append ".html" to origin request with trailing slash
	if (removeTrailingSlash && uri.match(regexTrailingSlash)) {
		request.uri = uri.slice(0, -1) + suffix;
		return request;
	}

	// If nothing matches, return request unchanged
	return request;
};