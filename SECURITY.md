# Security Policy

## Supported Versions

We provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 2.2.x   | :white_check_mark: |
| 2.1.x   | :white_check_mark: |
| 2.0.x   | :white_check_mark: |
| < 2.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in TiddlySite, please report it responsibly:

1. **DO NOT** open a public GitHub issue
2. Email the maintainers at: [security contact - add your email here]
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will respond within 48 hours and provide a timeline for a fix.

## Security Best Practices

### For Users

#### Cloudflare Setup

1. **Environment Variables**:
   - Use strong, unique passwords for `SAVE_PASSWORD`
   - Rotate `GITHUB_TOKEN` regularly (every 90 days)
   - Never commit environment variables to your repository
   - Use Cloudflare's encrypted environment variables

2. **GitHub Token Permissions**:
   - Use fine-grained personal access tokens (not classic)
   - Grant only `repo` scope (or `contents: write` for fine-grained)
   - Set expiration date (max 1 year, prefer 90 days)
   - Revoke unused tokens immediately

3. **Password Policies**:
   - Minimum 16 characters
   - Mix of uppercase, lowercase, numbers, symbols
   - Never reuse passwords from other services
   - Use a password manager
   - Don't share save password via insecure channels

4. **Session Security**:
   - Disable "Remember password for session" on shared computers
   - Clear session password when done editing
   - Log out of Cloudflare dashboard when not in use

#### Content Security

1. **Sensitive Information**:
   - Never include credentials, API keys, or secrets in tiddlers
   - Review all changes before saving to GitHub
   - Use `.gitignore` for sensitive local files
   - Be cautious with embedded scripts or iframes

2. **Access Control**:
   - Set GitHub repository to private if needed
   - Limit Cloudflare Pages access to authorized users
   - Review Cloudflare access logs periodically
   - Enable two-factor authentication (2FA) on GitHub and Cloudflare

### For Cloudflare Function Developers

#### Rate Limiting

Add rate limiting to prevent abuse:

```javascript
// functions/save.js
const RATE_LIMIT = 60; // requests per hour
const RATE_WINDOW = 3600000; // 1 hour in milliseconds

export async function onRequest(context) {
  const { request, env } = context;

  // Get client IP for rate limiting
  const clientIP = request.headers.get('CF-Connecting-IP');
  const rateLimitKey = `rate_limit_${clientIP}`;

  // Check rate limit (using Cloudflare KV or Durable Objects)
  // Implementation depends on your rate limiting strategy

  // ... rest of save logic
}
```

#### Content Security Policy (CSP)

Add CSP headers to your Cloudflare Function:

```javascript
export async function onRequest(context) {
  // ... save logic ...

  return new Response(JSON.stringify({ success: true }), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Security-Policy': "default-src 'self'; script-src 'self'",
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
    }
  });
}
```

#### Input Validation

Always validate and sanitize inputs:

```javascript
export async function onRequest(context) {
  const { request, env } = context;

  try {
    const { content, password } = await request.json();

    // Validate inputs
    if (!content || typeof content !== 'string') {
      return new Response('Invalid content', { status: 400 });
    }

    if (!password || typeof password !== 'string') {
      return new Response('Invalid password', { status: 400 });
    }

    // Validate content size (prevent DoS)
    if (content.length > 50 * 1024 * 1024) { // 50MB limit
      return new Response('Content too large', { status: 413 });
    }

    // ... rest of save logic
  } catch (error) {
    return new Response('Invalid request', { status: 400 });
  }
}
```

#### Audit Logging

Log all save attempts for security monitoring:

```javascript
export async function onRequest(context) {
  const { request, env } = context;

  const timestamp = new Date().toISOString();
  const clientIP = request.headers.get('CF-Connecting-IP');
  const userAgent = request.headers.get('User-Agent');

  // Log save attempt (use Cloudflare Analytics Engine or Workers KV)
  console.log(JSON.stringify({
    timestamp,
    clientIP,
    userAgent,
    action: 'save_attempt',
    success: true // or false
  }));

  // ... save logic
}
```

### Common Vulnerabilities to Avoid

#### 1. Cross-Site Scripting (XSS)

**Risk**: Malicious scripts in tiddler content

