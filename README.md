# ▶🍪⬇ YouTube Cookie Downloader

[![GitHub Release](https://img.shields.io/github/v/release/a-lberto/ytcookie?style=flat-square)](https://github.com/a-lberto/ytcookie/releases)
[![Tests](https://github.com/a-lberto/ytcookie/actions/workflows/test.yml/badge.svg)](https://github.com/a-lberto/ytcookie/actions/workflows/test.yml)
[![Package](https://github.com/a-lberto/ytcookie/actions/workflows/package.yml/badge.svg)](https://github.com/a-lberto/ytcookie/actions/workflows/package.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![Chrome Web Store](https://img.shields.io/badge/Chrome-Web%20Store-blue?logo=google-chrome&logoColor=white&style=flat-square)](https://chrome.google.com/webstore/detail/...)
[![Firefox Add-ons](https://img.shields.io/badge/Firefox-Add--ons-orange?logo=firefox-browser&logoColor=white&style=flat-square)](https://addons.mozilla.org/en-US/firefox/addon/...)

A lightweight, modern browser extension to extract your YouTube cookies into a Netscape-formatted text file. Perfect for use with tools like `yt-dlp`, `curl`, and `wget`.

## ✨ Features

- **🚀 One-Click Extraction:** Just click the extension icon to download your cookies instantly.
- **📄 Netscape Format:** Automatically generates a valid `cookies.txt` file compatible with industry-standard tools.
- **🔒 Privacy First:** Processes everything locally in your browser. No data ever leaves your machine.
- **🌐 Cross-Browser:** Built with Manifest V3, supporting Chrome, Firefox, Edge, and Firefox for Android.
- **🛠️ Developer Friendly:** Clean, modular code with automated Playwright tests.

## 🚀 Installation

### Chrome / Edge / Brave

1. Download the latest release `.zip` from the [Releases](https://github.com/a-lberto/ytcookie/releases) page.
2. Unzip the folder.
3. Open `chrome://extensions/`.
4. Enable **Developer mode** (top right).
5. Click **Load unpacked** and select the unzipped folder.

### Firefox (Desktop & Android)

1. Download the latest `.xpi` file from the [Releases](https://github.com/a-lberto/ytcookie/releases) page.
2. For Desktop: Open `about:addons`, click the gear icon, and select **Install Add-on From File...**.
3. For Android: Follow the [Mozilla guide](https://extensionworkshop.com/documentation/develop/developing-extensions-for-firefox-for-android/) to install custom add-ons via a Collection.

## 🛠️ Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [npm](https://www.npmjs.com/)

### Setup

```bash
git clone https://github.com/a-lberto/ytcookie.git
cd ytcookie
npm install
```

### Running Tests

The project uses Playwright for automated testing of the cookie extraction logic.

```bash
npm test
```

## 📦 Building

To package the extension for different browsers:

**Chrome:**

```bash
# Zip the root files (excluding node_modules, tests, etc.)
zip -r ytcookie-chrome.zip . -x "node_modules/*" "tests/*" ".git/*" ".github/*"
```

**Firefox:**

```bash
npx web-ext build
```
