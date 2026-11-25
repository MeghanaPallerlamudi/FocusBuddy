
const defaults = [
  "instagram.com",
  "youtube.com",
  "reddit.com",
  "facebook.com",
  "x.com",
  "twitter.com",
  "pinterest.com"
];

const $ = id => document.getElementById(id);

let sites = [];

function cleanSite(value) {
  return value.trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split(/[/?#:]/)[0];
}

function render() {
  $("site-count").textContent = `${sites.length} sites`;
  $("site-list").innerHTML = "";

  sites.forEach(site => {
    const li = document.createElement("li");

    const name = document.createElement("span");
    name.textContent = site;

    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "×";
    remove.setAttribute("aria-label", `Remove ${site}`);

    remove.addEventListener("click", async () => {
      sites = sites.filter(item => item !== site);

      await chrome.storage.local.set({
        blockedSites: sites
      });

      render();
    });

    li.append(name, remove);
    $("site-list").append(li);
  });
}

async function init() {
  const data = await chrome.storage.local.get([
    "enabled",
    "blockedSites"
  ]);

  sites = Array.isArray(data.blockedSites)
    ? data.blockedSites
    : defaults;

  $("enabled").checked = data.enabled !== false;

  updateStatus();
  render();
}

function updateStatus() {
  const on = $("enabled").checked;

  $("status").textContent = on ? "ON" : "OFF";
  $("status").classList.toggle("off", !on);
}

$("enabled").addEventListener("change", async () => {
  await chrome.storage.local.set({
    enabled: $("enabled").checked
  });

  updateStatus();
});

$("add-form").addEventListener("submit", async event => {
  event.preventDefault();

  const site = cleanSite($("new-site").value);

  if (!site || !site.includes(".") || /\s/.test(site)) {
    return;
  }

  if (!sites.includes(site)) {
    sites.push(site);

    await chrome.storage.local.set({
      blockedSites: sites
    });

    render();
  }

  $("new-site").value = "";
});

$("reset").addEventListener("click", () => {
  chrome.runtime.sendMessage({
    type: "FOCUSBUDDY_RESET_COUNT"
  });
});

init();
