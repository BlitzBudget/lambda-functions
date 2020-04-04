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
    value: "default-src https://app.blitzbudget.com/; img-src https://app.blitzbudget.com https://help.blitzbudget.com; script-src 'nonce-2726d7e2654esd' 'sha256-o//IGmtO7FKPdVF56RAU/sewGyjxQ/JinxaqFPRT1H0=' 'sha256-0PMn1emWrgrrgzYnWu2zk9dry5odz1CQV+ZKPxWMRec=' 'sha256-ka2VuDiWPUmJK1cVHijU4sQqN/CKAvCURYWkZIJpROc=' 'sha256-e4yr6Iy91pxSkYNROzOkTL9TOhD5JKyvhW92z77useQ=' 'sha256-WG3/So3xLnVV9gV454Fa7BEFth6+hxTzG2ZUWFUSjKw=' 'sha256-x85EammF2LdmSp1iCacgoA5iEzDVU7fpFLwHhnXxIiI=' 'sha256-19kCMgFhv+V1yUULITvo1DnNITvSJPChxISG+DeZJFo=' 'sha256-ZcEbOwLO1BJzVRE2CCDLhsEq0jUq8F+OCzEYM2lVfBk=' 'sha256-ttANeMF+N2cscmcLi44cYuMqajCkszGmLy8cItqj1K0=' 'sha256-j+nTUKhWs7AQBQb26mlN7k9GcXhqIT9637GDwi1lNx4='; style-src 'unsafe-inline' https://app.blitzbudget.com/  https://fonts.googleapis.com; object-src 'none'; connect-src https://app.blitzbudget.com/ https://cognito-idp.eu-west-1.amazonaws.com/ https://api.blitzbudget.com/ https://help.blitzbudget.com; font-src 'self' https://fonts.gstatic.com; style-src-elem  'sha256-w4cc42PyW4waV+7R+d/QM9PjYXwHKTk7J1/JcT8MAyw=' 'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=' 'nonce-2726f7e26d' https://app.blitzbudget.com/ https://fonts.googleapis.com; base-uri 'none';"
  }];

  // Profile script (app.blitzbudget.com)
  // 'sha256-o//IGmtO7FKPdVF56RAU/sewGyjxQ/JinxaqFPRT1H0='
  
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