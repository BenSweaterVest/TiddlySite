#!/usr/bin/env python3
"""
Create the collaborative-blog-plugin.tid file
This is the single-file plugin format for drag-and-drop installation.
It includes only the core plugin tiddlers, not example content.
"""
import json

def parse_tid_file(filepath):
    """Parse a .tid file and return a dictionary of its contents."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split headers from body
    parts = content.split('\n\n', 1)

    # Parse headers
    tiddler = {}
    if len(parts) > 0:
        header_lines = parts[0].split('\n')
        for line in header_lines:
            if ': ' in line:
                key, value = line.split(': ', 1)
                tiddler[key] = value

    # Add body text
    if len(parts) > 1:
        tiddler['text'] = parts[1]
    else:
        tiddler['text'] = ''

    return tiddler

def parse_js_file(filepath):
    """Parse a .js file and return a dictionary of its contents."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract metadata from JS comment block
    tiddler = {}
    lines = content.split('\n')
    in_metadata = False
    text_lines = []

    for line in lines:
        if line.strip() == '/*\\':
            in_metadata = True
            continue
        elif line.strip() == '\\*/':
            in_metadata = False
            continue

        if in_metadata:
            if ': ' in line:
                key, value = line.split(': ', 1)
                tiddler[key.strip()] = value.strip()
        else:
            text_lines.append(line)

    # Everything outside the metadata block is the text
    tiddler['text'] = '\n'.join(text_lines)

    return tiddler

# Core plugin tiddlers only (no example content)
core_tiddlers = [
    # Styles and templates
    'plugins/collaborative-blog/tiddlers/styles.tid',
    'plugins/collaborative-blog/tiddlers/navigation.tid',
    'plugins/collaborative-blog/tiddlers/admin-panel.tid',
    'plugins/collaborative-blog/tiddlers/viewtemplate-systemtiddler.tid',
    'plugins/collaborative-blog/tiddlers/viewtemplate-post.tid',
    'plugins/collaborative-blog/tiddlers/viewtemplate-page.tid',
    'plugins/collaborative-blog/tiddlers/readme.tid',
    # Custom post type templates
    'plugins/collaborative-blog/tiddlers/viewtemplate-post-event.tid',
    'plugins/collaborative-blog/tiddlers/viewtemplate-post-gallery.tid',
    'plugins/collaborative-blog/tiddlers/viewtemplate-post-video.tid',
    'plugins/collaborative-blog/tiddlers/viewtemplate-post-quote.tid',
    # Theme system
    'plugins/collaborative-blog/tiddlers/theme-controller.tid',
    'plugins/collaborative-blog/tiddlers/theme-switcher.tid',
    # Enhanced search
    'plugins/collaborative-blog/tiddlers/search-panel.tid',
    'plugins/collaborative-blog/tiddlers/search-results.tid',
    # Analytics integration
    'plugins/collaborative-blog/tiddlers/analytics-controller.tid',
    'plugins/collaborative-blog/tiddlers/analytics-settings.tid',
    # Cloudflare saver JavaScript modules
    'plugins/collaborative-blog/tiddlers/cloudflare-saver.js',
    'plugins/collaborative-blog/tiddlers/cloudflare-startup.js',
    'plugins/collaborative-blog/tiddlers/cloudflare-test-action.js',
    'plugins/collaborative-blog/tiddlers/cloudflare-clear-password-action.js',
    # Cloudflare saver tiddlers
    'plugins/collaborative-blog/tiddlers/cloudflare-settings.tid',
    'plugins/collaborative-blog/tiddlers/cloudflare-wizard.tid',
    # Notifications
    'plugins/collaborative-blog/tiddlers/notification-saving.tid',
    'plugins/collaborative-blog/tiddlers/notification-success.tid',
    'plugins/collaborative-blog/tiddlers/notification-failure.tid',
]

# Parse plugin.info to get metadata
with open('plugins/collaborative-blog/plugin.info', 'r') as f:
    plugin_info = json.load(f)

# Build tiddlers object
tiddlers = {}
for file_path in core_tiddlers:
    if file_path.endswith('.js'):
        tiddler = parse_js_file(file_path)
    else:
        tiddler = parse_tid_file(file_path)
    title = tiddler.get('title')
    if title:
        tiddlers[title] = tiddler

# Create the JSON body
plugin_body = json.dumps({"tiddlers": tiddlers}, ensure_ascii=False)

# Create the .tid file with headers
headers = f"""author: {plugin_info['author']}
core-version: {plugin_info['core-version']}
description: {plugin_info['description']}
list: {plugin_info['list']}
plugin-type: {plugin_info['plugin-type']}
title: {plugin_info['title']}
type: application/json
version: {plugin_info['version']}"""

# Write the .tid file
with open('collaborative-blog-plugin.tid', 'w', encoding='utf-8') as f:
    f.write(headers)
    f.write('\n\n')
    f.write(plugin_body)

print(f"Created collaborative-blog-plugin.tid with {len(tiddlers)} core tiddlers:")
for title in sorted(tiddlers.keys()):
    print(f"  - {title}")
