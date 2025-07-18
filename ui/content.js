let helperVisible = false;
let helperPanel = null;
const API_URL = "http://localhost:3000/analyze"; // Update with your backend URL

function createHelperPanel() {
  helperPanel = document.createElement("div");
  helperPanel.id = "dsa-buddy-panel";

  const header = document.createElement("div");
  header.id = "dsa-buddy-header";
  header.textContent = "DSA Buddy";

  const closeButton = document.createElement("button");
  closeButton.id = "dsa-buddy-close";
  closeButton.textContent = "×";
  closeButton.onclick = toggleHelper;
  header.appendChild(closeButton);

  const content = document.createElement("div");
  content.id = "dsa-buddy-content";

  const promptLabel = document.createElement("label");
  promptLabel.id = "dsa-buddy-label";
  promptLabel.textContent = "Ask about your code:";

  const promptInput = document.createElement("textarea");
  promptInput.id = "dsa-buddy-prompt";
  promptInput.placeholder = "E.g., Why is my solution getting Time Limit Exceeded?";

  const analyzeButton = document.createElement("button");
  analyzeButton.id = "dsa-buddy-submit";
  analyzeButton.textContent = "Submit";
  analyzeButton.onclick = analyzeCode;

  const responseArea = document.createElement("div");
  responseArea.id = "dsa-buddy-response";
  responseArea.textContent = "Responses will appear here...";

  content.appendChild(promptLabel);
  content.appendChild(promptInput);
  content.appendChild(analyzeButton);
  content.appendChild(responseArea);

  helperPanel.appendChild(header);
  helperPanel.appendChild(content);
  document.body.appendChild(helperPanel);
}

function formatResponseWithCodeBlocks(text) {
  let formattedHtml = '';
  let currentPos = 0;
  const codeBlockRegex = /```([a-zA-Z]*)\n([\s\S]*?)```/g;
  let match;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    formattedHtml += text.substring(currentPos, match.index).replace(/\n/g, '<br>');
    const language = match[1] || 'plaintext';
    const code = match[2].trim();
    formattedHtml += `
      <div class="dsa-buddy-code-block">
        <div class="dsa-buddy-copy-wrapper">
          <button class="dsa-buddy-copy-btn" data-code="${encodeURIComponent(code)}">Copy</button>
        </div>
        <pre><code class="language-${language}">${escapeHTML(code)}</code></pre>
      </div>
    `;
    currentPos = match.index + match[0].length;
  }

  formattedHtml += text.substring(currentPos).replace(/\n/g, '<br>');
  return formattedHtml;
}

function escapeHTML(str) {
  return str.replace(/[&<>"']/g, match => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[match]));
}

function setupCodeCopyButtons() {
  document.querySelectorAll('.dsa-buddy-copy-btn').forEach(button => {
    button.addEventListener('click', function() {
      const code = decodeURIComponent(this.getAttribute('data-code'));
      navigator.clipboard.writeText(code).then(() => {
        const originalText = this.textContent;
        this.textContent = 'Copied!';
        this.classList.add('copied');
        setTimeout(() => {
          this.textContent = originalText;
          this.classList.remove('copied');
        }, 2000);
      });
    });
  });
}

async function analyzeCode() {
  const responseArea = document.getElementById('dsa-buddy-response');
  responseArea.innerHTML = `<div class="dsa-buddy-loader"><div class="spinner"></div><div>Analyzing your code...</div></div>`;

  const userPrompt = document.getElementById('dsa-buddy-prompt').value;
  if (!userPrompt) {
    responseArea.textContent = "Please enter a question about your code.";
    return;
  }

  const { title, description, code } = extractProblemDetails();
  if (!code) {
    responseArea.textContent = "Could not extract your code. Make sure you're on a LeetCode problem page with code in the editor.";
    return;
  }

  try {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', API_URL, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          try {
            const data = JSON.parse(xhr.responseText);
            if (data.output) {
              responseArea.innerHTML = formatResponseWithCodeBlocks(data.output);
              setupCodeCopyButtons();
            } else {
              responseArea.textContent = "No analysis returned.";
            }
          } catch (parseError) {
            responseArea.textContent = "Error processing the response from the server.";
          }
        } else {
          responseArea.textContent = `Error: Server returned status ${xhr.status}`;
        }
      }
    };
    xhr.onerror = function() {
      responseArea.textContent = "Error connecting to analysis service.";
    };
    xhr.send(JSON.stringify({ question: title, description, code, userPrompt }));
  } catch (error) {
    responseArea.textContent = "Error connecting to analysis service.";
  }
}

function toggleHelper() {
  if (helperVisible) {
    helperPanel.style.display = "none";
  } else {
    if (!helperPanel) {
      createHelperPanel();
    } else {
      helperPanel.style.display = "flex";
    }
  }
  helperVisible = !helperVisible;
}

function extractProblemDetails() {
  const questionElement = document.querySelector('.text-title-large a');
  const title = questionElement?.textContent.trim() || '';
  const descriptionElement = document.querySelector('[data-track-load="description_content"]');
  const description = descriptionElement instanceof HTMLElement ? descriptionElement.innerText.trim() : '';
  const code = (document.querySelector('.view-lines')?.textContent || '').trim();
  return { title, description, code };
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "toggleHelper") {
    toggleHelper();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.altKey && event.key === 'd') {
    toggleHelper();
  }
});
