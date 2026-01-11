#!/usr/bin/env python3
"""
Build script for collaborative-blog-plugin.tid

Generates single-file plugin package containing core tiddlers.
"""
import json
import sys
from pathlib import Path

def parse_tid_file(filepath):
    """
    Parse TiddlyWiki .tid file format.

    Args:
        filepath: Path to .tid file

    Returns:
        Dictionary containing tiddler metadata and text content
    """
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        print(f"Error: File not found: {filepath}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error reading {filepath}: {e}", file=sys.stderr)
        sys.exit(1)

    parts = content.split('\n\n', 1)

    tiddler = {}
    if len(parts) > 0:
        header_lines = parts[0].split('\n')
        for line in header_lines:
            if ': ' in line:
                key, value = line.split(': ', 1)
                tiddler[key] = value

    tiddler['text'] = parts[1] if len(parts) > 1 else ''

    return tiddler

def parse_js_file(filepath):
    """
    Parse JavaScript module file with TiddlyWiki metadata block.

    Args:
        filepath: Path to .js file

    Returns:
        Dictionary containing module metadata and code
    """
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        print(f"Error: File not found: {filepath}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error reading {filepath}: {e}", file=sys.stderr)
        sys.exit(1)

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
    # SEO features
    'plugins/collaborative-blog/tiddlers/rss-feed.tid',
    'plugins/collaborative-blog/tiddlers/rss-config.tid',
    'plugins/collaborative-blog/tiddlers/sitemap.tid',
    'plugins/collaborative-blog/tiddlers/social-meta-tags.tid',
    'plugins/collaborative-blog/tiddlers/seo-config-og-image.tid',
    'plugins/collaborative-blog/tiddlers/seo-config-twitter.tid',
    # Content features
    'plugins/collaborative-blog/tiddlers/reading-time-macro.tid',
    'plugins/collaborative-blog/tiddlers/table-of-contents-macro.tid',
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

def main():
    """Main build process."""
    try:
        with open('plugins/collaborative-blog/plugin.info', 'r') as f:
            plugin_info = json.load(f)
    except FileNotFoundError:
        print("Error: plugin.info not found", file=sys.stderr)
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in plugin.info: {e}", file=sys.stderr)
        sys.exit(1)

    tiddlers = {}
    missing_files = []

    for file_path in core_tiddlers:
        if not Path(file_path).exists():
            missing_files.append(file_path)
            continue

        if file_path.endswith('.js'):
            tiddler = parse_js_file(file_path)
        else:
            tiddler = parse_tid_file(file_path)

        title = tiddler.get('title')
        if title:
            tiddlers[title] = tiddler
        else:
            print(f"Warning: No title found in {file_path}", file=sys.stderr)

    if missing_files:
        print(f"Error: {len(missing_files)} files not found:", file=sys.stderr)
        for f in missing_files:
            print(f"  - {f}", file=sys.stderr)
        sys.exit(1)

    plugin_body = json.dumps({"tiddlers": tiddlers}, ensure_ascii=False)

    headers = f"""author: {plugin_info['author']}
core-version: {plugin_info['core-version']}
description: {plugin_info['description']}
list: {plugin_info['list']}
plugin-type: {plugin_info['plugin-type']}
title: {plugin_info['title']}
type: application/json
version: {plugin_info['version']}"""

    try:
        with open('collaborative-blog-plugin.tid', 'w', encoding='utf-8') as f:
            f.write(headers)
            f.write('\n\n')
            f.write(plugin_body)
    except Exception as e:
        print(f"Error writing output file: {e}", file=sys.stderr)
        sys.exit(1)

    print(f"Created collaborative-blog-plugin.tid with {len(tiddlers)} core tiddlers")
    print(f"Version: {plugin_info['version']}")

if __name__ == '__main__':
    main()
