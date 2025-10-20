const requests = [];
const MAX_REQUESTS = 500;
let debounceTimer;

chrome.devtools.network.onRequestFinished.addListener(request => {
  request.getContent((body) => {
    try {
      const truncatedBody = body && body.length > 5000 ? body.substring(0, 5000) + "..." : body;
      
      requests.unshift({
        id: Date.now() + Math.random(),
        url: request.request.url,
        method: request.request.method,
        status: request.response.status,
        statusText: request.response.statusText,
        requestHeaders: request.request.headers || [],
        postData: request.request.postData,
        responseHeaders: request.response.headers || [],
        body: truncatedBody,
        timestamp: new Date().toLocaleTimeString()
      });

      if (requests.length > MAX_REQUESTS) {
        requests.pop();
      }

      updateRequestCount();
    } catch (err) {
      console.error("Error processing request:", err);
    }
  });
});

function updateRequestCount() {
  const countEl = document.getElementById("request-count");
  if (countEl) {
    countEl.textContent = `Captured: ${requests.length} requests`;
  }
}

function escapeHtml(text) {
  if (!text) return "";
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

function highlightMatch(text, query) {
  if (!text || !query) return escapeHtml(text);
  
  const escapedText = escapeHtml(text);
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\')})`, 'gi');

  return escapedText.replace(regex, '<mark>$1</mark>');
}

function formatJson(str) {
  try {
    const obj = JSON.parse(str);
    return JSON.stringify(obj, null, 2);
  } catch {
    return str;
  }
}

function renderResults(matches) {
  const resultsDiv = document.getElementById("results");
  const query = document.getElementById("query").value.trim();
  resultsDiv.innerHTML = "";

  if (!matches.length) {
    resultsDiv.innerHTML = '<div class="no-results">No matches found.</div>';
    return;
  }

  matches.forEach(m => {
    const statusClass = m.status >= 400 ? "status-error" : m.status >= 300 ? "status-redirect" : "status-ok";
    const resultItem = document.createElement("div");
    resultItem.className = "result-item";
    
    const highlightedUrl = highlightMatch(m.url, query);
    const highlightedHeaders = highlightMatch(JSON.stringify(m.requestHeaders, null, 2), query);
    const highlightedPostData = m.postData ? highlightMatch(formatJson(m.postData.text || m.postData), query) : "";
    const highlightedResponseHeaders = highlightMatch(JSON.stringify(m.responseHeaders, null, 2), query);
    const highlightedBody = highlightMatch(formatJson(m.body || ""), query);
    
    resultItem.innerHTML = `
      <div class="result-header">
        <span class="method ${m.method.toLowerCase()}">${m.method}</span>
        <span class="status ${statusClass}">${m.status} ${m.statusText}</span>
        <span class="url">${highlightedUrl}</span>
        <span class="timestamp">${m.timestamp}</span>
        <button class="expand-btn" data-id="${m.id}">▼</button>
      </div>
      <div class="result-details" id="details-${m.id}" style="display: none;">
        <div class="detail-section">
          <h4 class="section-toggle" data-section-id="req-headers-${m.id}">▼ Request Headers</h4>
          <pre id="req-headers-${m.id}">${highlightedHeaders}</pre>
        </div>
        ${m.postData ? `
          <div class="detail-section">
            <h4 class="section-toggle" data-section-id="req-body-${m.id}">▼ Request Body</h4>
            <pre id="req-body-${m.id}">${highlightedPostData}</pre>
          </div>
        ` : ""}
        <div class="detail-section">
          <h4 class="section-toggle" data-section-id="res-headers-${m.id}">▼ Response Headers</h4>
          <pre id="res-headers-${m.id}">${highlightedResponseHeaders}</pre>
        </div>
        <div class="detail-section">
          <h4 class="section-toggle" data-section-id="res-body-${m.id}">▼ Response Body</h4>
          <pre id="res-body-${m.id}">${highlightedBody}</pre>
        </div>
      </div>
    `;
    
    resultsDiv.appendChild(resultItem);

    resultItem.querySelector(".expand-btn").addEventListener("click", () => {
      const details = document.getElementById(`details-${m.id}`);
      const btn = resultItem.querySelector(".expand-btn");
      const isHidden = details.style.display === "none";
      details.style.display = isHidden ? "block" : "none";
      btn.textContent = isHidden ? "▲" : "▼";
    });

    // Add section toggles for individual headers/body sections
    resultItem.querySelectorAll(".section-toggle").forEach(toggle => {
      toggle.addEventListener("click", () => {
        const sectionId = toggle.dataset.sectionId;
        const preElement = document.getElementById(sectionId);
        const isHidden = preElement.style.display === "none";
        preElement.style.display = isHidden ? "block" : "none";
        toggle.textContent = (isHidden ? "▼" : "▶") + " " + toggle.textContent.slice(2);
      });
    });
  });
}

function performSearch() {
  const query = document.getElementById("query").value.toLowerCase().trim();
  const resultsDiv = document.getElementById("results");

  if (!query) {
    resultsDiv.innerHTML = '<div class="no-results">Please enter a search term.</div>';
    return;
  }

  const matches = requests.filter(r => 
    JSON.stringify(r).toLowerCase().includes(query)
  );

  renderResults(matches);
}

document.getElementById("query").addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(performSearch, 300);
});

document.getElementById("clear").addEventListener("click", () => {
  if (confirm("Clear all captured requests?")) {
    requests.length = 0;
    document.getElementById("results").innerHTML = '<div class="no-results">All requests cleared. Waiting for new requests...</div>';
    updateRequestCount();
  }
});

console.log("Network DeepScan panel loaded");
updateRequestCount();