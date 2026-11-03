/*\
title: $:/plugins/collaborative-blog/saver/actions.js
type: application/javascript
module-type: widget

Action widgets for the Cloudflare saver settings:

<$action-test-cloudflare/>            checks the endpoint and password without saving
<$action-clear-cloudflare-password/>  forgets the remembered password

\*/
(function() {

  'use strict';

  const Widget = require('$:/core/modules/widgets/widget.js').widget;
  const session = require('$:/plugins/collaborative-blog/saver/session.js');
  const dialog = require('$:/plugins/collaborative-blog/saver/password-dialog.js');

  const RESULT_TIDDLER = '$:/temp/cloudflare-saver/test-result';

  function ActionWidget(parseTreeNode, options) {
    this.initialise(parseTreeNode, options);
  }
  ActionWidget.prototype = new Widget();
  ActionWidget.prototype.render = function(parent, nextSibling) {
    this.computeAttributes();
    this.execute();
  };
  ActionWidget.prototype.execute = function() {};
  ActionWidget.prototype.refresh = function() {
    return false;
  };

  function setResult(wiki, status, message) {
    wiki.addTiddler(new $tw.Tiddler({title: RESULT_TIDDLER, text: status, message}));
  }

  async function testConnection(wiki) {
    const config = session.getConfig(wiki);
    if (!config.endpoint) {
      setResult(wiki, 'error', 'Enter the endpoint address first.');
      return;
    }
    const endpoint = session.resolveEndpoint(config.endpoint);
    setResult(wiki, 'pending', 'Checking ' + endpoint + ' ...');

    // Step 1: is the function deployed and configured?
    let health;
    try {
      const response = await fetch(endpoint, {method: 'GET', credentials: 'same-origin'});
      health = await response.json().catch(() => ({}));
      if (!response.ok) {
        setResult(wiki, 'error', 'The endpoint answered with HTTP ' + response.status + '. Check that functions/save.js is deployed.');
        return;
      }
    } catch (error) {
      setResult(wiki, 'error', 'Could not reach ' + endpoint + ' (' + error.message + ').');
      return;
    }
    if (health.configured === false) {
      setResult(wiki, 'error', 'The function is deployed but missing settings: ' + (health.missing || []).join(', ') + '. Add them under Settings > Variables and Secrets in Cloudflare Pages.');
      return;
    }

    // Step 2: does the password work? (verify only, nothing is committed)
    let password = session.getPassword();
    if (!password) {
      const answer = await dialog.ask({
        title: 'Test the connection',
        message: 'Enter the site password to check it. Nothing will be saved.',
        editor: session.getEditor(),
        remember: config.rememberPassword
      });
      if (!answer) {
        setResult(wiki, 'cancelled', 'Test cancelled.');
        return;
      }
      password = answer.password;
      session.setEditor(answer.editor);
      session.setPassword(answer.remember ? password : null);
    }
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({action: 'verify', password}),
        credentials: 'same-origin'
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setResult(wiki, 'success', 'Connected. The password is correct and the function can reach ' + (data.repo || 'GitHub') + '.');
      } else if (response.status === 401) {
        session.clearPassword();
        setResult(wiki, 'error', 'The function is working but the password was not accepted.');
      } else {
        setResult(wiki, 'error', 'The function answered with HTTP ' + response.status + (data.error ? ': ' + data.error : '') + '.');
      }
    } catch (error) {
      setResult(wiki, 'error', 'Request failed (' + error.message + ').');
    }
  }

  function TestAction(parseTreeNode, options) {
    ActionWidget.call(this, parseTreeNode, options);
  }
  TestAction.prototype = Object.create(ActionWidget.prototype);
  TestAction.prototype.invokeAction = function() {
    testConnection(this.wiki);
    return true;
  };

  function ClearPasswordAction(parseTreeNode, options) {
    ActionWidget.call(this, parseTreeNode, options);
  }
  ClearPasswordAction.prototype = Object.create(ActionWidget.prototype);
  ClearPasswordAction.prototype.invokeAction = function() {
    session.clearPassword();
    setResult(this.wiki, 'info', 'The remembered password has been cleared.');
    return true;
  };

  exports['action-test-cloudflare'] = TestAction;
  exports['action-clear-cloudflare-password'] = ClearPasswordAction;

})();
