// Cross-browser compatibility
if (typeof importScripts === 'function') {
  importScripts('constants.js');
}

var ALARM_NAME = 'lichess-puzzler-timer';

chrome.runtime.onInstalled.addListener(async () => {
  var stored = await chrome.storage.sync.get(null);
  if (stored.enabled === undefined) {
    await chrome.storage.sync.set(DEFAULT_SETTINGS);
  }
  await syncAlarm();
});

chrome.runtime.onStartup.addListener(() => {
  syncAlarm();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync') syncAlarm();
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== ALARM_NAME) return;

  var settings = await chrome.storage.sync.get(DEFAULT_SETTINGS);
  if (!settings.enabled || settings.triggerMode !== 'timer') return;

  var reminderUrl = chrome.runtime.getURL('reminder/reminder.html');

  try {
    await chrome.tabs.create({ url: reminderUrl });
  } catch (err) {
    console.error('Failed to create reminder tab:', err);
  }
});

chrome.tabs.onCreated.addListener(async (tab) => {
  var settings = await chrome.storage.sync.get(DEFAULT_SETTINGS);
  if (!settings.enabled || settings.triggerMode !== 'newtab') return;

  if (tab.pendingUrl && tab.pendingUrl !== 'chrome://newtab/' && tab.pendingUrl !== 'about:newtab') return;
  if (tab.url && tab.url !== 'chrome://newtab/' && tab.url !== 'about:newtab' && tab.url !== '') return;

  if (Math.random() * 100 >= settings.newTabProbability) return;

  var reminderUrl = chrome.runtime.getURL('reminder/reminder.html');

  try {
    await chrome.tabs.update(tab.id, { url: reminderUrl });
  } catch (err) {
    console.error('Failed to update tab:', err);
  }
});

async function syncAlarm() {
  var settings = await chrome.storage.sync.get(DEFAULT_SETTINGS);

  await chrome.alarms.clear(ALARM_NAME);

  if (settings.enabled && settings.triggerMode === 'timer') {
    chrome.alarms.create(ALARM_NAME, {
      delayInMinutes: settings.timerInterval,
      periodInMinutes: settings.timerInterval
    });
  }
}
