(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const monthInput = $('#monthInput');
  const today = new Date();
  monthInput.value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

  const themes = [
    ['midnight', 'Midnight'], ['sunset', 'Sunset'], ['pastel', 'Pastel'], ['film', 'Film'], ['scrapbook', 'Scrapbook'],
    ['retro', 'Retro'], ['glass', 'Glass'], ['newspaper', 'Newspaper'], ['minimal', 'Minimal'], ['bw', 'Black & White']
  ];
  const cardStyles = [
    ['editorial', 'Editorial'], ['neon', 'Neon'], ['scrapbook', 'Scrapbook'],
    ['poster', 'Poster'], ['playlist', 'Playlist'], ['paper', 'Paper']
  ];
  const moods = [
    ['😂', 'Happy'], ['🥲', 'Emotional'], ['🔥', 'Productive'], ['😴', 'Exhausted'], ['❤️', 'Romantic'],
    ['🧠', 'Focused'], ['🎢', 'Chaotic'], ['🌱', 'Growing'], ['✈️', 'Adventurous'], ['😌', 'Peaceful']
  ];
  const state = {
    month: monthInput.value, score: 8.7, moods: ['🔥', '😂', '🌱'], moment: '', song: '', movie: '', place: '', achievement: '', quote: '', person: '', theme: 'midnight', style: 'editorial', format: 'story'
  };
  const questions = [
    { key: 'score', eyebrow: 'THE HEADLINE', prompt: 'How would you rate this month?', help: 'No pressure. It is your month, your scale.', type: 'score' },
    { key: 'moods', eyebrow: 'THE VIBE CHECK', prompt: 'Pick the moods that showed up.', help: 'Choose up to three. The mix is the story.', type: 'moods' },
    { key: 'moment', eyebrow: 'CORE MEMORY', prompt: 'What was the best moment?', help: 'A tiny detail is enough to bring it all back.', type: 'text', placeholder: 'e.g. rooftop dinner with my people' },
    { key: 'song', eyebrow: 'ON REPEAT', prompt: 'What soundtracked your month?', help: 'Song, artist, album — whatever had you in a loop.', type: 'text', placeholder: 'e.g. “Manchild” — Sabrina Carpenter' },
    { key: 'movie', eyebrow: 'FAVOURITE FRAME', prompt: 'Your favourite watch?', help: 'A movie, show, YouTube rabbit hole — it all counts.', type: 'text', placeholder: 'e.g. The Summer I Turned Pretty' },
    { key: 'place', eyebrow: 'PIN DROPPED', prompt: 'Where did you feel most alive?', help: 'Could be a city, a café, or somebody’s couch.', type: 'text', placeholder: 'e.g. Park Street, Kolkata' },
    { key: 'achievement', eyebrow: 'YOU DID THAT', prompt: 'What are you proud of?', help: 'Big, small, chaotic — give yourself the credit.', type: 'text', placeholder: 'e.g. finally finished my portfolio' },
    { key: 'quote', eyebrow: 'THE PULL QUOTE', prompt: 'Describe the month in one line.', help: 'The feeling, in your own words.', type: 'text', placeholder: 'e.g. somehow survived, somehow thrived' }
  ];
  let questionIndex = 0;

  function monthName(short = false) {
    const [year, month] = state.month.split('-').map(Number);
    return new Intl.DateTimeFormat('en-US', { month: short ? 'short' : 'long', year: 'numeric' }).format(new Date(year, month - 1, 1));
  }
  function personality() {
    const ms = state.moods;
    if (ms.includes('🔥') || state.score >= 9) return 'PRODUCTIVE ARC';
    if (ms.includes('🎢')) return 'CHAOS MONTH';
    if (ms.includes('🌱')) return 'GROWTH MONTH';
    if (ms.includes('❤️')) return 'MAIN CHARACTER MONTH';
    if (ms.includes('😴')) return 'SURVIVAL MODE';
    if (ms.includes('✈️')) return 'ADVENTURE MONTH';
    return 'CORE MEMORY MONTH';
  }
  function themeClass() { return `theme-${state.theme}`; }
  function esc(value) { const d = document.createElement('div'); d.textContent = value || ''; return d.innerHTML; }
  function moodLabel(icon) { const item = moods.find(x => x[0] === icon); return item ? item[1] : ''; }
  function cardHTML() {
    const moodText = state.moods.length ? state.moods : ['✦'];
    const title = state.quote || state.moment || 'A month in the making.';
    const statA = state.achievement ? 'WIN' : 'MOOD';
    const statB = state.song ? 'SONG' : 'SCORE';
    const statC = state.place ? 'PLACE' : 'ERA';
    const valA = state.achievement ? '✦' : moodText[0];
    const valB = state.song ? '♪' : `${state.score}`;
    const valC = state.place ? '⌁' : '2026';
    return `<div class="card-top"><span>${esc(monthName(true).toUpperCase())}</span><span class="card-brand">YOUR MONTH WRAPPED</span></div>
      <div><div class="card-score">${Number(state.score).toFixed(1)} <small>/ 10</small></div><div class="card-moods">${moodText.slice(0, 3).map(m => `<span class="card-mood">${m} ${esc(moodLabel(m))}</span>`).join('')}</div></div>
      <div class="card-personality">✦ ${personality()}</div>
      <div class="card-stats"><div class="card-stat"><b>${valA}</b>${statA}</div><div class="card-stat"><b>${valB}</b>${statB}</div><div class="card-stat"><b>${valC}</b>${statC}</div></div>
      <div class="card-highlight"><b>THE TAKEAWAY</b>${esc(title.slice(0, 78))}</div>`;
  }
  function paintCards() {
    ['#miniCard', '#finalCard'].forEach(selector => {
      const card = $(selector); if (!card) return;
      card.className = `share-card ${themeClass()} style-${state.style} ${selector === '#miniCard' ? 'mini-card' : 'final-card'}`;
      card.innerHTML = cardHTML();
    });
  }
  function show(name) {
    $$('.screen').forEach(el => el.classList.remove('active'));
    $(`#${name}`).classList.add('active');
    window.scrollTo(0, 0);
    if (name === 'questions') renderQuestion();
    if (name === 'result') { paintCards(); renderThemes(); renderStyles(); }
    if (name === 'history') renderHistory();
  }
  function renderQuestion() {
    const q = questions[questionIndex];
    $('#questionCount').textContent = `${questionIndex + 1} / ${questions.length}`;
    $('#questionProgress').style.width = `${((questionIndex + 1) / questions.length) * 100}%`;
    let answer = '';
    if (q.type === 'score') answer = `<div class="score-value"><span id="scoreDisplay">${Number(state.score).toFixed(1)}</span><small> / 10</small></div><input class="score-range" id="scoreInput" type="range" min="1" max="10" step="0.1" value="${state.score}"><div class="range-labels"><span>rough month</span><span>all-time great</span></div>`;
    if (q.type === 'moods') answer = `<div class="option-grid">${moods.map(([icon, label]) => `<button class="choice ${state.moods.includes(icon) ? 'active' : ''}" data-mood="${icon}"><span>${icon}</span>${label}</button>`).join('')}</div>`;
    if (q.type === 'text') answer = `<input class="answer-input" id="textAnswer" maxlength="100" autocomplete="off" value="${esc(state[q.key])}" placeholder="${esc(q.placeholder)}" />`;
    $('#questionArea').innerHTML = `<p class="eyebrow">${q.eyebrow}</p><h2 class="question-prompt">${q.prompt}</h2><p class="question-help">${q.help}</p>${answer}`;
    const field = $('#textAnswer');
    if (field) field.addEventListener('input', () => { state[q.key] = field.value; paintCards(); });
    const score = $('#scoreInput');
    if (score) score.addEventListener('input', () => { state.score = +score.value; $('#scoreDisplay').textContent = state.score.toFixed(1); paintCards(); });
    $$('.choice').forEach(btn => btn.addEventListener('click', () => {
      const icon = btn.dataset.mood;
      if (state.moods.includes(icon)) state.moods = state.moods.filter(m => m !== icon);
      else if (state.moods.length < 3) state.moods.push(icon);
      else { toast('Pick up to 3 moods'); return; }
      renderQuestion(); paintCards();
    }));
    paintCards();
  }
  function nextQuestion() { if (questionIndex === questions.length - 1) { state.month = monthInput.value; show('result'); } else { questionIndex++; renderQuestion(); } }
  function renderThemes() {
    $('#themePicker').innerHTML = themes.map(([id, name]) => `<button class="theme-dot theme-${id} ${state.theme === id ? 'active' : ''}" data-name="${name}" data-theme="${id}" aria-label="${name} theme"></button>`).join('');
    $('#themeName').textContent = (themes.find(t => t[0] === state.theme) || [null, 'Midnight'])[1].toUpperCase();
    $$('.theme-dot').forEach(dot => dot.addEventListener('click', () => { state.theme = dot.dataset.theme; paintCards(); renderThemes(); }));
  }
  function renderStyles() {
    $('#stylePicker').innerHTML = cardStyles.map(([id, name]) => `<button class="style-option ${state.style === id ? 'active' : ''}" data-style="${id}" aria-label="${name} card style"><span>${name}</span></button>`).join('');
    $('#styleName').textContent = (cardStyles.find(item => item[0] === state.style) || [null, 'Editorial'])[1].toUpperCase();
    $$('.style-option').forEach(option => option.addEventListener('click', () => { state.style = option.dataset.style; paintCards(); renderStyles(); }));
  }
  function getHistory() { try { return JSON.parse(localStorage.getItem('yw-months') || '[]'); } catch { return []; } }
  function saveMonth() {
    const saved = getHistory(); const record = { month: state.month, score: state.score, theme: state.theme, style: state.style, quote: state.quote, moment: state.moment, savedAt: Date.now() };
    const filtered = saved.filter(x => x.month !== record.month); filtered.unshift(record); localStorage.setItem('yw-months', JSON.stringify(filtered));
    $('#saveMonth').textContent = '♥'; toast('Saved to your archive');
  }
  function renderHistory() {
    const saved = getHistory().sort((a,b) => b.month.localeCompare(a.month));
    $('#historyStats').innerHTML = `<div class="history-stat"><b>${saved.length}</b><span>MONTHS WRAPPED</span></div><div class="history-stat"><b>${saved.length ? (saved.reduce((n,x) => n + Number(x.score),0)/saved.length).toFixed(1) : '—'}</b><span>AVERAGE SCORE</span></div>`;
    $('#historyList').innerHTML = saved.length ? saved.map(item => `<div class="history-row"><span>${esc(new Intl.DateTimeFormat('en-US',{month:'long',year:'numeric'}).format(new Date(item.month+'-02')))}</span><b>${Number(item.score).toFixed(1)}</b></div>`).join('') : '<p class="empty-history">Nothing here yet. Your first wrap is waiting.</p>';
  }
  const exportPalettes = {
    midnight:['#d7ff6f','#806ec8','#245b73'], sunset:['#ffd678','#ff8876','#a957b7'], pastel:['#fcdcf6','#cce7ff','#beecc4'], film:['#f0e7d1','#b49b71','#72534d'], scrapbook:['#f9b7c7','#f9d79c','#92d0c5'], retro:['#ffc26c','#ed697b','#6960a9'], glass:['#bcecff','#b5c9ff','#e1c7fb'], newspaper:['#f1ebdc','#d4c4a9','#a29284'], minimal:['#f4f4ef','#deded7','#c4c7bf'], bw:['#fafafa','#c8c8c8','#666']
  };
  function paintExportBackground(ctx, w, h) {
    const palette = exportPalettes[state.theme] || exportPalettes.midnight;
    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, palette[0]); gradient.addColorStop(.48, palette[1]); gradient.addColorStop(1, palette[2]);
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = .36; ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(w * .96, h * .07, w * .31, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#276b70'; ctx.beginPath(); ctx.arc(-w * .09, h * 1.03, w * .30, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
  }
  function cropText(ctx, text, width) { let value = String(text || ''); while (value && ctx.measureText(value).width > width) value = `${value.slice(0, -2)}...`; return value; }
  function drawWrapped(ctx, text, x, y, width, lineHeight, maxLines) {
    const words = String(text || '').trim().split(/\s+/); let line = ''; let lines = 0;
    for (const word of words) { const candidate = line ? `${line} ${word}` : word; if (ctx.measureText(candidate).width > width && line) { ctx.fillText(line, x, y + lines * lineHeight); lines++; if (lines >= maxLines) return; line = word; } else line = candidate; }
    if (line && lines < maxLines) ctx.fillText(cropText(ctx, line, width), x, y + lines * lineHeight);
  }
  function drawHeader(ctx, w, pad, ink, light) {
    ctx.fillStyle = ink; ctx.font = '700 25px Arial, sans-serif'; ctx.fillText(monthName(true).toUpperCase(), pad, 82);
    ctx.fillStyle = light; ctx.textAlign = 'right'; ctx.font = '600 18px Arial, sans-serif'; ctx.fillText('YOUR MONTH WRAPPED', w - pad, 82); ctx.textAlign = 'left';
  }
  function drawMoods(ctx, x, y, ink, maxWidth) {
    let cursor = x; ctx.font = '700 19px Arial, sans-serif';
    (state.moods.length ? state.moods : ['']).slice(0, 3).forEach((mood, index) => { const label = moodLabel(mood) || 'Your vibe'; const text = cropText(ctx, label.toUpperCase(), 138); const width = Math.min(ctx.measureText(text).width + 31, 168); if (cursor + width > x + maxWidth) return; ctx.strokeStyle = `${ink}88`; ctx.lineWidth = 2; ctx.strokeRect(cursor, y - 27, width, 42); ctx.fillStyle = ink; ctx.fillText(text, cursor + 15, y); cursor += width + 12; });
  }
  function drawStats(ctx, x, y, width, ink, line) {
    const items = [[state.achievement ? 'WIN' : 'VIBE', state.achievement ? 'MADE IT HAPPEN' : (moodLabel(state.moods[0]) || 'YOUR WAY')], [state.song ? 'SONG' : 'SCORE', state.song ? 'ON REPEAT' : `${Number(state.score).toFixed(1)} OUT OF 10`], [state.place ? 'PLACE' : 'ERA', state.place ? 'FELT LIKE HOME' : 'ONE FOR THE BOOKS']];
    const cell = width / 3; ctx.strokeStyle = line; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + width, y); ctx.stroke();
    items.forEach((item, index) => { const left = x + index * cell; ctx.fillStyle = ink; ctx.font = '700 31px Arial, sans-serif'; ctx.fillText(item[0], left, y + 51); ctx.globalAlpha = .72; ctx.font = '600 15px Arial, sans-serif'; drawWrapped(ctx, item[1], left, y + 78, cell - 15, 17, 2); ctx.globalAlpha = 1; });
  }
  function drawQuoteBox(ctx, x, y, width, height, ink, paper) {
    ctx.fillStyle = paper; ctx.fillRect(x, y, width, height); ctx.fillStyle = ink; ctx.font = '700 17px Arial, sans-serif'; ctx.fillText('THE TAKEAWAY', x + 28, y + 43); ctx.font = '700 43px Georgia, serif'; drawWrapped(ctx, state.quote || state.moment || 'A month in the making.', x + 28, y + 101, width - 56, 51, 2);
  }
  function renderExport() {
    const canvas = $('#exportCanvas'); const formats = { story:[1080,1920], post:[1080,1350], square:[1080,1080] }; const [w, h] = formats[state.format];
    canvas.width = w; canvas.height = h; const ctx = canvas.getContext('2d'); const pad = 82; const ink = '#15151b'; const quote = state.quote || state.moment || 'A month in the making.';
    ctx.textBaseline = 'alphabetic'; paintExportBackground(ctx, w, h);
    if (state.style === 'neon') { ctx.fillStyle = '#160b2d'; ctx.fillRect(0, 0, w, h); ctx.fillStyle = '#ec6aff'; ctx.beginPath(); ctx.arc(w * .93, h * .13, w * .34, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#82efff'; ctx.globalAlpha = .8; ctx.beginPath(); ctx.arc(w * .08, h * .82, w * .28, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; }
    if (state.style === 'poster') { ctx.fillStyle = '#18161d'; ctx.fillRect(0, 0, w, h); ctx.fillStyle = '#ef4f5c'; ctx.fillRect(0, h * .52, w, h * .26); ctx.fillStyle = '#ffbd5b'; ctx.fillRect(0, h * .78, w, h * .22); }
    if (state.style === 'playlist') { ctx.fillStyle = '#123044'; ctx.fillRect(0, 0, w, h); ctx.fillStyle = '#77d8df'; ctx.globalAlpha = .9; ctx.beginPath(); ctx.arc(w * .84, h * .17, w * .42, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; }
    if (state.style === 'paper') { ctx.fillStyle = '#eee8da'; ctx.fillRect(0, 0, w, h); ctx.strokeStyle = '#b2aa9955'; ctx.lineWidth = 2; for (let y = 42; y < h; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); } }
    const darkStyle = ['neon', 'poster', 'playlist'].includes(state.style); const mainInk = darkStyle ? '#ffffff' : ink; const muted = darkStyle ? '#ffffffaa' : '#15151b99';
    drawHeader(ctx, w, pad, mainInk, muted);
    if (state.style === 'poster') {
      ctx.fillStyle = '#ffffff'; ctx.font = '700 250px Arial Black, Arial, sans-serif'; ctx.fillText(Number(state.score).toFixed(1), pad, h * .37); ctx.font = '700 28px Arial, sans-serif'; ctx.fillText('OUT OF 10', pad + 505, h * .37); ctx.font = '700 78px Arial Black, Arial, sans-serif'; drawWrapped(ctx, personality(), pad, h * .61, w - pad * 2, 82, 2); drawMoods(ctx, pad, h * .75, '#15151b', w - pad * 2); drawQuoteBox(ctx, pad, h * .78, w - pad * 2, h * .17, '#15151b', '#fff4dc');
    } else if (state.style === 'scrapbook') {
      ctx.fillStyle = ink; ctx.font = '700 230px Georgia, serif'; ctx.fillText(Number(state.score).toFixed(1), pad, h * .31); ctx.font = '700 26px Arial, sans-serif'; ctx.fillText('/ 10', pad + 470, h * .29); ctx.save(); ctx.translate(pad, h * .39); ctx.rotate(-.04); ctx.fillStyle = '#fff8e8'; ctx.fillRect(0, 0, w - pad * 2, h * .18); ctx.fillStyle = ink; ctx.font = '700 71px Georgia, serif'; drawWrapped(ctx, `+ ${personality()}`, 28, h * .09, w - pad * 2 - 56, 76, 2); ctx.restore(); drawMoods(ctx, pad, h * .64, ink, w - pad * 2); drawStats(ctx, pad, h * .72, w - pad * 2, ink, '#15151b55'); drawQuoteBox(ctx, pad, h * .80, w - pad * 2, h * .16, ink, '#fff8e9');
    } else if (state.style === 'playlist') {
      ctx.fillStyle = '#ffffff'; ctx.font = '700 26px Arial, sans-serif'; ctx.fillText('THE SOUND OF', pad, h * .20); ctx.font = '700 88px Georgia, serif'; drawWrapped(ctx, monthName(), pad, h * .28, w - pad * 2, 93, 2); ctx.fillStyle = '#aaffee'; ctx.font = '700 218px Arial Black, Arial, sans-serif'; ctx.fillText(Number(state.score).toFixed(1), pad, h * .47); ctx.fillStyle = '#fff'; ctx.font = '700 64px Georgia, serif'; drawWrapped(ctx, personality(), pad, h * .59, w - pad * 2, 69, 2); drawMoods(ctx, pad, h * .70, '#fff', w - pad * 2); drawStats(ctx, pad, h * .77, w - pad * 2, '#fff', '#ffffff66'); drawQuoteBox(ctx, pad, h * .80, w - pad * 2, h * .16, ink, '#d9fff1');
    } else {
      ctx.fillStyle = mainInk; ctx.font = '700 225px Georgia, serif'; ctx.fillText(Number(state.score).toFixed(1), pad, h * .29); ctx.font = '700 29px Arial, sans-serif'; ctx.fillText('/ 10', pad + 476, h * .27); drawMoods(ctx, pad, h * .35, mainInk, w - pad * 2); ctx.font = '700 76px Georgia, serif'; ctx.fillStyle = mainInk; drawWrapped(ctx, `+ ${personality()}`, pad, h * .48, w - pad * 2, 81, 2); drawStats(ctx, pad, h * .63, w - pad * 2, mainInk, darkStyle ? '#ffffff66' : '#15151b66'); drawQuoteBox(ctx, pad, h * .79, w - pad * 2, h * .13, ink, '#fffdf0e8');
    }
    return canvas;
  }
  function download() { const a=document.createElement('a');a.download=`${monthName(true).toLowerCase().replace(' ','-')}-wrapped-${state.format}.png`;a.href=renderExport().toDataURL('image/png');a.click();toast('Your card is downloading'); }
  async function share() { const canvas=renderExport(); if (!navigator.share) { download(); return; } canvas.toBlob(async blob=>{try{const file=new File([blob],'my-month-wrapped.png',{type:'image/png'});const data={title:'My Month Wrapped',text:`${monthName()} was a ${state.score}/10. ${state.quote || 'My month, in one story.'}`,files:[file]};if(navigator.canShare?.(data))await navigator.share(data);else await navigator.share({title:data.title,text:data.text});}catch(err){if(err.name!=='AbortError')download();}}); }
  function summary() { return `${monthName()} was a ${Number(state.score).toFixed(1)}/10. ${state.moods.join(' ')} ${personality()}${state.quote ? ` — “${state.quote}”` : ''}`; }
  async function copy() { try{await navigator.clipboard.writeText(summary());toast('Summary copied');}catch{toast('Could not access clipboard');} }
  let toastTimer; function toast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2500)}

  $$('[data-go]').forEach(btn => btn.addEventListener('click', () => { if(btn.dataset.go === 'questions') state.month=monthInput.value; show(btn.dataset.go); }));
  $('#openHistory').addEventListener('click',()=>show('history')); $('#nextQuestion').addEventListener('click',nextQuestion); $('#skipQuestion').addEventListener('click',nextQuestion); $('#downloadButton').addEventListener('click',download); $('#shareButton').addEventListener('click',share); $('#copyButton').addEventListener('click',copy); $('#saveMonth').addEventListener('click',saveMonth); $('#restartButton').addEventListener('click',()=>{questionIndex=0;show('setup')});
  $$('.format-tab').forEach(tab=>tab.addEventListener('click',()=>{$$('.format-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');state.format=tab.dataset.format;paintCards();}));
  if ('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
  paintCards();
})();
