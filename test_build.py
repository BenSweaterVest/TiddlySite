#!/usr/bin/env python3
"""
Test suite for build scripts.

Validates that build scripts execute successfully and produce valid output.
"""
import json
import subprocess
import sys
from pathlib import Path

def test_plugin_info_exists():
    """Verify plugin.info file exists and is valid JSON."""
    print("Testing plugin.info...")
    plugin_info_path = Path('plugins/collaborative-blog/plugin.info')

    if not plugin_info_path.exists():
        print("  FAIL: plugin.info not found")
        return False

    try:
        with open(plugin_info_path, 'r') as f:
            data = json.load(f)

        required_fields = ['title', 'version', 'author', 'core-version']
        missing = [f for f in required_fields if f not in data]

        if missing:
            print(f"  FAIL: Missing required fields: {missing}")
            return False

        print(f"  PASS: Valid plugin.info (version {data['version']})")
        return True
    except json.JSONDecodeError as e:
        print(f"  FAIL: Invalid JSON: {e}")
        return False

def test_create_plugin_tid():
    """Test create-plugin-tid.py build script."""
    print("\nTesting create-plugin-tid.py...")

    try:
        result = subprocess.run(
            [sys.executable, 'create-plugin-tid.py'],
            capture_output=True,
            text=True,
            timeout=30
        )

        if result.returncode != 0:
            print(f"  FAIL: Script exited with code {result.returncode}")
            print(f"  Error: {result.stderr}")
            return False

        output_file = Path('collaborative-blog-plugin.tid')
        if not output_file.exists():
            print("  FAIL: Output file not created")
            return False

        with open(output_file, 'r', encoding='utf-8') as f:
            content = f.read()

        if 'title: $:/plugins/collaborative-blog' not in content:
            print("  FAIL: Invalid output format")
            return False

        if '"tiddlers"' not in content:
            print("  FAIL: Missing tiddlers in output")
            return False

        print(f"  PASS: Built {output_file.name} ({len(content)} bytes)")
        return True

    except subprocess.TimeoutExpired:
        print("  FAIL: Script timeout")
        return False
    except Exception as e:
        print(f"  FAIL: {e}")
        return False

def test_convert_to_json():
    """Test convert-to-json.py build script."""
    print("\nTesting convert-to-json.py...")

    try:
        result = subprocess.run(
            [sys.executable, 'convert-to-json.py'],
            capture_output=True,
            text=True,
            timeout=30
        )

        if result.returncode != 0:
            print(f"  FAIL: Script exited with code {result.returncode}")
            print(f"  Error: {result.stderr}")
            return False

        output_file = Path('collaborative-blog-plugin.json')
        if not output_file.exists():
            print("  FAIL: Output file not created")
            return False

        with open(output_file, 'r', encoding='utf-8') as f:
            data = json.load(f)

        if 'tiddlers' not in data:
            print("  FAIL: Missing tiddlers key")
            return False

        tiddler_count = len(data['tiddlers'])
        if tiddler_count == 0:
            print("  FAIL: No tiddlers in output")
            return False

        print(f"  PASS: Built {output_file.name} ({tiddler_count} tiddlers)")
        return True

    except json.JSONDecodeError as e:
        print(f"  FAIL: Invalid JSON output: {e}")
        return False
    except subprocess.TimeoutExpired:
        print("  FAIL: Script timeout")
        return False
    except Exception as e:
        print(f"  FAIL: {e}")
        return False

def test_javascript_modules():
    """Verify JavaScript modules have valid metadata."""
    print("\nTesting JavaScript modules...")

    js_files = list(Path('plugins/collaborative-blog/tiddlers').glob('*.js'))

    if not js_files:
        print("  FAIL: No JavaScript files found")
        return False

    for js_file in js_files:
        with open(js_file, 'r', encoding='utf-8') as f:
            content = f.read()

        if '/*\\' not in content or '\\*/' not in content:
            print(f"  FAIL: {js_file.name} missing metadata block")
            return False

        if 'title:' not in content or 'module-type:' not in content:
            print(f"  FAIL: {js_file.name} missing required metadata")
            return False

    print(f"  PASS: All {len(js_files)} JavaScript modules valid")
    return True

def main():
    """Run all tests."""
    print("Running TiddlySite build tests\n" + "=" * 50)

    tests = [
        test_plugin_info_exists,
        test_javascript_modules,
        test_create_plugin_tid,
        test_convert_to_json
    ]

    results = []
    for test in tests:
        try:
            results.append(test())
        except Exception as e:
            print(f"\nUnexpected error in {test.__name__}: {e}")
            results.append(False)

    print("\n" + "=" * 50)
    passed = sum(results)
    total = len(results)

    print(f"Results: {passed}/{total} tests passed")

    if passed == total:
        print("\nAll tests passed")
        return 0
    else:
        print(f"\n{total - passed} test(s) failed")
        return 1

if __name__ == '__main__':
    sys.exit(main())
