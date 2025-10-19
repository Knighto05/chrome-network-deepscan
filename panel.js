const requests = [];

chrome.devtools.network.onRequestFinished.addListener(request => {
  request.getContent(body => {
    requests.push({
      url: request.request.url,
      method: request.request.method,
      requestHeaders: request.request.headers,
      postData: request.request.postData,
      responseHeaders: request.response.headers,
      body
    });
  });
});

document.getElementById("search").addEventListener("click", () => {
  const query = document.getElementById("query").value.toLowerCase().trim();
  const resultsDiv = document.getElementById("results");
  resultsDiv.textContent = "";

  if (!query) {
    resultsDiv.textContent = "Please enter a search term.";
    return;
  }

  const matches = requests.filter(r => JSON.stringify(r).toLowerCase().includes(query));

  if (!matches.length) {
    resultsDiv.textContent = "No matches found.";
    return;
  }

  resultsDiv.innerHTML = matches
    .map(m => `<div class="match">✅ ${m.method} ${m.url}</div>`)
    .join("\n");
});
