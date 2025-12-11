# Contributing to TiddlySite

Thank you for your interest in contributing to TiddlySite! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Submitting Changes](#submitting-changes)
- [Reporting Bugs](#reporting-bugs)
- [Requesting Features](#requesting-features)
- [Documentation](#documentation)
- [Release Process](#release-process)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive experience for everyone. We expect all contributors to:

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, discrimination, or personal attacks
- Trolling, insulting/derogatory comments
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

## Getting Started

### Prerequisites

- Git
- Python 3.7+ (for build scripts)
- A text editor or IDE
- Basic knowledge of TiddlyWiki
- Understanding of JavaScript (for module development)

### Setting Up Your Development Environment

1. **Fork the repository** on GitHub

2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR-USERNAME/TiddlySite.git
   cd TiddlySite
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/BenSweaterVest/TiddlySite.git
   ```

4. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Project Structure

```
TiddlySite/
├── plugins/collaborative-blog/     # Main plugin source
│   ├── plugin.info                 # Plugin metadata
│   └── tiddlers/                   # Plugin tiddlers
│       ├── *.tid                   # TiddlyWiki tiddlers
│       └── *.js                    # JavaScript modules
├── create-plugin-tid.py            # Build script (core only)
├── convert-to-json.py              # Build script (with examples)
├── README.md                       # User documentation
├── CHANGELOG.md                    # Version history
├── CONTRIBUTING.md                 # This file
└── RELEASE_NOTES_*.md              # Detailed release notes
```

## Development Workflow

### Making Changes

1. **Keep your fork up to date**:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create a feature branch**:
   ```bash
   git checkout -b feature/descriptive-name
   ```

3. **Make your changes**:
   - Edit tiddler files in `plugins/collaborative-blog/tiddlers/`
   - Follow coding standards (see below)
   - Test your changes thoroughly

4. **Test the build scripts**:
   ```bash
   python3 create-plugin-tid.py
   python3 convert-to-json.py
   ```

5. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Description of changes"
   ```

### Testing Your Changes

1. **Import the plugin** into a test TiddlyWiki:
   - Use `empty.html` as a base
   - Drag and drop `collaborative-blog-plugin.json`
   - Test all affected features

2. **Verify** the following:
   - All features work as expected
   - No JavaScript console errors
   - Responsive design on mobile/desktop
   - All themes render correctly
   - Search functionality works
   - Analytics integration works
   - Cloudflare saver functions (if applicable)

3. **Test cross-browser** (if UI changes):
   - Chrome/Edge
   - Firefox
   - Safari (if available)

## Coding Standards

### TiddlyWiki Tiddlers (.tid files)

**File Structure**:
```
title: $:/plugins/collaborative-blog/TiddlerName
tags: $:/tags/AppropriateTags
type: text/vnd.tiddlywiki

Content goes here
```

**Naming Conventions**:
- Use descriptive, kebab-case names
- Prefix with `$:/plugins/collaborative-blog/`
- Group related tiddlers with common prefixes

**Best Practices**:
- Use CSS variables for styling (don't hardcode colors)
- Keep tiddlers focused on single responsibility
- Add comments for complex logic
- Use semantic HTML
- Include ARIA labels for accessibility

### JavaScript Modules (.js files)

**File Structure**:
```javascript
/*\
title: $:/plugins/collaborative-blog/module-name.js
type: application/javascript
module-type: widget|saver|startup

Description of module
\*/
(function(){
  'use strict';

  // Module code here

})();
```

**Code Style**:
- Use strict mode
- 2-space indentation
- Single quotes for strings
- Semicolons required
- Descriptive variable names (camelCase)
- Function names describe action (verb + noun)

**Error Handling**:
- Always use try-catch for async operations
- Provide meaningful error messages
- Log errors when debug mode is enabled
- Handle edge cases gracefully

**Comments**:
- Use JSDoc-style comments for functions
- Explain complex logic
- Document parameters and return values

**Example**:
```javascript
/**
 * Calculate reading time for post content
 * @param {string} text - The text content to analyze
 * @param {number} wordsPerMinute - Average reading speed (default: 200)
 * @returns {number} Estimated reading time in minutes
 */
const calculateReadingTime = function(text, wordsPerMinute = 200) {
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};
```

### CSS Standards

**Use CSS Variables**:
```css
/* Good */
.my-element {
  color: var(--cb-text-primary);
  background: var(--cb-bg-content);
}

/* Avoid */
.my-element {
  color: #333333;
  background: #ffffff;
}
```

**Naming Conventions**:
- Prefix custom classes with `cb-` (collaborative-blog)
- Use kebab-case for class names
- Be descriptive but concise

**Responsive Design**:
- Mobile-first approach
- Use relative units (rem, em, %)
- Test on multiple screen sizes

### Python Build Scripts

**Code Style**:
- Follow PEP 8
- 4-space indentation
- Descriptive variable names (snake_case)
- Docstrings for all functions
- Type hints where appropriate

**Error Handling**:
- Handle file not found errors
- Validate input before processing
- Provide clear error messages

## Submitting Changes

### Pull Request Process

1. **Update documentation**:
   - Update README.md if adding features
   - Add entry to CHANGELOG.md (under [Unreleased])
   - Update relevant sections

2. **Run build scripts**:
   ```bash
   python3 create-plugin-tid.py
   python3 convert-to-json.py
   ```

3. **Commit all changes**:
   ```bash
   git add .
   git commit -m "Add feature: descriptive name"
   ```

4. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**:
   - Go to GitHub and create a PR
   - Use the PR template (if available)
   - Provide clear description of changes
   - Reference any related issues

### Pull Request Guidelines

**Title Format**:
- `feat: Add RSS feed generation`
- `fix: Correct search filter bug`
- `docs: Update installation instructions`
- `refactor: Improve saver error handling`
- `test: Add unit tests for widgets`

**Description Should Include**:
- What changes were made
- Why the changes were necessary
- How to test the changes
- Screenshots (for UI changes)
- Breaking changes (if any)

**Before Submitting**:
- [ ] Code follows project style guidelines
- [ ] Documentation is updated
- [ ] CHANGELOG.md is updated
- [ ] Build scripts run successfully
- [ ] Changes tested in TiddlyWiki
- [ ] No console errors
- [ ] Commit messages are clear

## Reporting Bugs

### Before Submitting a Bug Report

1. **Check existing issues** to avoid duplicates
2. **Test with latest version** to see if bug still exists
3. **Try minimal reproduction** to isolate the issue

### Bug Report Template

```markdown
**Description**
A clear description of the bug.

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What you expected to happen.

**Actual Behavior**
What actually happened.

**Environment**
- TiddlyWiki Version: 5.3.0
- Plugin Version: 2.2.0
- Browser: Chrome 120
- OS: Windows 11

**Screenshots**
If applicable, add screenshots.

**Console Errors**
Any errors from browser console (F12).

**Additional Context**
Any other relevant information.
```

## Requesting Features

### Feature Request Template

```markdown
**Feature Description**
Clear description of the proposed feature.

**Use Case**
Why is this feature needed? What problem does it solve?

**Proposed Solution**
How would you implement this feature?

**Alternatives Considered**
What other approaches did you consider?

**Additional Context**
Mockups, examples, or related features.
```

## Documentation

### Documentation Standards

**README.md**:
- Keep installation instructions clear and concise
- Provide examples for all features
- Include troubleshooting section
- Update table of contents when adding sections

**Code Comments**:
- Explain "why" not "what" (code shows what)
- Document complex algorithms
- Add TODOs with name and date if leaving something incomplete

**CHANGELOG.md**:
- Follow Keep a Changelog format
- Categorize changes: Added, Changed, Deprecated, Removed, Fixed, Security
- Link to issues and PRs where applicable

**Release Notes**:
- Create detailed release notes for major/minor versions
- Include migration guides for breaking changes
- Provide examples of new features

## Release Process

### Versioning

We use [Semantic Versioning](https://semver.org/):
- **MAJOR** version: Incompatible API changes
- **MINOR** version: New features (backward compatible)
- **PATCH** version: Bug fixes (backward compatible)

### Release Checklist

- [ ] All tests pass
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version bumped in `plugin.info`
- [ ] Build scripts run successfully
- [ ] Release notes created
- [ ] Tag created: `git tag v2.3.0`
- [ ] Packages built and tested
- [ ] GitHub release created with assets

### Creating a Release

1. **Update version** in `plugins/collaborative-blog/plugin.info`

2. **Update CHANGELOG.md**:
   - Move [Unreleased] changes to new version section
   - Add release date

3. **Create release notes** (RELEASE_NOTES_vX.X.X.md)

4. **Build packages**:
   ```bash
   python3 create-plugin-tid.py
   python3 convert-to-json.py
   ```

5. **Commit and tag**:
   ```bash
   git add .
   git commit -m "Release v2.3.0"
   git tag v2.3.0
   git push origin main --tags
   ```

6. **Create GitHub release**:
   - Attach `collaborative-blog-plugin.tid`
   - Attach `collaborative-blog-plugin.json`
   - Copy release notes to description

## Community

### Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and general discussion
- **TiddlyWiki Forums**: https://talk.tiddlywiki.org/

### Recognition

Contributors will be:
- Listed in release notes
- Credited in CHANGELOG.md
- Mentioned in project README (for significant contributions)

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (BSD 3-Clause, same as TiddlyWiki).

---

Thank you for contributing to TiddlySite! Your efforts help make this project better for everyone.
