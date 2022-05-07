const headerCacheControl = 'Cache-Control';
const defaultTimeToLive = 31536000;

exports.handler = async function (event) {
  const { response } = event.Records[0].cf;
  const { headers } = response;

  // ADD HSTS header (Prevents man inthe Middle attack)
  headers['strict-transport-security'] = [{
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  }];

  // Cache Control headers
  if (!headers[headerCacheControl.toLowerCase()]) {
    headers[headerCacheControl.toLowerCase()] = [{
      key: headerCacheControl,
      value: `public, max-age=${defaultTimeToLive}`,
    }];
  }

  // Add XSS protection mode block (If XSS is detected do not render the site)
  headers['x-xss-protection'] = [{
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  }];

  // WWW.BLITZBUDGET.COM
  headers['content-security-policy'] = [{
    key: 'Content-Security-Policy',
    value: "default-src https://plan.blitzbudget.com/; img-src 'unsafe-inline' 'self' data:; script-src https://cdn.jsdelivr.net 'unsafe-inline' 'self'; style-src https://use.fontawesome.com/ https://cdnjs.cloudflare.com/ https://plan.blitzbudget.com/ https://fonts.googleapis.com 'self' 'unsafe-inline'; object-src 'none'; connect-src 'self'; font-src https://cdnjs.cloudflare.com/ https://use.fontawesome.com 'self' https://fonts.gstatic.com; style-src-elem https://use.fontawesome.com/ https://cdnjs.cloudflare.com/ https://fonts.googleapis.com/ 'self' 'unsafe-inline';",
  }];

  // Prevents MIME types security risk
  headers['x-content-type-options'] = [{
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  }];

  // Prevents Clickjacking vulnerability
  headers['x-frame-options'] = [{
    key: 'X-Frame-Options',
    value: 'DENY',
  }];

  // Refered will be sent only by the origin site
  headers['referrer-policy'] = [{
    key: 'Referrer-Policy',
    value: 'same-origin',
  }];

  return response;
};
