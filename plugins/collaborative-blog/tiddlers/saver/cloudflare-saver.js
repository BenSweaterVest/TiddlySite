/*\
title: $:/plugins/collaborative-blog/saver/cloudflare-saver.js
type: application/javascript
module-type: saver

Saves the wiki to GitHub through a Cloudflare Pages Function (see
site/functions/save.js in the TiddlySite repository).

Conflict protection: every saved file carries a revision id in
$:/state/cloudflare-saver/revision. The function records the revision in the
commit message and refuses a save whose base revision is not the latest one,
so two editors cannot silently overwrite each other.

\*/
(function() {

  'use strict';

  const session = require('$:/plugins/collaborative-blog/saver/session.js');
  const dialog = require('$:/plugins/collaborative-blog/saver/password-dialog.js');

  const NOTIFY_SAVING = '$:/plugins/collaborative-blog/notifications/saving';
  const STATUS_TIDDLER = '$:/temp/cloudflare-saver/status';

  function CloudflareSaver(wiki) {
    this.wiki = wiki;
    this.busy = false;
  }

  CloudflareSaver.prototype.log = function(config) {
    if (config.debug) {
      const args = Array.prototype.slice.call(arguments, 1);
      args.unshift('[CloudflareSaver]');
      console.log.apply(console, args);
    }
  };

  CloudflareSaver.prototype.save = function(text, method, callback, options) {
    const config = session.getConfig(this.wiki);
    if (!config.enabled || !config.endpoint) {
      return false;
    }
    if (method !== 'save' && method !== 'autosave') {
      return false;
    }
    // A relative endpoint such as /save cannot work from a file opened locally;
    // fall through to TiddlyWiki's other savers (usually a download)
    if (window.location.protocol === 'file:' && !/^https?:/i.test(config.endpoint)) {
      return false;
    }
    // Autosave only runs when switched on and a password is already remembered,
    // so editing never pops up a password prompt on its own
    if (method === 'autosave' && (!config.autosave || !session.getPassword())) {
      return false;
    }
    if (this.busy) {
      // A save is already running; it will include these changes if it re-renders,
      // otherwise the wiki stays dirty and the editor can save again
      return true;
    }
    this.busy = true;
    const self = this;
    this.run(config, options || {}).then((error) => {
      self.busy = false;
      if (error === null) {
        callback(null);
      } else if (error !== undefined) {
        callback(error);
      }
      // undefined means the editor cancelled: leave the wiki marked as unsaved
    }, (error) => {
      self.busy = false;
      callback(String(error && error.message || error));
    });
    return true;
  };

  /*
  Returns a promise for null (saved), an error string, or undefined (cancelled)
  */
  CloudflareSaver.prototype.run = async function(config, options) {
    const endpoint = session.resolveEndpoint(config.endpoint);
    let password = session.getPassword();
    let editor = session.getEditor();
    let promptError = '';
    let force = false;

    for (let attempt = 0; attempt < 3; attempt++) {
      if (!password) {
        const answer = await dialog.ask({
          remember: config.rememberPassword,
          editor,
          error: promptError
        });
        if (!answer) {
          this.log(config, 'Save cancelled');
          return undefined;
        }
        password = answer.password;
        editor = answer.editor;
        session.setEditor(editor);
        session.setPassword(answer.remember ? password : null);
      }

      const result = await this.send(config, endpoint, password, editor, force, options);
      if (result.ok) {
        this.setStatus('success', 'Saved' + (result.commit ? ' (commit ' + result.commit.slice(0, 7) + ')' : ''));
        return null;
      }
      if (result.status === 401) {
        session.clearPassword();
        password = null;
        promptError = 'That password was not accepted. Please try again.';
        continue;
      }
      if (result.status === 409 && result.conflict && !force) {
        const overwrite = window.confirm(
          'Someone else has saved changes to the site since you opened this page.\n\n' +
          'Choose OK to overwrite their changes with your version, or Cancel to stop. ' +
          'If you cancel, reload the page to get their changes (copy anything you need to keep first).'
        );
        if (!overwrite) {
          this.setStatus('failure', 'Save stopped because of a conflict');
          return 'Not saved: another editor saved first. Reload the page to get the latest version.';
        }
        force = true;
        attempt--;
        continue;
      }
      this.setStatus('failure', result.message);
      return result.message;
    }
    return 'Not saved: the password was not accepted.';
  };

  CloudflareSaver.prototype.send = async function(config, endpoint, password, editor, force, options) {
    const wiki = this.wiki;
    const baseRevision = wiki.getTiddlerText(session.REVISION_TIDDLER, '');
    const revision = session.newRevision();

    // Stamp the new revision into the wiki, then render the file that includes it.
    // $:/state/ tiddlers are saved but do not mark the wiki as changed.
    wiki.addTiddler(new $tw.Tiddler({title: session.REVISION_TIDDLER, text: revision}));
    const template = (wiki.getTiddlerText('$:/config/SaveWikiButton/Template', '$:/core/save/all') || '$:/core/save/all').trim();
    const content = wiki.renderTiddler('text/plain', template, {variables: options.variables || {}});

    if ($tw.notifier) {
      $tw.notifier.display(NOTIFY_SAVING);
    }
    this.log(config, 'Saving', {endpoint, baseRevision, revision, bytes: content.length, force});

    const body = JSON.stringify({
      content,
      password,
      editor: editor || '',
      baseRevision,
      revision,
      force: !!force
    });

    const maxAttempts = config.autoRetry ? 3 : 1;
    let result = null;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      result = await this.post(config, endpoint, body);
      // Only retry failures that might be temporary
      const retryable = result.status === 0 || result.status === 429 || result.status >= 500;
      if (result.ok || !retryable || attempt === maxAttempts) {
        break;
      }
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 8000);
      this.log(config, 'Retrying in', delay, 'ms');
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    if (!result.ok) {
      // Roll back so the next attempt still uses the revision we loaded
      wiki.addTiddler(new $tw.Tiddler({title: session.REVISION_TIDDLER, text: baseRevision}));
    }
    return result;
  };

  CloudflareSaver.prototype.post = async function(config, endpoint, body) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), config.timeout);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body,
        signal: controller.signal,
        credentials: 'same-origin'
      });
      let data = {};
      const raw = await response.text();
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch (e) {
        data = {error: raw.slice(0, 200)};
      }
      return {
        ok: response.ok && data.success !== false,
        status: response.status,
        conflict: !!data.conflict,
        commit: data.commit || '',
        message: describeError(response.status, data.error)
      };
    } catch (error) {
      const timedOut = error && error.name === 'AbortError';
      return {
        ok: false,
        status: 0,
        message: timedOut ?
          'Save timed out. Check your connection and try again.' :
          'Could not reach the save service (' + (error && error.message || 'network error') + '). Check your connection and the endpoint in Blog settings.'
      };
    } finally {
      clearTimeout(timer);
    }
  };

  function describeError(status, detail) {
    const suffix = detail ? ' (' + detail + ')' : '';
    switch (status) {
    case 401: return 'The password was not accepted.';
    case 403: return 'The save service refused this request' + suffix + '.';
    case 404: return 'The save service was not found. Check that functions/save.js is deployed and the endpoint is correct.';
    case 409: return 'Another editor saved first' + suffix + '.';
    case 413: return 'The site file is larger than the save service allows' + suffix + '.';
    case 429: return 'Too many save attempts. Wait a minute and try again.';
    default:
      if (status >= 500) {
        return 'The save service reported an error' + suffix + '.';
      }
      return 'Save failed with HTTP ' + status + suffix + '.';
    }
  }

  CloudflareSaver.prototype.setStatus = function(status, message) {
    this.wiki.addTiddler(new $tw.Tiddler({
      title: STATUS_TIDDLER,
      text: status,
      message: message || '',
      time: $tw.utils.stringifyDate(new Date())
    }));
  };

  CloudflareSaver.prototype.info = {
    name: 'cloudflare',
    priority: 2000,
    capabilities: ['save', 'autosave']
  };

  exports.canSave = function(wiki) {
    return !!(typeof window !== 'undefined' && window.fetch);
  };

  exports.create = function(wiki) {
    return new CloudflareSaver(wiki);
  };

  exports.describeError = describeError;

})();
