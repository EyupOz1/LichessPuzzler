var currentTimerMinutes = 60;

document.addEventListener('DOMContentLoaded', async () => {
  buildThemeGrid();
  buildColorSwatches();
  await loadSettings();
  bindEvents();
});

function buildThemeGrid() {
  var grid = document.querySelector('#themes-grid');
  grid.replaceChildren();
  THEMES.forEach(t => {
    var label = document.createElement('label');
    label.className = 'theme-chip';
    var input = document.createElement('input');
    input.type = 'checkbox';
    input.value = t.id;
    var span = document.createElement('span');
    span.textContent = t.label;
    label.appendChild(input);
    label.appendChild(span);
    grid.appendChild(label);
  });
}

function buildColorSwatches() {
  var container = document.querySelector('#color-swatches');
  container.replaceChildren();
  Object.keys(COLOR_THEMES).forEach(id => {
    var swatch = document.createElement('div');
    swatch.className = 'color-swatch';
    swatch.dataset.theme = id;
    swatch.style.background = COLOR_THEMES[id].accent;
    swatch.title = id;
    container.appendChild(swatch);
  });
}

async function loadSettings() {
  var settings = await chrome.storage.sync.get(DEFAULT_SETTINGS);

  document.querySelector('#enabled').checked = settings.enabled;

  var modeRadio = document.querySelector('input[name="triggerMode"][value="' + settings.triggerMode + '"]');
  if (modeRadio) modeRadio.checked = true;

  currentTimerMinutes = settings.timerInterval;
  selectTimerPreset(currentTimerMinutes);

  document.querySelector('#newTabProbability').value = settings.newTabProbability;
  document.querySelector('#probability-value').textContent = settings.newTabProbability + '%';

  applyColorTheme(settings.colorTheme);
  document.querySelectorAll('.color-swatch').forEach(sw => {
    sw.classList.toggle('active', sw.dataset.theme === settings.colorTheme);
  });

  document.querySelectorAll('#themes-grid input[type="checkbox"]').forEach(cb => {
    cb.checked = settings.themes.includes(cb.value);
  });

  updateVisibility(settings.triggerMode);
}

function selectTimerPreset(minutes) {
  var presetBtns = document.querySelectorAll('#timer-presets button[data-minutes]');
  var matched = false;

  presetBtns.forEach(btn => {
    if (btn.dataset.minutes === 'custom') return;
    var isMatch = parseInt(btn.dataset.minutes) === minutes;
    btn.classList.toggle('active', isMatch);
    if (isMatch) matched = true;
  });

  var customBtn = document.querySelector('#custom-timer-btn');
  var customInput = document.querySelector('#custom-timer');

  if (!matched) {
    customBtn.classList.add('active');
    customBtn.textContent = minutes + 'm';
    customInput.style.display = 'flex';
    document.querySelector('#customMinutes').value = minutes;
  } else {
    customBtn.classList.remove('active');
    customBtn.textContent = '...';
    customInput.style.display = 'none';
  }
}

function bindEvents() {
  document.querySelector('#enabled').addEventListener('change', save);

  document.querySelectorAll('input[name="triggerMode"]').forEach(radio => {
    radio.addEventListener('change', () => {
      updateVisibility(radio.value);
      save();
    });
  });

  document.querySelectorAll('#timer-presets button').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.minutes === 'custom') {
        var customInput = document.querySelector('#custom-timer');
        var showing = customInput.style.display !== 'none';
        if (showing) {
          customInput.style.display = 'none';
          btn.classList.remove('active');
        } else {
          customInput.style.display = 'flex';
          btn.classList.add('active');
          document.querySelector('#customMinutes').focus();
          // deselect preset buttons
          document.querySelectorAll('#timer-presets button:not(#custom-timer-btn)').forEach(b => {
            b.classList.remove('active');
          });
        }
        return;
      }

      currentTimerMinutes = parseInt(btn.dataset.minutes);
      selectTimerPreset(currentTimerMinutes);
      save();
    });
  });

  document.querySelector('#customMinutes').addEventListener('change', (e) => {
    var val = parseInt(e.target.value);
    if (val && val >= 1 && val <= 1440) {
      currentTimerMinutes = val;
      document.querySelector('#custom-timer-btn').textContent = val + 'm';
      save();
    } else if (val > 1440) {
      e.target.value = 1440;
      currentTimerMinutes = 1440;
      document.querySelector('#custom-timer-btn').textContent = '1440m';
      save();
    }
  });

  document.querySelector('#newTabProbability').addEventListener('input', () => {
    document.querySelector('#probability-value').textContent =
      document.querySelector('#newTabProbability').value + '%';
  });
  document.querySelector('#newTabProbability').addEventListener('change', save);

  document.querySelectorAll('#themes-grid input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => {
      var checked = document.querySelectorAll('#themes-grid input[type="checkbox"]:checked');
      if (checked.length === 0) {
        cb.checked = true;
        return;
      }
      save();
    });
  });

  document.querySelector('#color-swatches').addEventListener('click', (e) => {
    var swatch = e.target.closest('.color-swatch');
    if (!swatch) return;
    document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
    swatch.classList.add('active');
    applyColorTheme(swatch.dataset.theme);
    save();
  });
}

function updateVisibility(mode) {
  document.querySelector('#timer-settings').classList.toggle('visible', mode === 'timer');
  document.querySelector('#probability-settings').classList.toggle('visible', mode === 'newtab');
}

async function save() {
  var themes = Array.from(document.querySelectorAll('#themes-grid input[type="checkbox"]:checked'))
    .map(cb => cb.value);

  var activeSwatch = document.querySelector('.color-swatch.active');
  var colorTheme = activeSwatch ? activeSwatch.dataset.theme : 'crimson';

  var settings = {
    enabled: document.querySelector('#enabled').checked,
    triggerMode: document.querySelector('input[name="triggerMode"]:checked').value,
    timerInterval: Math.max(1, currentTimerMinutes),
    themes: themes,
    newTabProbability: parseInt(document.querySelector('#newTabProbability').value),
    colorTheme: colorTheme
  };

  await chrome.storage.sync.set(settings);
  showStatus('Settings saved');
}

function showStatus(msg) {
  var el = document.querySelector('#status');
  el.textContent = msg;
  el.classList.add('visible');
  setTimeout(() => el.classList.remove('visible'), 1500);
}
