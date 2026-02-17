# Lichess Puzzler

A cross-browser extension that reminds you to solve chess puzzles on [Lichess](https://lichess.org). Choose when to be reminded, pick your favorite puzzle categories, and jump straight into training.

## Features

- **Two trigger modes**
  - **Timer** — opens a reminder at a set interval (15 min to 24 hours, or any custom value)
  - **New Tab** — shows a reminder when you open a new tab, with a configurable probability (10–100%)

- **25+ puzzle categories** — fork, pin, mate in 2, endgame, sacrifice, and more. Select multiple and a random one is picked each time.

- **6 color themes** — Crimson, Ocean, Emerald, Purple, Amber, Teal. Each theme changes the full palette (accent, background, surfaces).

- **Quick actions on the reminder screen** — Start Puzzle, Skip, or Disable Extension with one click.

- **Cross-browser** — works on Chrome, Edge, Firefox, Brave, and Opera (Manifest V3).

## Install

### From source

1. Clone or download this repo
2. **Chrome / Edge / Brave:**
   - Go to `chrome://extensions`
   - Enable "Developer mode"
   - Click "Load unpacked" → select the `LichessPuzzler` folder
3. **Firefox:**
   - Go to `about:debugging` → This Firefox
   - Click "Load Temporary Add-on"
   - Select `manifest.json` from the `LichessPuzzler` folder


## How It Works

The extension redirects you to `lichess.org/training/{theme}` — no API keys or accounts needed. Lichess handles the puzzle solving natively.

- **Timer mode:** A `chrome.alarms` alarm fires at the configured interval and opens a new tab with the reminder page. The alarm repeats automatically.
- **New tab mode:** The background script listens for new tabs via `chrome.tabs.onCreated`. On each new tab, it rolls against the configured probability and redirects if the roll passes.

Settings are saved to `chrome.storage.sync` and persist across sessions.

## Permissions

| Permission | Why |
|------------|-----|
| `storage`  | Save user preferences |
| `alarms`   | Timer-based reminders |
| `tabs`     | Open and redirect tabs |

## License

MIT
