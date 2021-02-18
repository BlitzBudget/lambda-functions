const headerCacheControl = 'Cache-Control';
const defaultTimeToLive = 31536000;

exports.handler = async (event) => {
  const { response } = event.Records[0].cf;
  const { headers } = response;

  // ADD HSTS header (Prevents man inthe Middle attack)
  headers['strict-transport-security'] = [
    {
      key: 'Strict-Transport-Security',
      value: 'max-age=63072000; includeSubDomains; preload',
    },
  ];

  // Cache Control headers
  if (!headers[headerCacheControl.toLowerCase()]) {
    headers[headerCacheControl.toLowerCase()] = [
      {
        key: headerCacheControl,
        value: `public, max-age=${defaultTimeToLive}`,
      },
    ];
  }

  // Add XSS protection mode block (If XSS is detected do not render the site)
  headers['x-xss-protection'] = [
    {
      key: 'X-XSS-Protection',
      value: '1; mode=block',
    },
  ];

  // Prevents XSS, clickjacking, code injection attacks
  // APP.BLITZBUDGET.COM
  /* headers['content-security-policy'] = [{
      key: 'Content-Security-Policy',
      value: "default-src https://app.blitzbudget.com/; img-src https://app.blitzbudget.com https://help.blitzbudget.com; script-src 'nonce-2726d7e2654esd' 'sha256-LxfDQZoQkS9qJjokjwq5K5MfYGlwn1S+aUg2ioxEozs=' 'sha256-ym8Mk8Y2voA3XO1CaQwp9wJ+dEIYtT34DFWwTmiPB9o=' 'sha256-LPUvAQ+WuxgpyJk/Mzu1Udg7n1NHhHH+H4SW/SCTokE=' 'sha256-fo0z1TK4Ei06l/LQ0hEDZOeuLvh1kajNINswvtz34oc=' 'sha256-uNO/ue/gWH+PiAUWYUQ1QE3GNtFZtEMcvDLQp+Ikn8E=' 'sha256-WG3/So3xLnVV9gV454Fa7BEFth6+hxTzG2ZUWFUSjKw=' 'sha256-0PMn1emWrgrrgzYnWu2zk9dry5odz1CQV+ZKPxWMRec=' 'sha256-ka2VuDiWPUmJK1cVHijU4sQqN/CKAvCURYWkZIJpROc=' 'sha256-e4yr6Iy91pxSkYNROzOkTL9TOhD5JKyvhW92z77useQ='; style-src 'unsafe-inline' https://app.blitzbudget.com/  https://fonts.googleapis.com; object-src 'none'; connect-src https://app.blitzbudget.com/ https://cognito-idp.eu-west-1.amazonaws.com/ https://api.blitzbudget.com/ https://help.blitzbudget.com; font-src 'self' https://fonts.gstatic.com; style-src-elem  'sha256-w4cc42PyW4waV+7R+d/QM9PjYXwHKTk7J1/JcT8MAyw=' 'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=' 'nonce-2726f7e26d' https://app.blitzbudget.com/ https://fonts.googleapis.com; base-uri 'none';"
    }]; */

  // WWW.BLITZBUDGET.COM
  headers['content-security-policy'] = [
    {
      key: 'Content-Security-Policy',
      value:
        "default-src https://www.blitzbudget.com/; img-src 'self'; script-src 'strict-dynamic' 'nonce-2726d7e26r' https:; style-src 'nonce-2726f7e26d' https://www.blitzbudget.com/  https://blitzbudget.com/ https://fonts.googleapis.com 'sha256-+7g9GIVwIQyRW5AWmV3tOknRu/VejUoNtGLu4+COYXU='; object-src 'none'; connect-src 'self' https://api.blitzbudget.com/; font-src 'self' https://fonts.gstatic.com; style-src-elem 'nonce-2726f7e26d' https://www.blitzbudget.com/ https://blitzbudget.com/ https://fonts.googleapis.com 'sha256-+7g9GIVwIQyRW5AWmV3tOknRu/VejUoNtGLu4+COYXU=';",
    },
  ];

  // HELP.BLITZBUDGET.COM
  // headers['content-security-policy'] = [{key: 'Content-Security-Policy', value: "default-src https://help.blitzbudget.com/; img-src 'self'; script-src 'strict-dynamic' 'nonce-2726d7e26r' https:; style-src https://help.blitzbudget.com/  https://fonts.googleapis.com https: 'nonce-2726f7e26d' 'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=' 'sha256-cd59ztWBgjmAWjjdPZ8n02WYLeMktmBrmAn5loyS+wM='; object-src 'none'; connect-src https://api.blitzbudget.com/ https://help.blitzbudget.com/; font-src 'self' https://fonts.gstatic.com; style-src-elem 'nonce-2726f7e26d' https://help.blitzbudget.com/ https://fonts.googleapis.com 'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=' 'sha256-cd59ztWBgjmAWjjdPZ8n02WYLeMktmBrmAn5loyS+wM=';"}];
  // HELP.BLITZBUDGET.COM
  // headers['access-control-allow-origin'] = [{key: 'Access-Control-Allow-Origin', value: '*'}];

  // Prevents MIME types security risk
  headers['x-content-type-options'] = [
    {
      key: 'X-Content-Type-Options',
      value: 'nosniff',
    },
  ];

  // Prevents Clickjacking vulnerability
  headers['x-frame-options'] = [
    {
      key: 'X-Frame-Options',
      value: 'DENY',
    },
  ];

  // Refered will be sent only by the origin site
  headers['referrer-policy'] = [
    {
      key: 'Referrer-Policy',
      value: 'same-origin',
    },
  ];

  return response;
};

// Overview script (app.blitzbudget.com)
// 'sha256-LxfDQZoQkS9qJjokjwq5K5MfYGlwn1S+aUg2ioxEozs='

// Transactions Script SHA 256 (app.blitzbudget.com)
// 'sha256-ym8Mk8Y2voA3XO1CaQwp9wJ+dEIYtT34DFWwTmiPB9o='

// Budget Script SHA 256 (app.blitzbudget.com)
// 'sha256-LPUvAQ+WuxgpyJk/Mzu1Udg7n1NHhHH+H4SW/SCTokE='

// Profile Script SHA 256 (app.blitzbudget.com)
// 'sha256-fo0z1TK4Ei06l/LQ0hEDZOeuLvh1kajNINswvtz34oc='

// Settings Script SHA 256 (app.blitzbudget.com)
// 'sha256-uNO/ue/gWH+PiAUWYUQ1QE3GNtFZtEMcvDLQp+Ikn8E='

// Support Script SHA 256 (app.blitzbudget.com)
// 'sha256-WG3/So3xLnVV9gV454Fa7BEFth6+hxTzG2ZUWFUSjKw='

// Export XLS Script SHA 256 (app.blitzbudget.com)
// 'sha256-0PMn1emWrgrrgzYnWu2zk9dry5odz1CQV+ZKPxWMRec='

// Export DOC Script SHA 256 (app.blitzbudget.com)
// 'sha256-ka2VuDiWPUmJK1cVHijU4sQqN/CKAvCURYWkZIJpROc='

// Export CSV Script SHA 256 (app.blitzbudget.com)
// 'sha256-e4yr6Iy91pxSkYNROzOkTL9TOhD5JKyvhW92z77useQ='
