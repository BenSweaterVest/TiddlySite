/*\
title: $:/plugins/collaborative-blog/saver/session.js
type: application/javascript
module-type: library

Shared in-memory state for the Cloudflare saver: the remembered password and
helpers for reading saver configuration. Nothing here is ever written to the
wiki, so the password never ends up in the saved file.

\*/
(function() {

  'use strict';

  const CONFIG_PREFIX = '$:/config/cloudflare-saver/';
  const REVISION_TIDDLER = '$:/state/cloudflare-saver/revision';

  const state = {
    password: null
  };

  function getConfig(wiki) {
    const get = function(name, fallback) {
      const value = wiki.getTiddlerText(CONFIG_PREFIX + name, fallback);
      return (value === undefined || value === null) ? fallback : String(value).trim();
    };
    const timeoutSeconds = parseInt(get('timeout', '60'), 10);
    return {
      enabled: get('enabled', 'no') === 'yes',
      endpoint: get('endpoint', ''),
      timeout: Math.max(5, isNaN(timeoutSeconds) ? 60 : timeoutSeconds) * 1000,
      autoRetry: get('auto-retry', 'yes') === 'yes',
      rememberPassword: get('remember-password', 'no') === 'yes',
      autosave: get('autosave', 'no') === 'yes',
      debug: get('debug', 'no') === 'yes'
    };
  }

  function resolveEndpoint(endpoint) {
    if (!endpoint) {
      return '';
    }
    try {
      return new URL(endpoint, window.location.href).toString();
    } catch (e) {
      return endpoint;
    }
  }

  function newRevision() {
    if (window.crypto && window.crypto.randomUUID) {
      return window.crypto.randomUUID();
    }
    return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 12);
  }

  exports.CONFIG_PREFIX = CONFIG_PREFIX;
  exports.REVISION_TIDDLER = REVISION_TIDDLER;
  exports.state = state;
  exports.getConfig = getConfig;
  exports.resolveEndpoint = resolveEndpoint;
  exports.newRevision = newRevision;

  exports.setPassword = function(password) {
    state.password = password || null;
  };

  exports.getPassword = function() {
    return state.password;
  };

  exports.clearPassword = function() {
    state.password = null;
  };

  // The editor's name is a per-browser convenience, kept out of the wiki file
  const EDITOR_KEY = 'tiddlysite-editor-name';

  exports.getEditor = function() {
    try {
      return window.localStorage.getItem(EDITOR_KEY) || '';
    } catch (e) {
      return '';
    }
  };

  exports.setEditor = function(name) {
    try {
      if (name) {
        window.localStorage.setItem(EDITOR_KEY, name);
      } else {
        window.localStorage.removeItem(EDITOR_KEY);
      }
    } catch (e) {
      // Storage can be unavailable (private mode); the name is optional
    }
  };

})();