**Mitigation**:
- TiddlyWiki sanitizes HTML by default
- Avoid using `<$text text={{!!field}} mode="inline" type="text/html"/>`
- Use `<$view field="field"/>` which is safe
- Be cautious with custom widgets that render raw HTML

#### 2. Insecure Storage

**Risk**: Credentials stored in tiddlers or client-side code

**Mitigation**:
- All passwords in Cloudflare environment variables (not in tiddlers)
- Session passwords in memory only (not localStorage)
- Never commit `.env` files or configuration with secrets

#### 3. Man-in-the-Middle (MITM)

**Risk**: Credentials intercepted during transmission

**Mitigation**:
- Always use HTTPS (Cloudflare Pages provides this automatically)
- Verify Cloudflare Function endpoint uses `https://`
- Enable HSTS (Strict-Transport-Security header)

#### 4. Brute Force Attacks

**Risk**: Attackers trying multiple passwords

**Mitigation**:
- Use strong passwords (16+ characters)
- Implement rate limiting in Cloudflare Function
- Monitor failed authentication attempts
- Consider adding CAPTCHA for repeated failures

#### 5. Insufficient Access Control

**Risk**: Unauthorized users can save changes

**Mitigation**:
- Password required for every save operation
- Server-side password validation (not client-side)
- No authentication bypass mechanisms
- Regular password rotation

## Security Checklist

### Before Deployment

- [ ] Strong `SAVE_PASSWORD` set (16+ characters)
- [ ] GitHub token has minimal required permissions
- [ ] Repository set to private (if needed)
- [ ] Two-factor authentication enabled on GitHub
- [ ] Two-factor authentication enabled on Cloudflare
- [ ] Environment variables properly configured
- [ ] Test connection works with correct password
- [ ] Test connection fails with wrong password

### Regular Maintenance

- [ ] Rotate `SAVE_PASSWORD` every 90 days
- [ ] Rotate `GITHUB_TOKEN` every 90 days
- [ ] Review Cloudflare access logs monthly
- [ ] Check for unauthorized commits in GitHub
- [ ] Update TiddlyWiki to latest version
- [ ] Update plugin to latest version
- [ ] Review and revoke unused GitHub tokens
- [ ] Test backup restoration procedure

### After a Security Incident

- [ ] Change `SAVE_PASSWORD` immediately
- [ ] Revoke and regenerate `GITHUB_TOKEN`
- [ ] Review all commits for unauthorized changes
- [ ] Check Cloudflare and GitHub access logs
- [ ] Notify users if data was compromised
- [ ] Document incident and lessons learned
- [ ] Update security procedures accordingly

## Secure Defaults

TiddlySite uses secure defaults:

- ✅ Server-side password validation (v2.0+)
- ✅ GitHub token never exposed to client
- ✅ Session passwords in memory only (not persisted)
- ✅ Password cleared on authentication failures
- ✅ HTTPS required for Cloudflare Functions
- ✅ Analytics disabled by default (privacy-first)
- ✅ Debug logging disabled by default
- ✅ No client-side password storage

## Privacy Considerations

### Analytics

- Analytics disabled by default
- Opt-in, not opt-out
- Privacy-friendly options recommended (Plausible, Simple Analytics)
- Google Analytics requires explicit user choice
- Custom analytics allows full control

### Data Storage

- All data stored in user's GitHub repository
- User maintains full ownership
- No third-party data collection by plugin
- Cloudflare Functions are stateless (no data retention)

## Reporting Format

When reporting security issues, use this format:

```markdown
**Summary**
Brief description of the vulnerability

**Severity**
Critical / High / Medium / Low

**Affected Versions**
Which versions are affected

**Attack Scenario**
How could this be exploited?

**Steps to Reproduce**
1. Step 1
2. Step 2
3. Step 3

**Impact**
What damage could this cause?

**Suggested Fix**
How to address this issue

**References**
Links to relevant CVEs, papers, or documentation
```

## Security Updates

We will:
- Publish security advisories for confirmed vulnerabilities
- Release patches within 7 days for critical issues
- Release patches within 30 days for high-severity issues
- Credit researchers who responsibly disclose vulnerabilities
- Notify users of security updates via GitHub releases

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Cloudflare Security Best Practices](https://developers.cloudflare.com/fundamentals/basic-tasks/protect-your-origin-server/)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [TiddlyWiki Security](https://tiddlywiki.com/security.html)

---

Last Updated: 2025-12-07
