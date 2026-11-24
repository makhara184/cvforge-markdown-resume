const DEFAULT_MD = `# Your Full Name
City, Country | email@example.com | github.com/makhara184

## Professional Summary
Operations and business-focused graduate with hands-on experience in client negotiation, pipeline tracking, and workflow optimization.

## Experience
### Sales & Operations Coordinator — Family Automotive Trading
- Managed end-to-end customer inquiries, vehicle pricing negotiations, and closing documentation.
- Streamlined inventory follow-ups, improving turnaround time across active leads.

## Key Projects
### DealFlow CRM & SprintBoard Ops
- Built lightweight browser tools for tracking sales pipelines, project milestones, and RAID logs.

## Skills
- Project Coordination, Business Analysis, Stakeholder Communication, Excel/Sheets, GIS Basics`;

const mdInput = document.getElementById("mdInput");
const preview = document.getElementById("preview");
const wordCount = document.getElementById("wordCount");
const themeSelect = document.getElementById("themeSelect");

mdInput.value = localStorage.getItem("cvforge_md") || DEFAULT_MD;

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function parseMarkdown(md) {
  const lines = md.split(/\r?\n/);
  let html = "";
  let inList = false;
  for (const raw of lines) {
    const line = escapeHtml(raw.trim());
    if (!line) {
      if (inList) { html += "</ul>"; inList = false; }
      continue;
    }
    if (line.startsWith("- ")) {
      if (!inList) { html += "<ul>"; inList = true; }
      html += `<li>${line.slice(2).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")}</li>`;
    } else {
      if (inList) { html += "</ul>"; inList = false; }
      if (line.startsWith("### ")) html += `<h3>${line.slice(4)}</h3>`;
      else if (line.startsWith("## ")) html += `<h2>${line.slice(3)}</h2>`;
      else if (line.startsWith("# ")) html += `<h1>${line.slice(2)}</h1>`;
      else html += `<p>${line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")}</p>`;
    }
  }
  if (inList) html += "</ul>";
  return html;
}

function render() {
  localStorage.setItem("cvforge_md", mdInput.value);
  preview.innerHTML = parseMarkdown(mdInput.value);
  const words = mdInput.value.trim().split(/\s+/).filter(Boolean).length;
  wordCount.textContent = `${words} words`;
}

mdInput.addEventListener("input", render);
themeSelect.addEventListener("change", () => {
  preview.className = `resume ${themeSelect.value}`;
});
render();
