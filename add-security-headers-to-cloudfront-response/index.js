'use strict';
const headerCacheControl = 'Cache-Control';
const defaultTimeToLive = 31536000;

exports.handler = async function(event, context) {
  const response = event.Records[0].cf.response;
  const headers = response.headers;

  // ADD HSTS header (Prevents man inthe Middle attack)
  headers['strict-transport-security'] = [{
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  }];
  
  // Cache Control headers
  if (!headers[headerCacheControl.toLowerCase()]) {
    headers[headerCacheControl.toLowerCase()] = [{key: headerCacheControl, value: `public, max-age=${defaultTimeToLive}`}];
  }
  
  // Add XSS protection mode block (If XSS is detected do not render the site)
  headers['x-xss-protection'] = [{key: 'X-XSS-Protection', value: '1; mode=block'}]; 
  
  // Prevents XSS, clickjacking, code injection attacks
  // APP.BLITZBUDGET.COM
  headers['content-security-policy'] = [{
    key: 'Content-Security-Policy', 
    value: "default-src https://app.blitzbudget.com/; img-src https://app.blitzbudget.com https://help.blitzbudget.com; script-src 'strict-dynamic' 'nonce-2726d7e26r' 'sha256-4eNMUeHTUAw+Aq7OpRVnkGfZbm4t1QGlls6LZm5Xh98=' 'sha256-wb9kNM3pyNTW1XrnWbP9Jj3ApHr6OHnR/7Y6idBAIN4=' 'sha256-Oq8QJ5LYhP/gdPC8VCaRXoC7zTNbzUl/KHUBH4g+I2E=' 'sha256-ttANeMF+N2cscmcLi44cYuMqajCkszGmLy8cItqj1K0=' 'sha256-/uLp43xockV/lGOtgy9HmXlc1uNThyki21HNYTHzwMc=' 'sha256-obW5yi/TPXXb7+jgEybB0Rf6+6Z25hx3a/OXllDcKN4=' 'sha256-NaXmUkgC0SqRUE6gzxwOqDL6EiRVzz/HUOMZYCuauwI=' 'sha256-0PMn1emWrgrrgzYnWu2zk9dry5odz1CQV+ZKPxWMRec=' 'sha256-e4yr6Iy91pxSkYNROzOkTL9TOhD5JKyvhW92z77useQ=' https:; style-src 'unsafe-inline' https://app.blitzbudget.com/  https://fonts.googleapis.com; object-src 'none'; connect-src https://app.blitzbudget.com/ https://cognito-idp.eu-west-1.amazonaws.com/ https://api.blitzbudget.com/ https://help.blitzbudget.com; font-src 'self' https://fonts.gstatic.com; style-src-elem  'sha256-w4cc42PyW4waV+7R+d/QM9PjYXwHKTk7J1/JcT8MAyw=' 'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=' 'nonce-2726f7e26d' https://app.blitzbudget.com/ https://fonts.googleapis.com; base-uri 'none';"
  }];
  
  // WWW.BLITZBUDGET.COM
  //headers['content-security-policy'] = [{key: 'Content-Security-Policy', value: "default-src https://www.blitzbudget.com/; img-src 'self'; script-src 'strict-dynamic' 'nonce-2726d7e26r' https:; style-src https://www.blitzbudget.com/  https://blitzbudget.com/ https://fonts.googleapis.com 'sha256-+7g9GIVwIQyRW5AWmV3tOknRu/VejUoNtGLu4+COYXU='; object-src 'none'; connect-src 'self'; font-src 'self' https://fonts.gstatic.com; style-src-elem 'nonce-2726f7e26d' https://www.blitzbudget.com/ https://blitzbudget.com/ https://fonts.googleapis.com 'sha256-+7g9GIVwIQyRW5AWmV3tOknRu/VejUoNtGLu4+COYXU=';"}];
  
  // HELP.BLITZBUDGET.COM
  //headers['content-security-policy'] = [{key: 'Content-Security-Policy', value: "default-src https://help.blitzbudget.com/; img-src 'self'; script-src 'strict-dynamic' 'nonce-2726d7e26r' https:; style-src https://help.blitzbudget.com/  https://fonts.googleapis.com https: 'nonce-2726f7e26d' 'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=' 'sha256-cd59ztWBgjmAWjjdPZ8n02WYLeMktmBrmAn5loyS+wM='; object-src 'none'; connect-src https://api.blitzbudget.com/ https://help.blitzbudget.com/; font-src 'self' https://fonts.gstatic.com; style-src-elem 'nonce-2726f7e26d' https://help.blitzbudget.com/ https://fonts.googleapis.com 'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=' 'sha256-cd59ztWBgjmAWjjdPZ8n02WYLeMktmBrmAn5loyS+wM=';"}];
  // HELP.BLITZBUDGET.COM
  //headers['access-control-allow-origin'] = [{key: 'Access-Control-Allow-Origin', value: '*'}];
  
  // Prevents MIME types security risk
  headers['x-content-type-options'] = [{key: 'X-Content-Type-Options', value: 'nosniff'}];
 
  // Prevents Clickjacking vulnerability
  headers['x-frame-options'] = [{key: 'X-Frame-Options', value: 'DENY'}]; 
 
  // Refered will be sent only by the origin site
  headers['referrer-policy'] = [{key: 'Referrer-Policy', value: 'same-origin'}]; 
  
  
  return response;
};
