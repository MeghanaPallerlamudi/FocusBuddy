# FocusBuddy

> A browser extension that reminds you to get back to studying when distractions take over.

FocusBuddy is a distraction-blocking browser extension built for students who want to stay focused while studying. When you visit a blocked website, FocusBuddy intervenes with a bookish reminder, a countdown, and a little encouragement (or sternness) to get back to your work.

## Features

- **Website Blocking** – Blocks distracting websites such as Instagram, YouTube, Reddit, Facebook, X and Pinterest.
- **Custom Blocklist** – Add or remove websites from your personal distraction list.
- **Study Reminder** – Displays a study-themed overlay when a blocked website is opened.
- **Countdown & Auto-Close** – Gives a brief countdown before automatically closing the distracting tab.
- **Progressive Messages** – The reminders become progressively more stern.
- **Enable/Disable Toggle** – Enable or disable FocusBuddy whenever needed.
- **Distraction Counter** – Tracks the number of blocked distractions during the browser session.
- **Reset Counter** – Reset your distraction count from the extension popup.

## Design

FocusBuddy uses a dark academia-inspired aesthetic featuring:

- Deep green and dark tones
- Antique gold accents
- Burgundy details
- A bookish illustrated character
- Study-room inspired design

## Technologies Used

- HTML
- CSS
- JavaScript
- Chrome Extension APIs (Manifest V3)
- Browser Storage API

## Project Structure

```text
FocusBuddy/
├── assets/
│   └── reading-gentleman.png
├── background.js
├── content.js
├── manifest.json
├── popup.css
├── popup.html
└── popup.js
```

## Installation

FocusBuddy can currently be installed manually in Microsoft Edge.

1. Clone or download this repository.
2. Extract the ZIP file if downloaded.
3. Open Microsoft Edge.
4. Navigate to `edge://extensions`.
5. Enable Developer mode.
6. Click Load unpacked.
7. Select the FocusBuddy project folder.
8. Pin FocusBuddy to your browser toolbar for convenient access.

## How It Works

1. FocusBuddy monitors browser tab activity.
2. When a user opens a website included in the blocklist, the extension identifies the website.
3. A study-themed overlay is displayed.
4. A countdown begins.
5. The distracting tab is automatically closed.
6. The distraction counter is updated.

## Permissions

FocusBuddy uses browser permissions to:

- Monitor browser tabs.
- Identify websites included in the blocklist.
- Inject the reminder interface into relevant webpages.
- Store settings and session distraction counts.
