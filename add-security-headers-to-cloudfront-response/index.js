'use strict';
exports.handler = async function(event, context) {
  const response = event.Records[0].cf.response;
  const headers = response.headers;

  // ADD HSTS header (Prevents man inthe Middle attack)
  headers['strict-transport-security'] = [{
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  }];
  
  // Add XSS protection mode block (If XSS is detected do not render the site)
  headers['x-xss-protection'] = [{key: 'X-XSS-Protection', value: '1; mode=block'}]; 
  
  // Prevents XSS, clickjacking, code injection attacks
  //headers['content-security-policy'] = [{key: 'Content-Security-Policy', value: "default-src https://app.blitzbudget.com/; img-src 'self'; script-src 'strict-dynamic' 'nonce-2726d7e26r' 'unsafe-inline' https:; style-src 'unsafe-inline' https://app.blitzbudget.com/  https://fonts.googleapis.com; object-src 'none'; connect-src https://app.blitzbudget.com/ https://cognito-idp.eu-west-1.amazonaws.com/ https://api.blitzbudget.com/; font-src 'self' https://fonts.gstatic.com; style-src-elem 'sha256-w4cc42PyW4waV+7R+d/QM9PjYXwHKTk7J1/JcT8MAyw=' 'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=' 'nonce-2726f7e26d' https://app.blitzbudget.com/ https://fonts.googleapis.com;  base-uri 'none';"}];
  headers['content-security-policy'] = [{key: 'Content-Security-Policy', value: "default-src https://www.blitzbudget.com/; img-src 'self'; script-src 'strict-dynamic' 'nonce-2726d7e26r' https:; style-src https://www.blitzbudget.com/  https://fonts.googleapis.com; object-src 'none'; connect-src https://app.blitzbudget.com/ https://cognito-idp.eu-west-1.amazonaws.com/; font-src 'self' https://fonts.gstatic.com; style-src-elem 'nonce-2726f7e26d' https://www.blitzbudget.com/ https://fonts.googleapis.com;"}];
  
  // Prevents MIME types security risk
  headers['x-content-type-options'] = [{key: 'X-Content-Type-Options', value: 'nosniff'}];
 
  // Prevents Clickjacking vulnerability
  headers['x-frame-options'] = [{key: 'X-Frame-Options', value: 'DENY'}]; 
 
  // Refered will be sent only by the origin site
  headers['referrer-policy'] = [{key: 'Referrer-Policy', value: 'same-origin'}]; 
  
  return response;
};
