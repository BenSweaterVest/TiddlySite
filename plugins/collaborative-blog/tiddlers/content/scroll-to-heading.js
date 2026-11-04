/*\
title: $:/plugins/collaborative-blog/content/scroll-to-heading.js
type: application/javascript
module-type: widget

<$action-cb-scroll-to-heading tiddler="Post title" index="0"/>

Scrolls to the nth heading inside a post's content. Used by the table of
contents, because TiddlyWiki uses the URL hash for navigation and headings
have no ids.

\*/
(function() {

  'use strict';

  const Widget = require('$:/core/modules/widgets/widget.js').widget;

  function ScrollToHeading(parseTreeNode, options) {
    this.initialise(parseTreeNode, options);
  }
  ScrollToHeading.prototype = new Widget();

  ScrollToHeading.prototype.render = function(parent, nextSibling) {
    this.computeAttributes();
    this.execute();
  };

  ScrollToHeading.prototype.execute = function() {
    this.tiddler = this.getAttribute('tiddler', this.getVariable('currentTiddler'));
    this.index = parseInt(this.getAttribute('index', '0'), 10) || 0;
  };

  ScrollToHeading.prototype.refresh = function(changedTiddlers) {
    const changed = this.computeAttributes();
    if (Object.keys(changed).length) {
      this.refreshSelf();
      return true;
    }
    return this.refreshChildren(changedTiddlers);
  };

  ScrollToHeading.prototype.invokeAction = function() {
    if (typeof document === 'undefined') {
      return true;
    }
    const frames = document.querySelectorAll('.tc-tiddler-frame[data-tiddler-title]');
    let frame = null;
    for (let i = 0; i < frames.length; i++) {
      if (frames[i].getAttribute('data-tiddler-title') === this.tiddler) {
        frame = frames[i];
        break;
      }
    }
    if (!frame) {
      return true;
    }
    const headings = frame.querySelectorAll('.cb-post-content h1, .cb-post-content h2, .cb-post-content h3, .cb-post-content h4, .cb-post-content h5, .cb-post-content h6');
    const target = headings[this.index];
    if (target) {
      const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth', block: 'start'});
      target.setAttribute('tabindex', '-1');
      target.focus({preventScroll: true});
    }
    return true;
  };

  exports['action-cb-scroll-to-heading'] = ScrollToHeading;

})();
