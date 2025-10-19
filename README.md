# Network DeepScan

A powerful Chrome DevTools extension for capturing, searching, and analyzing network requests in real-time.

## Features

- **Capture All Network Requests** - Automatically captures every HTTP request and response made on the page
- **Full-Text Search** - Search across URLs, request/response bodies, headers, and status codes (case-insensitive)
- **Expandable Request Details** - Click any request to view:
  - Request and response headers
  - Request body/payload
  - Response body (with JSON formatting)
  - HTTP status codes and timestamps
- **Memory Efficient** - Automatically maintains a rolling buffer of the last 500 requests
- **Status Code Highlighting** - Color-coded status badges (green for 2xx, yellow for 3xx, red for 4xx/5xx)
- **Method Badges** - Visual distinction between GET, POST, PUT, DELETE, PATCH, and other HTTP methods
- **Keyboard Support** - Press Enter to search, or use live search as you type
- **Clear Function** - Wipe all captured requests with one click

## Screenshot

<img width="634" height="766" alt="Screenshot from 2025-10-19 23-45-07" src="https://github.com/user-attachments/assets/6b457b04-a3eb-4361-962d-85bdda305662" />

## Installation
### For development:
1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable **Developer mode** (toggle in the top right)
4. Click **Load unpacked** and select the extension folder
5. The extension is now installed!

### For direct use:
Link to the Chrome listing here when available

## Usage

1. Open any webpage
2. Press **F12** to open Chrome DevTools
3. Click the **Network DeepScan** tab (next to Elements, Console, etc.)
4. The extension automatically starts capturing network requests
5. Type in the search box to filter requests by any criteria
6. Click the **▼** arrow next to any request to expand and view details
7. Click **🗑️ Clear** to reset all captured requests

### Search Examples

- Search for an API endpoint: `api/users`
- Search for a status code: `404`
- Search for a response value: `"error"`
- Search for a header: `Authorization`
- Search for a request method: `POST`

## File Structure

```
network-deepscan/
├── manifest.json       # Extension configuration
├── devtools.js         # DevTools panel initialization
├── devtools.html       # DevTools page container
├── panel.html          # Search interface & results display
├── panel.js            # Search logic and request capture
├── styles.css          # UI styling
├── icon.png            # Extension icon (16x16)
└── README.md           # This file
```

## Files Explained

### `manifest.json`
Defines the extension's metadata, permissions, and entry points. Uses Manifest V3 for Chrome's latest security standards.

### `devtools.js`
Creates the DevTools panel when DevTools opens. Minimal setup that displays the panel alongside other DevTools tabs.

### `panel.js`
The core of the extension. Handles:
- Capturing network requests via `chrome.devtools.network.onRequestFinished`
- Searching across all request data
- Rendering results with expandable details
- Memory management (keeps last 500 requests)

### `panel.html` & `styles.css`
User interface with search box, request list, and expandable details view. Styled for DevTools compatibility.

## Technical Details

- **Manifest Version**: 3 (latest Chrome security standards)
- **Max Requests Stored**: 500 (configurable in `panel.js`)
- **Max Body Size**: 5000 characters per response (truncated to save memory)
- **Search Scope**: Full-text search across all request data (URL, method, headers, bodies, status)
- **No External Dependencies**: Vanilla JavaScript, no libraries required

## Limitations

- Only captures requests made while DevTools is open
- Cannot intercept CORS-blocked requests (browser limitation)
- Response bodies larger than 5000 characters are truncated
- Only works within the DevTools context (cannot monitor background requests)

## Tips & Tricks

- **Search as you type** - The search debounces for smooth performance
- **Keyboard shortcut** - Press Enter to search or use live filtering
- **Status codes** - Use color coding to quickly spot errors (red = 4xx/5xx)
- **Method badges** - Easily identify POST vs GET requests at a glance
- **Timestamps** - See when each request was made for debugging timing issues

## Troubleshooting

**The panel doesn't appear in DevTools**
- Make sure DevTools is open (F12)
- Check that the extension is properly loaded in `chrome://extensions/`
- Refresh the DevTools panel (Cmd/Ctrl + R)

**No requests are being captured**
- Make sure DevTools is open before making requests
- The extension only captures while DevTools is active
- Try refreshing the page to generate new requests

**Search is slow**
- This is normal with many requests (500+)
- Click the **🗑️ Clear** button to start fresh
- Close and reopen DevTools if performance degrades

## Future Enhancements

- Export requests as HAR, CSV, or JSON
- Filter by request type or status code
- Copy individual requests as cURL commands
- Request/response size analysis
- Performance timeline visualization
- Persistence across DevTools sessions

## License

This project is open source and available under the MIT License.

## Support

Found a bug or have a feature request? Feel free to create an issue or submit a pull request!
