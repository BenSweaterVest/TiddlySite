#!/usr/bin/env python3
"""
Build script for collaborative-blog-plugin.json

Generates JSON plugin package containing all tiddlers (core + examples).
"""
import json
import sys
import glob
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
        return None
    except Exception as e:
        print(f"Error reading {filepath}: {e}", file=sys.stderr)
        return None

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
        return None
    except Exception as e:
        print(f"Error reading {filepath}: {e}", file=sys.stderr)
        return None

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

def main():
    """Main build process."""
    tiddlers = {}
    errors = []

    tid_files = glob.glob('plugins/collaborative-blog/tiddlers/*.tid')
    if not tid_files:
        print("Warning: No .tid files found", file=sys.stderr)

    for tid_file in sorted(tid_files):
        tiddler = parse_tid_file(tid_file)
        if tiddler:
            title = tiddler.get('title', Path(tid_file).stem)
            tiddlers[title] = tiddler
        else:
            errors.append(tid_file)

    js_files = glob.glob('plugins/collaborative-blog/tiddlers/*.js')
    if not js_files:
        print("Warning: No .js files found", file=sys.stderr)

    for js_file in sorted(js_files):
        tiddler = parse_js_file(js_file)
        if tiddler:
            title = tiddler.get('title', Path(js_file).stem)
            tiddlers[title] = tiddler
        else:
            errors.append(js_file)

    if errors:
        print(f"\nWarning: {len(errors)} files had errors:", file=sys.stderr)
        for f in errors:
            print(f"  - {f}", file=sys.stderr)

    if not tiddlers:
        print("Error: No tiddlers processed", file=sys.stderr)
        sys.exit(1)

    plugin_json = {
        "tiddlers": tiddlers
    }

    try:
        with open('collaborative-blog-plugin.json', 'w', encoding='utf-8') as f:
            json.dump(plugin_json, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"Error writing output file: {e}", file=sys.stderr)
        sys.exit(1)

    print(f"Created collaborative-blog-plugin.json with {len(tiddlers)} tiddlers")

if __name__ == '__main__':
    main()
