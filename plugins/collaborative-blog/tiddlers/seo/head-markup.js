/*\
title: $:/plugins/collaborative-blog/seo/head-markup.js
type: application/javascript
module-type: filteroperator

Filter operator returning the HTML for the <head> of the saved file: page
description, Open Graph and Twitter card tags, RSS link and analytics.

[cb-head-markup[]]

All values are HTML-escaped except the custom analytics script, which is
inserted exactly as entered by a site administrator.

\*/
(function() {

  'use strict';

  const CONFIG = '$:/config/collaborative-blog/';

  function escapeAttribute(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function buildHeadMarkup(wiki) {
    const get = function(title, fallback) {
      const text = wiki.getTiddlerText(title, fallback || '');
      return (text || '').trim();
    };
    const lines = [];
    const meta = function(attribute, name, content) {
      if (content) {
        lines.push('<meta ' + attribute + '="' + escapeAttribute(name) + '" content="' + escapeAttribute(content) + '" />');
      }
    };

    const siteTitle = get('$:/SiteTitle');
    const description = get(CONFIG + 'site-description') || get('$:/SiteSubtitle');
    const siteUrl = get(CONFIG + 'site-url').replace(/\/+$/, '');
    const image = get(CONFIG + 'og-image');
    const twitter = get(CONFIG + 'twitter-handle');
    const robots = get(CONFIG + 'robots');

    lines.push('<!-- Collaborative Blog: page metadata -->');
    meta('name', 'description', description);
    meta('name', 'robots', robots);
    if (siteUrl) {
      lines.push('<link rel="canonical" href="' + escapeAttribute(siteUrl + '/') + '" />');
    }
    meta('property', 'og:type', 'website');
    meta('property', 'og:site_name', siteTitle);
    meta('property', 'og:title', siteTitle);
    meta('property', 'og:description', description);
    meta('property', 'og:url', siteUrl ? siteUrl + '/' : '');
    meta('property', 'og:image', image);
    meta('name', 'twitter:card', image ? 'summary_large_image' : 'summary');
    meta('name', 'twitter:title', siteTitle);
    meta('name', 'twitter:description', description);
    meta('name', 'twitter:image', image);
    if (twitter) {
      const handle = twitter.charAt(0) === '@' ? twitter : '@' + twitter;
      meta('name', 'twitter:site', handle);
    }
    if (get(CONFIG + 'rss-enabled', 'yes') === 'yes') {
      lines.push('<link rel="alternate" type="application/rss+xml" title="' + escapeAttribute(siteTitle + ' RSS') + '" href="/rss.xml" />');
    }

    if (get(CONFIG + 'analytics/enabled', 'no') === 'yes') {
      const provider = get(CONFIG + 'analytics/provider');
      const domain = get(CONFIG + 'analytics/domain');
      const id = get(CONFIG + 'analytics/id');
      lines.push('<!-- Collaborative Blog: analytics (' + escapeAttribute(provider) + ') -->');
      if (provider === 'plausible' && domain) {
        lines.push('<script defer data-domain="' + escapeAttribute(domain) + '" src="https://plausible.io/js/script.js"></script>');
      } else if (provider === 'simple') {
        lines.push('<script async defer src="https://scripts.simpleanalyticscdn.com/latest.js"></script>');
      } else if (provider === 'google' && /^[A-Z0-9-]+$/i.test(id)) {
        lines.push('<script async src="https://www.googletagmanager.com/gtag/js?id=' + escapeAttribute(id) + '"></script>');
        lines.push('<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","' + id + '");</script>');
      } else if (provider === 'custom') {
        const custom = get(CONFIG + 'analytics/custom-script');
        if (custom) {
          lines.push(custom);
        }
      }
    }
    return lines.join('\n');
  }

  exports['cb-head-markup'] = function(source, operator, options) {
    return [buildHeadMarkup(options.wiki)];
  };

})();
