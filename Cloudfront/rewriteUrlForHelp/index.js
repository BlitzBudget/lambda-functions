/* Public domain project by Cloud Under (https://cloudunder.io).
 * Repository: https://github.com/CloudUnder/lambda-edge-nice-urls
 */

const config = {
  suffix: '/index.html',
};

const regexSuffixless = /\/[^/.]+$/; // e.g. "/some/page" but not "/", "/some/" or "/some.jpg"
const regexTrailingSlash = /.+\/$/; // e.g. "/some/" or "/some/page/" but not root "/"
const imgPath = '/img/';
const jsPath = '/js/';
const cssPath = '/css/';

exports.handler = async (event) => {
  const { request } = event.Records[0].cf;
  const { uri } = request;
  const { suffix } = config;

  // make "index.html" as origin request if the endpoints has a trialing slash or is suffix
  if (suffix && (uri.match(regexTrailingSlash) || uri.match(regexSuffixless))) {
    request.uri = suffix;
  }

  if (uri.includes(imgPath)) {
    const uriArray = uri.split(imgPath);
    request.uri = imgPath + uriArray[1];
  } else if (uri.includes(jsPath)) {
    const uriArray = uri.split(jsPath);
    request.uri = jsPath + uriArray[1];
  } else if (uri.includes(cssPath)) {
    const uriArray = uri.split(cssPath);
    request.uri = cssPath + uriArray[1];
  }

  // If nothing matches, return request unchanged
  return request;
};
