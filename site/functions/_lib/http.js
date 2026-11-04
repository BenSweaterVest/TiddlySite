// Shared HTTP helpers for the TiddlySite Cloudflare Pages Functions.

export function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...headers
    }
  });
}

function allowedOrigins(env) {
  return String(env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim().replace(/\/+$/, ''))
    .filter(Boolean);
}

/*
  Same-origin requests are always allowed. Other origins must be listed in
  ALLOWED_ORIGINS (comma separated, or "*"). Requests without an Origin header
  (curl, server-to-server) are allowed because the password still applies.
*/
export function checkOrigin(request, env) {
  const origin = request.headers.get('Origin');
  if (!origin) {
    return {ok: true, origin: null};
  }
  const self = new URL(request.url).origin;
  const allowed = allowedOrigins(env);
  if (origin === self || allowed.includes('*') || allowed.includes(origin)) {
    return {ok: true, origin};
  }
  return {ok: false, origin, error: `Origin ${origin} is not allowed. Add it to ALLOWED_ORIGINS.`};
}

export function corsHeaders(request, env) {
  const check = checkOrigin(request, env);
  if (!check.ok || !check.origin || check.origin === new URL(request.url).origin) {
    return {};
  }
  return {
    'Access-Control-Allow-Origin': check.origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin'
  };
}

// Compares two secrets in constant time by hashing both first
export async function secretsMatch(provided, expected) {
  if (typeof provided !== 'string' || typeof expected !== 'string' || !expected) {
    return false;
  }
  const encoder = new TextEncoder();
  const [a, b] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(provided)),
    crypto.subtle.digest('SHA-256', encoder.encode(expected))
  ]);
  const left = new Uint8Array(a);
  const right = new Uint8Array(b);
  let difference = 0;
  for (let i = 0; i < left.length; i++) {
    difference |= left[i] ^ right[i];
  }
  return difference === 0;
}

// Base64 for large UTF-8 strings without blowing the call stack
export function utf8ToBase64(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

export function xmlEscape(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
