/*\
title: $:/plugins/collaborative-blog/saver/password-dialog.js
type: application/javascript
module-type: library

A small accessible modal that asks for the save password (masked input) and
optionally the editor's name. Resolves to {password, remember, editor} or null
when cancelled.

\*/
(function() {

  'use strict';

  let openDialog = null;

  function element(tag, attributes, children) {
    const node = document.createElement(tag);
    Object.keys(attributes || {}).forEach((name) => {
      if (name === 'text') {
        node.textContent = attributes[name];
      } else {
        node.setAttribute(name, attributes[name]);
      }
    });
    (children || []).forEach((child) => {
      node.appendChild(child);
    });
    return node;
  }

  exports.ask = function(options) {
    options = options || {};
    if (openDialog) {
      return openDialog;
    }
    openDialog = new Promise((resolve) => {
      const previousFocus = document.activeElement;
      const passwordInput = element('input', {type: 'password', autocomplete: 'current-password', required: 'required', 'class': 'cb-dialog-password'});
      const editorInput = element('input', {type: 'text', autocomplete: 'name', 'class': 'cb-dialog-editor'});
      editorInput.value = options.editor || '';
      const rememberInput = element('input', {type: 'checkbox', 'class': 'cb-dialog-remember'});
      rememberInput.checked = !!options.remember;
      const cancelButton = element('button', {type: 'button', text: 'Cancel'});
      const saveButton = element('button', {type: 'submit', 'class': 'cb-dialog-primary', text: 'Save'});
      const errorText = element('p', {'class': 'cb-dialog-error', role: 'alert'});
      if (options.error) {
        errorText.textContent = options.error;
      }
      const form = element('form', {'class': 'cb-dialog', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'cb-dialog-title'}, [
        element('h2', {id: 'cb-dialog-title', text: options.title || 'Publish changes'}),
        element('p', {text: options.message || 'Enter the site password to save your changes. The site updates about a minute after saving.'}),
        errorText,
        element('label', {}, [document.createTextNode('Password'), passwordInput]),
        element('label', {}, [document.createTextNode('Your name (shown in the change history)'), editorInput]),
        element('label', {}, [rememberInput, document.createTextNode(' Remember the password until I close this page')]),
        element('div', {'class': 'cb-dialog-actions'}, [cancelButton, saveButton])
      ]);
      const backdrop = element('div', {'class': 'cb-dialog-backdrop'}, [form]);

      function close(result) {
        document.removeEventListener('keydown', onKeyDown, true);
        if (backdrop.parentNode) {
          backdrop.parentNode.removeChild(backdrop);
        }
        openDialog = null;
        if (previousFocus && previousFocus.focus) {
          previousFocus.focus();
        }
        resolve(result);
      }

      function onKeyDown(event) {
        if (event.key === 'Escape') {
          event.preventDefault();
          close(null);
        } else if (event.key === 'Tab') {
          const focusable = Array.prototype.slice.call(form.querySelectorAll('input,button'));
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
      }

      form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!passwordInput.value) {
          errorText.textContent = 'Please enter the password.';
          passwordInput.focus();
          return;
        }
        close({
          password: passwordInput.value,
          editor: editorInput.value.trim(),
          remember: rememberInput.checked
        });
      });
      cancelButton.addEventListener('click', () => {
        close(null);
      });
      backdrop.addEventListener('mousedown', (event) => {
        if (event.target === backdrop) {
          close(null);
        }
      });
      document.addEventListener('keydown', onKeyDown, true);
      document.body.appendChild(backdrop);
      passwordInput.focus();
    });
    return openDialog;
  };

})();
