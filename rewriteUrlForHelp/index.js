/* Public domain project by Cloud Under (https://cloudunder.io).
 * Repository: https://github.com/CloudUnder/lambda-edge-nice-urls
 */

const config = {
	suffix: '/index.html',
	
};

const regexSuffixless = /\/[^/.]+$/; // e.g. "/some/page" but not "/", "/some/" or "/some.jpg"
const regexTrailingSlash = /.+\/$/; // e.g. "/some/" or "/some/page/" but not root "/"

exports.handler =  async (event, context) => {
	const { request } = event.Records[0].cf;
	const { uri } = request;
	const { suffix } = config;

	// make "index.html" as origin request if the endpoints has a trialing slash or is suffix less
	if (suffix && (uri.match(regexTrailingSlash) || uri.match(regexSuffixless))) {
	    request.uri = suffix;
	}

	// If nothing matches, return request unchanged
	return request;
};
