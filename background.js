
const DEFAULT_SITES = [
  "instagram.com",
  "youtube.com",
  "reddit.com",
  "facebook.com",
  "x.com",
  "twitter.com",
  "pinterest.com"
];

const processed = new Map();

function normalizeHost(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split(/[/?#:]/)[0];
}

function isBlocked(host, sites) {
  const cleanHost = normalizeHost(host);

  return sites.some(site => {
    const cleanSite = normalizeHost(site);

    return cleanSite &&
      (cleanHost === cleanSite ||
       cleanHost.endsWith("." + cleanSite));
  });
}

chrome.runtime.onInstalled.addListener(async () => {
  const data = await chrome.storage.local.get([
    "blockedSites",
    "enabled"
  ]);

  const updates = {};

  if (!Array.isArray(data.blockedSites)) {
    updates.blockedSites = DEFAULT_SITES;
  }

  if (typeof data.enabled !== "boolean") {
    updates.enabled = true;
  }

  if (Object.keys(updates).length) {
    await chrome.storage.local.set(updates);
  }
});

chrome.tabs.onRemoved.addListener(tabId => {
  processed.delete(tabId);
});

chrome.tabs.onUpdated.addListener(
  async (tabId, changeInfo, tab) => {
    if (
      changeInfo.status !== "complete" ||
      !tab.url ||
      !/^https?:/i.test(tab.url)
    ) return;

    if (processed.get(tabId) === tab.url) return;

    processed.set(tabId, tab.url);

    const {
      enabled = true,
      blockedSites = DEFAULT_SITES
    } = await chrome.storage.local.get([
      "enabled",
      "blockedSites"
    ]);

    if (!enabled) return;

    let host;

    try {
      host = new URL(tab.url).hostname;
    } catch {
      return;
    }

    if (!isBlocked(host, blockedSites)) return;

    const {
      distractionCount = 0
    } = await chrome.storage.session.get(
      "distractionCount"
    );

    const level = Math.min(distractionCount + 1, 4);

    await chrome.storage.session.set({
      distractionCount: distractionCount + 1
    });

    const config = {
      level,
      site: host
    };

    try {
      await chrome.scripting.executeScript({
        target: { tabId },
        func: value => {
          window.__FOCUSBUDDY_CONFIG__ = value;
        },
        args: [config]
      });

      await chrome.scripting.executeScript({
        target: { tabId },
        files: ["content.js"]
      });

    } catch (error) {
      console.warn(
        "FocusBuddy could not display on this page:",
        error
      );
    }
  }
);

chrome.runtime.onMessage.addListener(
  (message, sender) => {

    if (
      message?.type === "FOCUSBUDDY_CLOSE_TAB" &&
      sender.tab?.id != null
    ) {
      chrome.tabs.remove(sender.tab.id).catch(() => {});
    }

    if (message?.type === "FOCUSBUDDY_RESET_COUNT") {
      chrome.storage.session.set({
        distractionCount: 0
      });
    }
  }
);
