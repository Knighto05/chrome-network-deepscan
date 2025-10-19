# Network DeepScan

A simple Chrome DevTools extension for capturing and searching network requests.

## Features

- **Capture Network Requests** - Automatically captures HTTP requests and responses
- **Search Requests** - Full-text search across all captured request data
- **View Request Details** - See URLs, methods, headers, and response bodies

## Screenshot

<img width="624" height="559" alt="image" src="https://github.com/user-attachments/assets/90e13e55-533b-474d-88bc-3fe189af55fc" />

## Installation

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable **Developer mode** (toggle in the top right)
4. Click **Load unpacked** and select the extension folder
5. Done!

## Usage

1. Open any webpage
2. Press **F12** to open Chrome DevTools
3. Click the **Network DeepScan** tab
4. Make network requests (refresh page, click links, etc.)
5. Type in the search box to find matching requests
6. Click **Search** to filter results

## File Structure

```
network-deepscan/
├── manifest.json      # Extension config
├── devtools.js        # DevTools panel setup
├── panel.html         # UI layout
├── panel.js           # Search logic
├── icon.png           # Extension icon
└── README.md          # This file
```

## How It Works

- `manifest.json` - Tells Chrome how to run the extension
- `devtools.js` - Creates the "Network DeepScan" tab in DevTools
- `panel.js` - Listens for network requests and handles searching
- `panel.html` - Simple search interface with results display

## Requirements

- Chrome browser (Manifest V3 compatible)
- DevTools must be open to capture requests

## Limitations

- All requests stored in memory (no persistence)
- No limit on how many requests are captured
- Only basic URL and method display in results
- No expandable details or status code colors

## Next Steps

Consider adding:
- Clear button to reset requests
- Request limit to prevent memory issues
- Expandable request details
- Status code highlighting
- Better UI/UX

## License

MIT License
