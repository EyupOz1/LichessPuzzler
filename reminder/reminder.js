(async function init() {
  var settings = await chrome.storage.sync.get(DEFAULT_SETTINGS);
  applyColorTheme(settings.colorTheme);

  var themeList = settings.themes.length > 0 ? settings.themes : ['mix'];
  var chosen = themeList[Math.floor(Math.random() * themeList.length)];

  var puzzleUrl = chosen === 'mix'
    ? 'https://lichess.org/training'
    : 'https://lichess.org/training/' + chosen;

  var themeEntry = THEMES.find(t => t.id === chosen);
  document.getElementById('theme-label').textContent = themeEntry ? themeEntry.label : chosen;

  document.getElementById('start-btn').addEventListener('click', () => {
    window.location.href = puzzleUrl;
  });

  document.getElementById('skip-btn').addEventListener('click', () => {
    window.close();
  });
})();
