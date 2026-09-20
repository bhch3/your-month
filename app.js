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
  const moods = [
    ['😂', 'Happy'], ['🥲', 'Emotional'], ['🔥', 'Productive'], ['😴', 'Exhausted'], ['❤️', 'Romantic'],
    ['🧠', 'Focused'], ['🎢', 'Chaotic'], ['🌱', 'Growing'], ['✈️', 'Adventurous'], ['😌', 'Peaceful']
  ];
  const state = {
    month: monthInput.value, score: 8.7, moods: ['🔥', '😂', '🌱'], moment: '', song: '', movie: '', place: '', achievement: '', quote: '', person: '', theme: 'midnight', format: 'story'
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
      card.className = `share-card ${themeClass()} ${selector === '#miniCard' ? 'mini-card' : 'final-card'}`;
      card.innerHTML = cardHTML();
    });
  }
  function show(name) {
    $$('.screen').forEach(el => el.classList.remove('active'));
    $(`#${name}`).classList.add('active');
    window.scrollTo(0, 0);
    if (name === 'questions') renderQuestion();
    if (name === 'result') { paintCards(); renderThemes(); }
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
  function getHistory() { try { return JSON.parse(localStorage.getItem('yw-months') || '[]'); } catch { return []; } }
  function saveMonth() {
    const saved = getHistory(); const record = { month: state.month, score: state.score, theme: state.theme, quote: state.quote, moment: state.moment, savedAt: Date.now() };
    const filtered = saved.filter(x => x.month !== record.month); filtered.unshift(record); localStorage.setItem('yw-months', JSON.stringify(filtered));
    $('#saveMonth').textContent = '♥'; toast('Saved to your archive');
  }
  function renderHistory() {
    const saved = getHistory().sort((a,b) => b.month.localeCompare(a.month));
    $('#historyStats').innerHTML = `<div class="history-stat"><b>${saved.length}</b><span>MONTHS WRAPPED</span></div><div class="history-stat"><b>${saved.length ? (saved.reduce((n,x) => n + Number(x.score),0)/saved.length).toFixed(1) : '—'}</b><span>AVERAGE SCORE</span></div>`;
    $('#historyList').innerHTML = saved.length ? saved.map(item => `<div class="history-row"><span>${esc(new Intl.DateTimeFormat('en-US',{month:'long',year:'numeric'}).format(new Date(item.month+'-02')))}</span><b>${Number(item.score).toFixed(1)}</b></div>`).join('') : '<p class="empty-history">Nothing here yet. Your first wrap is waiting.</p>';
  }
  function canvasTheme(ctx, w, h) {
    const colors = { midnight:['#d7ff6f','#796cc6','#295b72'], sunset:['#ffda7a','#ff8b76','#a957b7'], pastel:['#fbd9f5','#cbe8ff','#b5edc6'], film:['#efe7d1','#b79e74','#76524e'], scrapbook:['#f8b5c6','#f9dda1','#9ed8cb'], retro:['#ffc06b','#ec6b7b','#6962ac'], glass:['#bbebff','#b5c9ff','#e4c9fd'], newspaper:['#f2eddf','#d7c7ae','#a49688'], minimal:['#f5f5f1','#dadbd3','#bac0b1'], bw:['#fff','#c6c6c6','#5e5e5e'] };
    const c = colors[state.theme] || colors.midnight; const g = ctx.createLinearGradient(0,0,w,h); g.addColorStop(0,c[0]);g.addColorStop(.48,c[1]);g.addColorStop(1,c[2]);ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    ctx.globalAlpha=.45;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(w*.9,h*.08,w*.31,0,Math.PI*2);ctx.fill();ctx.fillStyle='#3d7d8c';ctx.beginPath();ctx.arc(-w*.06,h*.94,w*.29,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
  }
  function wrappedText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 3) { const words = text.split(/\s+/); let line=''; let lines=0; for(const word of words){const test=line?line+' '+word:word;if(ctx.measureText(test).width>maxWidth&&line){ctx.fillText(line,x,y+lines*lineHeight);lines++;if(lines>=maxLines)return;line=word}else line=test}if(line&&lines<maxLines)ctx.fillText(line,x,y+lines*lineHeight); }
  function renderExport() {
    const canvas = $('#exportCanvas'); const formats = { story:[1080,1920], post:[1080,1350], square:[1080,1080] }; const [w,h] = formats[state.format]; canvas.width=w; canvas.height=h; const ctx=canvas.getContext('2d'); canvasTheme(ctx,w,h); const pad=84;
    ctx.fillStyle='#15151a';ctx.font='500 25px "DM Mono", monospace';ctx.letterSpacing='4px';ctx.fillText(monthName(true).toUpperCase(),pad,94);ctx.textAlign='right';ctx.globalAlpha=.6;ctx.fillText('YOUR MONTH WRAPPED',w-pad,94);ctx.textAlign='left';ctx.globalAlpha=1;
    ctx.font='700 245px Georgia, serif';ctx.letterSpacing='-18px';ctx.fillText(Number(state.score).toFixed(1),pad,350);ctx.font='600 38px Arial';ctx.letterSpacing='0';ctx.fillText('/ 10',pad+500,336);
    let mx=pad;ctx.font='600 29px Arial';state.moods.slice(0,3).forEach(icon=>{const t=`${icon}  ${moodLabel(icon)}`;const width=ctx.measureText(t).width+38;ctx.strokeStyle='#15151a99';ctx.lineWidth=2;ctx.strokeRect(mx,396,width,52);ctx.fillText(t,mx+16,430);mx+=width+15});
    ctx.font='700 86px Georgia,serif';wrappedText(ctx,`✦ ${personality()}`,pad,560,w-pad*2,90,2);
    const statY=h*.59;ctx.strokeStyle='#15151a66';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(pad,statY);ctx.lineTo(w-pad,statY);ctx.stroke(); const stats=[[state.achievement?'✦':'🔥',state.achievement?'WIN':'MOOD'],[state.song?'♪':Number(state.score).toFixed(1),state.song?'SONG':'SCORE'],[state.place?'⌁':'2026',state.place?'PLACE':'ERA']];stats.forEach((s,i)=>{const x=pad+i*((w-pad*2)/3);ctx.font='700 72px Georgia,serif';ctx.fillText(s[0],x,statY+91);ctx.font='500 22px "DM Mono", monospace';ctx.fillText(s[1],x,statY+126)});
    const boxY=h*.77;ctx.fillStyle='#fffdf2dd';ctx.fillRect(pad,boxY,w-pad*2, h*.13);ctx.fillStyle='#15151a';ctx.font='500 20px "DM Mono",monospace';ctx.fillText('THE TAKEAWAY',pad+28,boxY+43);ctx.font='600 48px Georgia,serif';wrappedText(ctx,(state.quote||state.moment||'A month in the making.').slice(0,100),pad+28,boxY+103,w-pad*2-56,54,2);
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
