// RNGdle UIUC - Core Application Engine
(() => {
  const { LOCATIONS, RARITY_TIERS, MAX_WORD_LENGTH, rollLocation } = window.UIUC_RNGDLE;
  const sound = window.soundFX;

  // DOM Elements
  const rollLab = document.getElementById('rollLab');
  const rollBtn = document.getElementById('rollBtn');
  const rollBtnText = document.getElementById('rollBtnText');
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const turboToggleBtn = document.getElementById('turboToggleBtn');
  const autoRollCheck = document.getElementById('autoRollCheck');
  const turboCheck = document.getElementById('turboCheck');
  const shareBtn = document.getElementById('shareBtn');
  const digitRow = document.getElementById('digitRow');

  // Toolbar & Status
  const statusPip = document.getElementById('statusPip');
  const rollCounterText = document.getElementById('rollCounterText');
  const totalEpText = document.getElementById('totalEpText');

  // Readout & Discovery
  const rollStatusLabel = document.getElementById('rollStatusLabel');
  const rollMetaRow = document.getElementById('rollMetaRow');
  const rollRarityBox = document.getElementById('rollRarityBox');
  const rarityPill = document.getElementById('rarityPill');
  const rollScoreBox = document.getElementById('rollScoreBox');
  const metricScore = document.getElementById('metricScore');
  const rollLocationBox = document.getElementById('rollLocationBox');
  const metricLocation = document.getElementById('metricLocation');
  const revealProgress = document.getElementById('revealProgress');
  const progressLabel = document.getElementById('progressLabel');
  const progressCount = document.getElementById('progressCount');
  const progressBar = document.getElementById('progressBar');

  // Badges
  const badgeCountLabel = document.getElementById('badgeCountLabel');
  const badgeList = document.getElementById('badgeList');

  // Modals
  const bankModal = document.getElementById('bankModal');
  const bankModalLink = document.getElementById('bankModalLink');
  const navBankBtn = document.getElementById('navBankBtn');
  const bankRosterList = document.getElementById('bankRosterList');
  const toast = document.getElementById('toast');

  // State
  const STORAGE_KEY = 'rngdle_uiuc_state_v5';
  let state = {
    totalRolls: 0,
    totalEp: 0,
    sound: true,
    turbo: false,
    rarestRarity: null
  };

  let isRolling = false;
  let autoRollTimeout = null;
  let lastRoll = null;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) state = Object.assign(state, JSON.parse(saved));
  } catch (e) {}

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2200);
  }

  // Generate 8 3D Digit Cards (One-to-One with RNGdle DOM)
  function renderInitialCards() {
    digitRow.innerHTML = '';
    for (let i = 0; i < MAX_WORD_LENGTH; i++) {
      const card = document.createElement('div');
      card.className = 'roll-digit';
      card.id = `digit-${i}`;
      card.innerHTML = `
        <div class="roll-card-inner">
          <div class="roll-card-face roll-card-back">
            <span class="roll-card-mark">λ</span>
            <span class="roll-card-index">#${i + 1}</span>
          </div>
          <div class="roll-card-face roll-card-front">
            <span class="digit-val">—</span>
          </div>
        </div>
      `;
      digitRow.appendChild(card);
    }
  }

  function updateToolbar() {
    rollCounterText.textContent = `ROLL #${state.totalRolls} • INFINITE LAB`;
    if (totalEpText) {
      totalEpText.textContent = (state.totalEp || 0).toLocaleString();
    }
    if (state.rarestRarity) {
      const tier = RARITY_TIERS[state.rarestRarity];
      if (tier) {
        statusPip.style.background = tier.color;
        statusPip.style.boxShadow = `0 0 10px ${tier.color}`;
      }
    }
  }

  // Execute Roll with Paced Suspense
  async function executeRoll() {
    if (isRolling) return;
    isRolling = true;
    rollBtn.disabled = true;
    sound.init();

    const targetLoc = rollLocation();
    
    // Empty characters as PREFIX
    const targetWord = targetLoc.word.padStart(MAX_WORD_LENGTH, ' ');

    // 1. Instantly wipe previous roll artifacts so no leftover UI lingers during roll
    rollStatusLabel.textContent = 'REVEALING CAMPUS DIGITS...';
    rollStatusLabel.style.color = '#abbfd9';
    rollMetaRow.style.display = 'none';
    rollLocationBox.style.display = 'none';
    shareBtn.style.display = 'none';
    badgeList.innerHTML = '';
    badgeCountLabel.textContent = 'AWAITING REVEAL...';
    metricLocation.innerHTML = '—';
    rarityPill.innerHTML = '';
    rollLab.style.removeProperty('--roll-accent');
    
    revealProgress.style.display = 'grid';
    progressBar.style.width = '0%';
    progressCount.textContent = `0 / ${MAX_WORD_LENGTH}`;

    // Reset cards to back
    for (let i = 0; i < MAX_WORD_LENGTH; i++) {
      const card = document.getElementById(`digit-${i}`);
      card.className = 'roll-digit';
      const frontVal = card.querySelector('.digit-val');
      frontVal.textContent = '—';
    }

    // Paced Sequential Card Reveals (Adaptive to Turbo)
    for (let i = 0; i < MAX_WORD_LENGTH; i++) {
      const card = document.getElementById(`digit-${i}`);
      const frontVal = card.querySelector('.digit-val');

      card.classList.add('is-next');
      progressLabel.textContent = `Revealing digit ${i + 1} of ${MAX_WORD_LENGTH}...`;
      progressCount.textContent = `${i} / ${MAX_WORD_LENGTH}`;
      progressBar.style.width = `${(i / MAX_WORD_LENGTH) * 100}%`;

      const suspenseDuration = state.turbo ? 60 : 320;
      const spinIntervalTime = state.turbo ? 20 : 50;

      await new Promise(resolve => {
        const spinInterval = setInterval(() => {
          sound.playTick(i);
        }, spinIntervalTime);

        setTimeout(() => {
          clearInterval(spinInterval);
          resolve();
        }, suspenseDuration);
      });

      const finalChar = targetWord[i];
      const isEmpty = (finalChar === ' ');

      frontVal.textContent = isEmpty ? '␣' : finalChar;

      card.classList.remove('is-next');
      card.classList.add('is-turning');
      sound.playReelStop(i, isEmpty);

      await new Promise(r => setTimeout(r, state.turbo ? 40 : 200));
      card.classList.add('is-locked');
      if (isEmpty) card.classList.add('empty-slot');

      await new Promise(r => setTimeout(r, state.turbo ? 30 : 160));
      card.classList.remove('is-turning');
    }

    progressBar.style.width = '100%';
    progressCount.textContent = `${MAX_WORD_LENGTH} / ${MAX_WORD_LENGTH}`;
    await new Promise(r => setTimeout(r, state.turbo ? 50 : 220));
    revealProgress.style.display = 'none';

    finalizeDiscovery(targetLoc, targetWord);
  }

  // Finalize Discovery (Zero description fluff)
  async function finalizeDiscovery(loc, targetWord) {
    const tier = RARITY_TIERS[loc.rarity];

    // Sort badges from least to most rarity
    const RANK = { common: 1, uncommon: 2, rare: 3, epic: 4, anomaly: 5, mythic: 6 };
    const sortedBadges = [...loc.badges].sort((a, b) => {
      return (RANK[a.rarity] || 0) - (RANK[b.rarity] || 0);
    });

    // Calculate roll EP: base tier EP + all badge scores
    const badgeEpTotal = sortedBadges.reduce((sum, b) => {
      const bTier = RARITY_TIERS[b.rarity] || RARITY_TIERS.common;
      return sum + (bTier.score || 20);
    }, 0);
    const rollEp = (tier.baseEp || 100) + badgeEpTotal;

    lastRoll = { loc, targetWord, rollEp, timestamp: new Date() };

    // 1. Prepare elements, but KEEP LOCATION, ROLL TYPE, AND RARITY HIDDEN until all badges show!
    metricLocation.innerHTML = `${loc.word}${loc.implied ? `<span class="implied-text">${loc.implied}</span>` : ''}`;
    rollLocationBox.style.display = 'none'; // Keep hidden!
    rollMetaRow.style.display = 'none'; // Keep rarity pill & EP score hidden!
    rollStatusLabel.textContent = 'ANALYZING ATTRIBUTES...';
    rollStatusLabel.style.color = '#abbfd9';

    // 2. Render Badges sequentially upwards one at a time (least to most rarity)
    badgeList.innerHTML = '';
    badgeCountLabel.textContent = sortedBadges.length > 0 ? `REVEALING BADGES (0 / ${sortedBadges.length})...` : '0 BADGES';

    const badgeInterval = state.turbo ? 120 : 750;

    for (let bIdx = 0; bIdx < sortedBadges.length; bIdx++) {
      await new Promise(r => setTimeout(r, badgeInterval));

      const b = sortedBadges[bIdx];
      const bTier = RARITY_TIERS[b.rarity] || RARITY_TIERS.common;

      const li = document.createElement('li');
      li.className = 'roll-badge';
      li.style.setProperty('--badge-color', bTier.color);
      li.style.setProperty('--badge-bg', bTier.bg);
      li.style.setProperty('--badge-border', bTier.border);

      li.innerHTML = `
        <div class="roll-badge-heading">
          <div class="roll-badge-icon">${bTier.emoji}</div>
          <div class="roll-badge-name">
            <h3>${b.name}</h3>
            <span class="roll-badge-tier">${bTier.label}</span>
          </div>
          <div class="roll-badge-points">
            +${bTier.score}
            <small>EP</small>
          </div>
        </div>
      `;

      badgeList.prepend(li);
      sound.playBadgeReveal(b.rarity);
      badgeCountLabel.textContent = `${bIdx + 1} / ${sortedBadges.length} REVEALED`;
    }

    // 3. NOW AND ONLY NOW: All badges are shown, reveal Location, Roll Type & Rarity!
    await new Promise(r => setTimeout(r, state.turbo ? 80 : 350));

    rollLab.style.setProperty('--roll-accent', tier.color);

    rollLocationBox.style.display = 'block';

    rollStatusLabel.textContent = `${tier.emoji} ${tier.label.toUpperCase()} DISCOVERED`;
    rollStatusLabel.style.color = tier.color;

    rarityPill.style.background = tier.bg;
    rarityPill.style.color = tier.color;
    rarityPill.style.border = `1px solid ${tier.border}`;
    rarityPill.style.boxShadow = `0 0 16px ${tier.bg}`;
    rarityPill.innerHTML = `${tier.emoji} ${tier.label}`;

    metricScore.textContent = `+${rollEp} EP`;
    rollMetaRow.style.display = 'flex';

    badgeCountLabel.textContent = `${sortedBadges.length} BADGES`;
    sound.playRarityFanfare(loc.rarity);

    state.totalRolls++;
    state.totalEp = (state.totalEp || 0) + rollEp;

    if (!state.rarestRarity || RANK[loc.rarity] > RANK[state.rarestRarity]) {
      state.rarestRarity = loc.rarity;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}

    updateToolbar();
    shareBtn.style.display = 'inline-block';

    isRolling = false;
    rollBtn.disabled = false;
    rollBtnText.textContent = 'Roll next location';

    if (autoRollCheck.checked) {
      const autoDelay = state.turbo ? 600 : 2000;
      autoRollTimeout = setTimeout(() => {
        if (autoRollCheck.checked) executeRoll();
      }, autoDelay);
    }
  }

  function shareRoll() {
    if (!lastRoll) return;
    const { loc, targetWord, rollEp } = lastRoll;
    const tier = RARITY_TIERS[loc.rarity];

    let reelStr = '';
    for (let i = 0; i < targetWord.length; i++) {
      const ch = targetWord[i];
      reelStr += `[ ${ch === ' ' ? '␣' : ch} ]`;
    }

    const RANK = { common: 1, uncommon: 2, rare: 3, epic: 4, anomaly: 5, mythic: 6 };
    const sortedBadges = [...loc.badges].sort((a, b) => (RANK[a.rarity] || 0) - (RANK[b.rarity] || 0));
    const badgeStr = sortedBadges.map(b => `${b.name} (${RARITY_TIERS[b.rarity]?.emoji || '⚪'})`).join(' • ');

    const text = `🔶 RNGdle UIUC #${state.totalRolls}\n` +
      `📍 ${loc.word} ${loc.implied || ''} ${tier.emoji} [${tier.label}]\n` +
      `⚡ Score: +${rollEp} EP\n` +
      `🎰 ${reelStr}\n` +
      `🏷️ ${badgeStr}\n` +
      `🌐 https://rngdle.uiuc.edu`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast('Copied roll to clipboard!');
      });
    } else {
      showToast('Clipboard copy failed.');
    }
  }

  function populateBankModal() {
    bankRosterList.innerHTML = '';
    LOCATIONS.forEach(loc => {
      const tier = RARITY_TIERS[loc.rarity];
      const row = document.createElement('div');
      row.className = 'codex-row';
      row.innerHTML = `
        <div class="codex-row-header">
          <div class="codex-title">
            <span>${tier.emoji}</span>
            <span>${loc.word}</span>
            <span style="color: var(--color-lab-muted); font-size: 11px;">${loc.implied || ''}</span>
          </div>
          <span style="font-size: 8px; text-transform: uppercase; padding: 2px 5px; border-radius: 4px; background: ${tier.bg}; color: ${tier.color}; border: 1px solid ${tier.border};">
            ${tier.label}
          </span>
        </div>
        <div class="codex-chips">
          ${loc.badges.map(b => {
            const bTier = RARITY_TIERS[b.rarity] || RARITY_TIERS.common;
            return `<span class="codex-chip">${bTier.emoji} ${b.name}</span>`;
          }).join('')}
        </div>
      `;
      bankRosterList.appendChild(row);
    });
  }

  function setTurbo(enabled) {
    state.turbo = !!enabled;
    if (turboToggleBtn) {
      turboToggleBtn.classList.toggle('active', state.turbo);
      turboToggleBtn.textContent = state.turbo ? '⚡ Turbo: ON' : '⚡ Turbo: OFF';
    }
    if (turboCheck) {
      turboCheck.checked = state.turbo;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
    showToast(state.turbo ? 'Turbo enabled' : 'Turbo disabled');
  }

  // Restore Turbo state on load
  if (state.turbo) {
    if (turboToggleBtn) {
      turboToggleBtn.classList.add('active');
      turboToggleBtn.textContent = '⚡ Turbo: ON';
    }
    if (turboCheck) {
      turboCheck.checked = true;
    }
  }

  rollBtn.addEventListener('click', () => executeRoll());
  shareBtn.addEventListener('click', () => shareRoll());

  soundToggleBtn.addEventListener('click', () => {
    const on = sound.toggle();
    soundToggleBtn.classList.toggle('active', on);
    soundToggleBtn.textContent = on ? '🔊 Sound' : '🔇 Muted';
    showToast(on ? 'Sound enabled' : 'Sound muted');
  });

  if (turboToggleBtn) {
    turboToggleBtn.addEventListener('click', () => {
      setTurbo(!state.turbo);
    });
  }

  if (turboCheck) {
    turboCheck.addEventListener('change', e => {
      setTurbo(e.target.checked);
    });
  }

  [bankModalLink, navBankBtn].forEach(el => {
    if (el) el.addEventListener('click', () => {
      populateBankModal();
      bankModal.classList.add('open');
    });
  });

  document.querySelectorAll('.modal-close-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const modalId = e.target.getAttribute('data-close');
      if (modalId) document.getElementById(modalId).classList.remove('open');
    });
  });

  bankModal.addEventListener('click', e => {
    if (e.target === bankModal) bankModal.classList.remove('open');
  });

  window.addEventListener('keydown', e => {
    if ((e.code === 'Space' || e.code === 'Enter') && !isRolling) {
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        executeRoll();
      }
    }
    if (e.code === 'Escape') {
      bankModal.classList.remove('open');
    }
  });

  renderInitialCards();
  updateToolbar();
})();
