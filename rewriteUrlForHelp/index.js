/* Public domain project by Cloud Under (https://cloudunder.io).
 * Repository: https://github.com/CloudUnder/lambda-edge-nice-urls
 */

const config = {
	suffix: '/index.html',
	
};

exports.handler =  async (event, context) => {
	const { request } = event.Records[0].cf;
	const { uri } = request;
	const { suffix } = config;

	// make "index.html" as origin request
	if (suffix) {
	    request.uri = suffix;
	}

	// If nothing matches, return request unchanged
	return request;
};
