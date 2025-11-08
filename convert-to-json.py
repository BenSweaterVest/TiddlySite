#!/usr/bin/env python3
import json
import os
import glob

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

def convert_plugin_to_json():
    """Convert all .tid files in the plugin to a single JSON file."""
    tiddlers = {}

    # Find all .tid files
    tid_files = glob.glob('plugins/collaborative-blog/tiddlers/*.tid')

    for tid_file in sorted(tid_files):
        tiddler = parse_tid_file(tid_file)
        title = tiddler.get('title', os.path.basename(tid_file).replace('.tid', ''))
        tiddlers[title] = tiddler

    # Create the final JSON structure
    plugin_json = {
        "tiddlers": tiddlers
    }

    # Write to file
    with open('collaborative-blog-plugin.json', 'w', encoding='utf-8') as f:
        json.dump(plugin_json, f, indent=4, ensure_ascii=False)

    print(f"Converted {len(tiddlers)} tiddlers to collaborative-blog-plugin.json")
    print("Tiddlers included:")
    for title in sorted(tiddlers.keys()):
        print(f"  - {title}")

if __name__ == '__main__':
    convert_plugin_to_json()
