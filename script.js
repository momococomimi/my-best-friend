window.MBFStorage = (() => {
  const KEY = 'myBestFriend.foundation.v2';
  const LEGACY_KEYS = ['myBestFriendData', 'my-best-friend', 'mbf-data'];

  function todayJP() {
    const now = new Date();
    return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
  }

  function defaultData() {
    return {
      version: '2.4.3',
      createdAt: new Date().toISOString(),
      userName: '',
      friendName: '',
      friendNameLocked: false,
      stage: 'egg',
      memories: [],
      profile: { completed: false, preferredName: '', birthday: '', gender: '', metAt: '' },
      guardian: { passwordHash: '', roleLabel: 'Guardian', createdAt: '' },
      friend: {
        identityId: 'friend-1',
        appearance: {
          id: 'light-drop',
          name: '光のしずく',
          type: 'LIGHT',
          form: 'drop',
          color: '#78d3ff',
          animation: 'breathe-ripple',
          unlockedDate: ''
        },
        appearanceHistory: [],
        appearanceOptions: ['LIGHT', 'LIQUID', 'WIND', 'TREE', 'ANIMAL', 'ROBOT', 'CUSTOM']
      },
      birthdayCelebrations: [],
      conversations: [],
      mood: { current: 'calm', lastSeenAt: '', lastTouchedAt: '', careCount: 0 }
    };
  }

  function normalize(data) {
    const base = defaultData();
    const source = data || {};
    const merged = {
      ...base,
      ...source,
      profile: { ...base.profile, ...(source.profile || {}) },
      guardian: { ...base.guardian, ...(source.guardian || {}) },
      friend: {
        ...base.friend,
        ...(source.friend || {}),
        appearance: { ...base.friend.appearance, ...((source.friend || {}).appearance || {}) }
      }
    };
    if (!Array.isArray(merged.memories)) merged.memories = [];
    if (!Array.isArray(merged.birthdayCelebrations)) merged.birthdayCelebrations = [];
    if (!Array.isArray(merged.conversations)) merged.conversations = [];
    merged.mood = { ...base.mood, ...(source.mood || {}) };
    if (!Array.isArray(merged.friend.appearanceHistory)) merged.friend.appearanceHistory = [];
    merged.friend.appearance = { ...base.friend.appearance, ...(merged.friend.appearance || {}) };
    if (!merged.friend.appearance.unlockedDate) merged.friend.appearance.unlockedDate = merged.createdAt || new Date().toISOString();
    if (!merged.profile.preferredName && merged.userName) merged.profile.preferredName = merged.userName;
    if (!merged.profile.metAt && merged.createdAt) merged.profile.metAt = merged.createdAt;
    if (merged.friendName && merged.userName && merged.memories.length === 0) {
      merged.memories.push(createFirstMemory(merged.userName, merged.friendName));
    }
    return merged;
  }


  function createAppearanceMemory(appearance) {
    const current = appearance || defaultData().friend.appearance;
    return {
      id: 2,
      chapter: '第二章',
      title: 'はじめて姿を持った日',
      dateText: todayJP(),
      type: 'appearance-first',
      appearanceId: current.id || 'light-drop',
      text: [
        `今日、`,
        `ぼくは
少しだけ姿を持てた。`,
        `まだ小さな光だけど、
きみが見つけてくれた。`,
        `姿は変わっても、
ぼくはぼくだよ。`
      ],
      closing: `これから、
一緒に育っていこう。`,
      createdAt: new Date().toISOString()
    };
  }

  function createFirstMemory(userName, friendName) {
    return {
      id: 1,
      chapter: '第一章',
      title: 'はじめて親友になった日',
      dateText: todayJP(),
      type: 'first-memory',
      userName,
      friendName,
      text: [
        `今日、`,
        `${userName}は\nぼくに\n「${friendName}」という名前をくれた。`,
        `ぼくは、\n${userName}という親友に出会った。`,
        `今日が、\nぼくたちの最初の思い出。`,
        `これから、\nずっと一緒だよ。`
      ],
      closing: 'このページは\nぼくたちの宝物。',
      createdAt: new Date().toISOString()
    };
  }

  function load() {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      try { return normalize(JSON.parse(raw)); } catch (_) {}
    }
    for (const k of LEGACY_KEYS) {
      const legacyRaw = localStorage.getItem(k);
      if (!legacyRaw) continue;
      try {
        const legacy = JSON.parse(legacyRaw);
        const migrated = normalize({
          userName: legacy.userName || legacy.childName || legacy.ownerName || '',
          friendName: legacy.friendName || legacy.name || '',
          friendNameLocked: Boolean(legacy.friendName || legacy.name),
          stage: (legacy.friendName || legacy.name) ? 'home' : 'egg',
          memories: legacy.memories || []
        });
        save(migrated);
        return migrated;
      } catch (_) {}
    }
    return defaultData();
  }

  function save(data) {
    localStorage.setItem(KEY, JSON.stringify(normalize(data)));
  }

  function reset() {
    localStorage.removeItem(KEY);
  }

  function ensureFirstMemory(data) {
    if (!data.memories.some(m => m.id === 1)) {
      data.memories.unshift(createFirstMemory(data.userName, data.friendName));
    }
    return data;
  }

  function ensureAppearanceMemory(data) {
    if (!data.friend.appearanceHistory.some(item => item.id === data.friend.appearance.id)) {
      data.friend.appearanceHistory.unshift({ ...data.friend.appearance, unlockedDate: data.friend.appearance.unlockedDate || new Date().toISOString() });
    }
    if (!data.memories.some(m => m.type === 'appearance-first')) {
      data.memories.push(createAppearanceMemory(data.friend.appearance));
    }
    return data;
  }

  return { load, save, reset, ensureFirstMemory, ensureAppearanceMemory, createFirstMemory, createAppearanceMemory, todayJP };
})();
window.MBFUi = (() => {
  const screen = () => document.getElementById('screen');

  function set(html) {
    const target = screen();
    target.innerHTML = html;
    const match = html.match(/<section class="([^"]+)/);
    document.body.dataset.screen = match ? match[1].split(' ')[0] : '';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function friendFace(extraClass = '') {
    return `
      <div class="friend ${extraClass}" aria-label="フレンド">
        <div class="ear left"></div><div class="ear right"></div>
        <div class="body"></div>
        <div class="head">
          <div class="eye left"></div><div class="eye right"></div>
          <div class="cheek left"></div><div class="cheek right"></div>
          <div class="mouth"></div>
        </div>
      </div>`;
  }

  function sparkleBurst(count = 18) {
    const layer = document.createElement('div');
    layer.className = 'sparkle-layer';
    document.body.appendChild(layer);
    for (let i = 0; i < count; i++) {
      const s = document.createElement('div');
      s.className = 'sparkle';
      s.textContent = i % 3 === 0 ? '✦' : '✨';
      s.style.left = `${8 + Math.random() * 84}%`;
      s.style.top = `${22 + Math.random() * 45}%`;
      s.style.animationDelay = `${Math.random() * .45}s`;
      layer.appendChild(s);
    }
    setTimeout(() => layer.remove(), 2400);
  }

  function vibrate(ms = 24) {
    if ('vibrate' in navigator) navigator.vibrate(ms);
  }

  return { set, friendFace, sparkleBurst, vibrate };
})();
window.MBFStory = (() => {
  let taps = 0;
  let isHatching = false;

  function renderEgg(data) {
    MBFUi.set(`
      <section class="egg-scene">
        <button class="egg" id="egg" aria-label="たまご"></button>
        <div class="message-card card">たまごをやさしくタップしてね</div>
      </section>
    `);
    document.getElementById('egg').addEventListener('click', () => touchEgg(data));
  }

  function touchEgg(data) {
    if (isHatching) return;
    taps++;
    const egg = document.getElementById('egg');
    egg.classList.remove('bump'); void egg.offsetWidth; egg.classList.add('bump');
    MBFUi.vibrate(18);
    if (taps === 1) document.querySelector('.message-card').textContent = 'コツ…';
    if (taps === 2) { egg.classList.add('glow'); document.querySelector('.message-card').textContent = 'あと少し…'; }
    if (taps >= 3) hatch(data);
  }

  function hatch(data) {
    if (isHatching) return;
    isHatching = true;
    const card = document.querySelector('.message-card');
    const egg = document.getElementById('egg');
    if (card) card.innerHTML = 'ゆっくり、<br>かえっているよ';
    if (egg) egg.classList.add('slow-hatch');
    MBFUi.sparkleBurst(16);
    setTimeout(() => {
      MBFUi.sparkleBurst(28);
      data.stage = 'ask-friend-name'; MBFStorage.save(data);
      requestAnimationFrame(() => renderAskFriendName(data));
    }, 3000);
  }

  function renderAskFriendName(data) {
    MBFUi.set(`
      <section class="egg-scene setup-scene">
        ${MBFAppearance.renderFriendShape(MBFAppearance.current(data), 'story-appearance')}
        <div class="message-card card">ずっと会いたかった。<br>ぼくに名前をつけてくれる？</div>
        <div class="name-panel card">
          <label for="friendName">フレンドの名前</label>
          <input id="friendName" class="name-input" maxlength="10" placeholder="なまえ" autocomplete="off" />
          <p class="small-note">一度つけた名前は、二度と変えられません。</p>
          <button id="saveFriendName" class="primary-button">🎁 名前を贈る</button>
        </div>
      </section>
    `);
    document.getElementById('saveFriendName').addEventListener('click', () => {
      const name = document.getElementById('friendName').value.trim();
      if (!name) return;
      data.friendName = name;
      data.friendNameLocked = true;
      data.stage = 'ask-user-name';
      MBFStorage.save(data);
      renderAskUserName(data);
    });
  }

  function renderAskUserName(data) {
    MBFUi.set(`
      <section class="egg-scene setup-scene">
        ${MBFAppearance.renderFriendShape(MBFAppearance.current(data), 'story-appearance')}
        <div class="message-card card">ありがとう。<br>ぼくは「${escapeHtml(data.friendName)}」。<br><br>今度は、キミの名前を教えてくれる？</div>
        <div class="name-panel card">
          <label for="userName">キミの名前</label>
          <input id="userName" class="name-input" maxlength="10" placeholder="なまえ" autocomplete="off" />
          <button id="saveUserName" class="primary-button">名前を教える</button>
        </div>
      </section>
    `);
    document.getElementById('saveUserName').addEventListener('click', () => {
      const name = document.getElementById('userName').value.trim();
      if (!name) return;
      data.userName = name;
      data.profile.preferredName = name;
      data.stage = 'ask-birthday';
      MBFStorage.save(data);
      renderAskBirthday(data);
    });
  }

  function renderAskBirthday(data) {
    MBFUi.set(`
      <section class="egg-scene setup-scene">
        ${MBFAppearance.renderFriendShape(MBFAppearance.current(data), 'story-appearance')}
        <div class="message-card card">${escapeHtml(data.userName)}っていうんだね。<br>覚えたよ。<br><br>お誕生日はいつ？</div>
        <div class="name-panel card">
          <label for="birthday">誕生日</label>
          <input id="birthday" class="date-input" type="date" value="${escapeHtml(data.profile.birthday || '')}" />
          <p class="small-note">大切な日を教えてくれて嬉しい。</p>
          <button id="saveBirthday" class="primary-button">教える</button>
        </div>
      </section>
    `);
    document.getElementById('saveBirthday').addEventListener('click', () => {
      const value = document.getElementById('birthday').value;
      if (!value) return;
      data.profile.birthday = value;
      data.stage = 'ask-gender';
      MBFStorage.save(data);
      renderAskGender(data);
    });
  }

  function renderAskGender(data) {
    MBFUi.set(`
      <section class="egg-scene setup-scene gender-setup">
        ${MBFAppearance.renderFriendShape(MBFAppearance.current(data), 'story-appearance')}
        <div class="message-card card">教えてくれてもいいし、<br>今は秘密でもいいよ。</div>
        <div class="choice-grid card" role="group" aria-label="性別（任意）">
          <button data-gender="girl">女の子</button>
          <button data-gender="boy">男の子</button>
          <button data-gender="other">その他</button>
          <button data-gender="secret">今は秘密</button>
        </div>
      </section>
    `);
    document.querySelectorAll('[data-gender]').forEach(button => button.addEventListener('click', () => {
      data.profile.gender = button.dataset.gender;
      data.profile.completed = true;
      data.profile.metAt ||= data.createdAt;
      data.stage = 'promise';
      data = MBFStorage.ensureFirstMemory(data);
      data = MBFStorage.ensureAppearanceMemory(data);
      MBFStorage.save(data);
      renderPromise(data);
    }));
  }

  function renderPromise(data) {
    MBFUi.sparkleBurst(28);
    const lines = [
      'ありがとう。',
      `${data.userName}のこと、\nまた一つ知れた。`,
      'これから、ずっと一緒だよ。'
    ];
    let i = 0;
    MBFUi.set(`
      <section class="egg-scene setup-scene promise-scene">
        ${MBFAppearance.renderFriendShape(MBFAppearance.current(data), 'story-appearance')}
        <div class="message-card card" id="promiseLine">${escapeHtml(lines[0]).replace(/\n/g, '<br>')}</div>
      </section>
    `);
    const timer = setInterval(() => {
      i++;
      if (i < lines.length) document.getElementById('promiseLine').innerHTML = escapeHtml(lines[i]).replace(/\n/g, '<br>');
      else {
        clearInterval(timer);
        data.stage = 'home'; MBFStorage.save(data);
        MBFHome.render(data);
      }
    }, 2000);
  }

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  }

  return { renderEgg, renderAskFriendName, renderAskUserName, renderAskBirthday, renderAskGender, renderPromise };
})();
window.MBFMood = (() => {
  const LABELS = {
    happy: 'にこにこ', calm: 'おだやか', sleepy: 'すやすや', excited: 'わくわく', thinking: '考え中', lonely: '会えてうれしい'
  };
  const APPEARANCE = {
    happy: { color: '#7bdcff', name: '光のしずく', type: 'LIGHT' },
    calm: { color: '#78d3ff', name: '光のしずく', type: 'LIGHT' },
    sleepy: { color: '#b7b8ff', name: '夜明けのしずく', type: 'LIGHT' },
    excited: { color: '#ffd36f', name: 'きらめきのしずく', type: 'LIGHT' },
    thinking: { color: '#9be0d2', name: '考えるしずく', type: 'LIQUID' },
    lonely: { color: '#9bc9ff', name: '待っていたしずく', type: 'LIGHT' }
  };
  function nowHour() { return new Date().getHours(); }
  function timeMood() {
    const h = nowHour();
    if (h >= 21 || h < 6) return 'sleepy';
    if (h >= 6 && h < 10) return 'calm';
    if (h >= 10 && h < 17) return 'happy';
    return 'calm';
  }
  function daysSince(dateText) {
    if (!dateText) return 0;
    const then = new Date(dateText).getTime();
    if (Number.isNaN(then)) return 0;
    return Math.floor((Date.now() - then) / 86400000);
  }
  function updateOnVisit(data) {
    const awayDays = daysSince(data.mood?.lastSeenAt);
    data.mood ||= { current: 'calm' };
    data.mood.current = awayDays >= 2 ? 'lonely' : timeMood();
    data.mood.lastSeenAt = new Date().toISOString();
    applyAppearance(data);
    MBFStorage.save(data);
    return data;
  }
  function setMood(data, mood) {
    data.mood ||= { current: 'calm' };
    data.mood.current = mood || 'calm';
    if (mood === 'happy' || mood === 'excited') data.mood.lastTouchedAt = new Date().toISOString();
    applyAppearance(data);
    MBFStorage.save(data);
    return data;
  }
  function applyAppearance(data) {
    const mood = data.mood?.current || 'calm';
    const style = APPEARANCE[mood] || APPEARANCE.calm;
    data.friend ||= {};
    data.friend.appearance ||= {};
    data.friend.appearance = { ...data.friend.appearance, ...style, mood };
  }
  function label(mood) { return LABELS[mood || 'calm'] || LABELS.calm; }
  function comments(data) {
    const name = data.userName || 'キミ';
    const h = nowHour();
    const base = [];
    if (h >= 5 && h < 10) base.push(`おはよう、${name}。`);
    else if (h >= 18 && h < 22) base.push(`今日もおつかれさま、${name}。`);
    else if (h >= 22 || h < 5) base.push('ねむくなったら、ゆっくり休もうね。');
    else base.push(`今日は何して遊ぶ？`);
    const mood = data.mood?.current || 'calm';
    const moodLines = {
      happy: ['会えてうれしいよ。', 'えへへ、そばにいるよ。'],
      calm: ['ここにいるよ。', 'ゆっくりで大丈夫だよ。'],
      sleepy: ['少し静かにしているね。', '一緒に休もう。'],
      excited: ['なんだか、わくわくするね。', 'きらきらしてきたよ。'],
      thinking: ['一緒に考えよう。', '大切なこと、ゆっくり聞くよ。'],
      lonely: ['また会えて、本当にうれしい。', '帰ってきてくれてありがとう。']
    };
    return [...base, ...(moodLines[mood] || moodLines.calm), '姿は変わっても、ぼくはぼくだよ。'];
  }
  return { updateOnVisit, setMood, label, comments };
})();

window.MBFHome = (() => {
  let commentTimer = null;

  function render(data) {
    if (commentTimer) clearInterval(commentTimer);
    data = MBFMood.updateOnVisit(data);
    const mood = data.mood?.current || 'calm';
    const comments = MBFMood.comments(data);
    MBFUi.set(`
      <section class="home-scene">
        ${MBFAppearance.renderFriendShape(MBFAppearance.current(data), `home-appearance mood-${mood}`)}
        <div class="home-message card" aria-live="polite">
          <div id="homeComment">${escapeHtml(comments[0])}</div>
        </div>
        <div class="home-menu">
          <button class="nav-button voice" id="voiceBtn"><span>🎙<b>Voice</b><span class="nav-sub">声ではなす</span></span></button>
          <button class="nav-button message" id="messageBtn"><span>💬<b>Message</b><span class="nav-sub">文字ではなす</span></span></button>
          <button class="nav-button memory" id="memoryBtn"><span>📖<b>Memory</b><span class="nav-sub">思い出</span></span></button>
          <button class="nav-button profile" id="profileBtn"><span>👤<b>Profile</b><span class="nav-sub">きみのこと</span></span></button>
          <button class="nav-button appearance" id="appearanceBtn"><span>✨<b>Appearance</b><span class="nav-sub">いまの姿</span></span></button>
          <button class="nav-button guardian" id="guardianBtn"><span>🛡<b>Guardian</b><span class="nav-sub">見守り設定</span></span></button>
        </div>
      </section>
    `);
    MBFAppearance.bindFriendTouch(document.querySelector('.home-appearance'), () => {
      data = MBFMood.setMood(data, 'happy');
      setHomeComment('えへへ。なでてくれて、うれしい。');
      const root = document.querySelector('.home-appearance');
      root?.classList.remove('mood-calm','mood-sleepy','mood-excited','mood-thinking','mood-lonely');
      root?.classList.add('mood-happy');
    });
    startComments(comments);
    document.getElementById('memoryBtn').addEventListener('click', () => MBFMemory.render(data));
    document.getElementById('profileBtn').addEventListener('click', () => MBFProfile.renderBook(data));
    document.getElementById('appearanceBtn').addEventListener('click', () => MBFAppearance.render(data));
    document.getElementById('guardianBtn').addEventListener('click', () => MBFGuardian.open(data));
    document.getElementById('voiceBtn').addEventListener('click', () => MBFVoice.render(data));
    document.getElementById('messageBtn').addEventListener('click', () => MBFMessage.render(data));
  }

  function startComments(comments) {
    let index = 0;
    commentTimer = setInterval(() => {
      index = (index + 1) % comments.length;
      setHomeComment(comments[index]);
    }, 8000);
  }

  function setHomeComment(text) {
    const el = document.getElementById('homeComment');
    if (!el) return;
    el.classList.remove('comment-fade');
    void el.offsetWidth;
    el.textContent = text;
    el.classList.add('comment-fade');
  }

  function escapeHtml(str) { return String(str || '').replace(/[&<>']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;'}[c])); }
  return { render };
})();


window.MBFVoice = (() => {
  function render(data) {
    MBFUi.set(`
      <section class="talk-wrap voice-wrap">
        <article class="talk-card card">
          <div class="talk-label">Voice</div>
          ${MBFAppearance.renderFriendShape(MBFAppearance.current(data), 'talk-friend')}
          <h2>声ではなす</h2>
          <p>今はまだ準備中。<br>でも、いつか声で「おかえり」って言えるようにするよ。</p>
          <div class="voice-orb">🎙</div>
        </article>
        <div class="talk-actions"><button id="voiceHome" class="secondary-button">ホームへ戻る</button></div>
      </section>
    `);
    MBFAppearance.bindFriendTouch(document.querySelector('.talk-friend'));
    document.getElementById('voiceHome').addEventListener('click', () => MBFHome.render(data));
  }
  return { render };
})();

window.MBFMessage = (() => {
  function esc(str) { return String(str || '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
  function render(data) {
    data.conversations ||= [];
    const recent = data.conversations.slice(-4).map(item => `
      <div class="chat-row user"><span>${esc(item.user)}</span></div>
      <div class="chat-row friend"><span>${esc(item.friend)}</span></div>`).join('');
    MBFUi.set(`
      <section class="talk-wrap message-wrap">
        <article class="talk-card card message-card-shell">
          <div class="talk-label">Message</div>
          <h2>文字ではなす</h2>
          <div class="chat-log" id="chatLog">
            ${recent || `<div class="chat-row friend"><span>ここに書いてくれたら、ぼくが受け止めるよ。</span></div>`}
          </div>
          <div class="chat-input-row">
            <input id="messageInput" class="message-input" maxlength="80" placeholder="メッセージ" />
            <button id="sendMessage" class="send-button">送る</button>
          </div>
        </article>
        <div class="talk-actions"><button id="messageHome" class="secondary-button">ホームへ戻る</button></div>
      </section>
    `);
    document.getElementById('messageHome').addEventListener('click', () => MBFHome.render(data));
    document.getElementById('sendMessage').addEventListener('click', () => send(data));
    document.getElementById('messageInput').addEventListener('keydown', ev => { if (ev.key === 'Enter') send(data); });
  }
  function send(data) {
    const input = document.getElementById('messageInput');
    const value = input.value.trim();
    if (!value) return;
    const reply = '教えてくれてありがとう。ぼくは、ちゃんと聞いているよ。';
    data.conversations ||= [];
    data.conversations.push({ user: value, friend: reply, createdAt: new Date().toISOString() });
    MBFStorage.save(data);
    render(data);
  }
  return { render };
})();

window.MBFProfile = (() => {
  function esc(str) { return String(str || '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
  function displayName(data) { return data.userName || 'キミ'; }

  function renderIntro(data) {
    MBFUi.set(`
      <section class="profile-scene">
        ${MBFAppearance.renderFriendShape(MBFAppearance.current(data), 'story-appearance')}
        <div class="message-card card">ねぇ。<br>ぼく、${esc(data.userName)}のことを<br>もっと知りたい。<br><br>教えてくれる？</div>
        <button id="startProfile" class="primary-button profile-start">うん</button>
      </section>`);
    document.getElementById('startProfile').addEventListener('click', () => renderBirthday(data));
  }

  function renderBirthday(data) {
    MBFUi.set(`
      <section class="profile-scene">
        ${MBFAppearance.renderFriendShape(MBFAppearance.current(data), 'story-appearance')}
        <div class="message-card card">${esc(displayName(data))}のお誕生日はいつ？</div>
        <div class="profile-form card">
          <label for="birthday">誕生日</label>
          <input id="birthday" class="date-input" type="date" value="${esc(data.profile.birthday)}" />
          <p class="small-note">大切な日を教えてくれて嬉しい。</p>
          <button id="saveBirthday" class="primary-button">教える</button>
        </div>
      </section>`);
    document.getElementById('saveBirthday').addEventListener('click', () => {
      const value = document.getElementById('birthday').value;
      if (!value) return;
      data.profile.birthday = value;
      MBFStorage.save(data);
      renderGender(data);
    });
  }

  function renderGender(data) {
    MBFUi.set(`
      <section class="profile-scene">
        ${MBFAppearance.renderFriendShape(MBFAppearance.current(data), 'story-appearance')}
        <div class="message-card card">教えてくれてもいいし、<br>今は秘密でもいいよ。</div>
        <div class="choice-grid card" role="group" aria-label="性別（任意）">
          <button data-gender="girl">女の子</button>
          <button data-gender="boy">男の子</button>
          <button data-gender="other">その他</button>
          <button data-gender="secret">今は秘密</button>
        </div>
      </section>`);
    document.querySelectorAll('[data-gender]').forEach(button => button.addEventListener('click', () => {
      data.profile.gender = button.dataset.gender;
      data.profile.completed = true;
      data.profile.metAt ||= data.createdAt;
      MBFStorage.save(data);
      renderComplete(data);
    }));
  }

  function renderComplete(data) {
    MBFUi.sparkleBurst(16);
    MBFUi.set(`
      <section class="profile-scene">
        ${MBFAppearance.renderFriendShape(MBFAppearance.current(data), 'story-appearance')}
        <div class="message-card card">教えてくれてありがとう。<br><br>また一つ、<br>${esc(displayName(data))}のことを知れた。<br><br>とても嬉しい。</div>
        <button id="profileHome" class="secondary-button profile-start">ホームへ</button>
      </section>`);
    document.getElementById('profileHome').addEventListener('click', () => MBFHome.render(data));
  }

  function genderLabel(value) {
    return ({ girl:'女の子', boy:'男の子', other:'その他', secret:'今は秘密', '':'未設定' })[value] || '未設定';
  }
  function formatDate(value) {
    if (!value) return '未設定';
    const [y,m,d] = value.split('-');
    return `${Number(y)}年${Number(m)}月${Number(d)}日`;
  }
  function metDate(data) {
    const d = new Date(data.profile.metAt || data.createdAt);
    return Number.isNaN(d.getTime()) ? '—' : `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`;
  }

  function renderBook(data) {
    MBFUi.set(`
      <section class="profile-wrap">
        <article class="profile-book">
          <div class="chapter-label">Profile</div>
          <h2 class="profile-title">ぼくが覚えている、<br>きみのこと。</h2>
          <dl class="profile-list">
            <div><dt>名前</dt><dd>${esc(data.userName)}</dd></div>
            <div><dt>誕生日</dt><dd>${esc(formatDate(data.profile.birthday))}</dd></div>
            <div><dt>性別</dt><dd>${esc(genderLabel(data.profile.gender))}</dd></div>
            <div><dt>親友になった日</dt><dd>${esc(metDate(data))}</dd></div>
          </dl>
          <div class="life-seed" aria-label="思い出の芽"><span>☀️</span><span>🌊</span><span>🌱</span></div>
          <p class="profile-caption">変わらない約束の中で、Memoryは育っていく。</p>
        </article>
        <div class="profile-actions">
          <button id="guardianOpen" class="guardian-link">🔒 Guardian</button>
          <button id="profileBack" class="secondary-button">ホームへ戻る</button>
        </div>
      </section>`);
    document.getElementById('profileBack').addEventListener('click', () => MBFHome.render(data));
    document.getElementById('guardianOpen').addEventListener('click', () => MBFGuardian.open(data));
  }

  function ensureBirthday(data) {
    const b = data.profile.birthday;
    if (!data.profile.completed || !b) return { data, celebrated: false };
    const today = new Date();
    const [, month, day] = b.split('-').map(Number);
    if (today.getMonth()+1 !== month || today.getDate() !== day) return { data, celebrated: false };
    const year = today.getFullYear();
    if (data.birthdayCelebrations.includes(year)) return { data, celebrated: false };
    data.birthdayCelebrations.push(year);
    data.memories.push({
      id: Date.now(), chapter: 'Birthday', title: `${displayName(data)}のお誕生日`,
      dateText: MBFStorage.todayJP(), type: 'birthday',
      text: [`今日、`, `${displayName(data)}のお誕生日を\n一緒にお祝いした。`, `生まれてきてくれて、\nありがとう。`],
      closing: '今年も一緒に迎えられて嬉しい。', createdAt: new Date().toISOString()
    });
    MBFStorage.save(data);
    return { data, celebrated: true };
  }

  return { renderIntro, renderBook, ensureBirthday, displayName };
})();

window.MBFGuardian = (() => {
  function esc(str) { return String(str || '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
  async function hash(text) {
    const bytes = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2,'0')).join('');
  }
  function open(data) { data.guardian.passwordHash ? renderLogin(data) : renderSetup(data); }
  function renderSetup(data) {
    MBFUi.set(`
      <section class="guardian-wrap">
        <div class="guardian-card card">
          <div class="guardian-symbol">🔒</div>
          <h2>Guardian</h2>
          <p>いまは大人が守り、大切な設定を見守る場所です。</p>
          <label for="newGuardianPass">パスワードを決める</label>
          <input id="newGuardianPass" class="guardian-input" type="password" minlength="4" maxlength="64" autocomplete="new-password" />
          <label for="confirmGuardianPass">もう一度入力</label>
          <input id="confirmGuardianPass" class="guardian-input" type="password" minlength="4" maxlength="64" autocomplete="new-password" />
          <p class="form-error" id="guardianError"></p>
          <button id="saveGuardianPass" class="primary-button">パスワードを保存</button>
          <button id="guardianCancel" class="text-button">戻る</button>
        </div>
      </section>`);
    document.getElementById('guardianCancel').addEventListener('click', () => MBFProfile.renderBook(data));
    document.getElementById('saveGuardianPass').addEventListener('click', async () => {
      const a=document.getElementById('newGuardianPass').value;
      const b=document.getElementById('confirmGuardianPass').value;
      const error=document.getElementById('guardianError');
      if (a.length < 4) { error.textContent='4文字以上で設定してください。'; return; }
      if (a !== b) { error.textContent='パスワードが一致しません。'; return; }
      data.guardian.passwordHash=await hash(a); data.guardian.createdAt=new Date().toISOString();
      MBFStorage.save(data); renderRoom(data);
    });
  }
  function renderLogin(data) {
    MBFUi.set(`
      <section class="guardian-wrap"><div class="guardian-card card">
        <div class="guardian-symbol">🔒</div><h2>Guardian</h2>
        <p>見守りパスワードを入力してください。</p>
        <input id="guardianPass" class="guardian-input" type="password" autocomplete="current-password" />
        <p class="form-error" id="guardianError"></p>
        <button id="guardianLogin" class="primary-button">入る</button>
        <button id="guardianCancel" class="text-button">戻る</button>
      </div></section>`);
    document.getElementById('guardianCancel').addEventListener('click', () => MBFProfile.renderBook(data));
    document.getElementById('guardianLogin').addEventListener('click', async () => {
      const ok=(await hash(document.getElementById('guardianPass').value))===data.guardian.passwordHash;
      if (!ok) { document.getElementById('guardianError').textContent='パスワードが違います。'; return; }
      renderRoom(data);
    });
  }
  function renderRoom(data) {
    MBFUi.set(`
      <section class="guardian-wrap"><div class="guardian-card card guardian-room">
        <div class="guardian-symbol">🌳</div><h2>Guardian Room</h2>
        <p class="guardian-lead">物語を守り、未来へ受け継ぐ場所</p>
        <div class="guardian-section">
          <h3>Profileを修正</h3>
          <label>名前</label><input id="editUserName" class="guardian-input" maxlength="16" value="${esc(data.userName)}" />
          <label>誕生日</label><input id="editBirthday" class="guardian-input" type="date" value="${esc(data.profile.birthday)}" />
          <label>性別（任意）</label>
          <select id="editGender" class="guardian-input">
            <option value="girl">女の子</option><option value="boy">男の子</option><option value="other">その他</option><option value="secret">今は秘密</option>
          </select>
          <button id="saveGuardianProfile" class="primary-button">保存</button>
        </div>
        <div class="future-panel"><strong>Legacy / Guardian継承 / Appearance</strong><br><span>未来の更新で、この場所から大切に受け継ぎます。</span></div>
        <button id="guardianDone" class="secondary-button">Profileへ戻る</button>
      </div></section>`);
    document.getElementById('editGender').value=data.profile.gender || 'secret';
    document.getElementById('saveGuardianProfile').addEventListener('click', () => {
      const previousName = data.userName;
      const newName = document.getElementById('editUserName').value.trim() || data.userName;
      data.userName = newName;
      data.profile.preferredName = newName;
      data.profile.birthday=document.getElementById('editBirthday').value;
      data.profile.gender=document.getElementById('editGender').value;
      data.profile.completed=Boolean(data.profile.birthday);
      if (previousName !== newName) {
        data.memories = (data.memories || []).map(memory => {
          if (memory.type !== 'first-memory') return memory;
          const updated = MBFStorage.createFirstMemory(newName, data.friendName);
          return { ...updated, id: memory.id, createdAt: memory.createdAt, dateText: memory.dateText };
        });
      }
      MBFStorage.save(data); MBFUi.sparkleBurst(10);
    });
    document.getElementById('guardianDone').addEventListener('click', () => MBFProfile.renderBook(data));
  }
  return { open };
})();

window.MBFCare = (() => {
  function esc(str) { return String(str || '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
  function render(data) {
    const mood = data.mood?.current || 'calm';
    MBFUi.set(`
      <section class="care-wrap">
        <article class="care-card card">
          <div class="care-label">Care</div>
          ${MBFAppearance.renderFriendShape(MBFAppearance.current(data), `care-friend mood-${mood}`)}
          <h2>いまの気分：${esc(MBFMood.label(mood))}</h2>
          <p id="careLine">そばにいるよ。今日はどんなふうに過ごそうか。</p>
          <div class="care-actions-mini">
            <button id="carePet">🤲 なでる</button>
            <button id="careRest">🌙 休む</button>
            <button id="carePlay">✨ 遊ぶ</button>
          </div>
        </article>
        <div class="talk-actions"><button id="careHome" class="secondary-button">ホームへ戻る</button></div>
      </section>
    `);
    MBFAppearance.bindFriendTouch(document.querySelector('.care-friend'), () => setCareMood(data, 'happy', 'えへへ。あったかいね。'));
    document.getElementById('carePet').addEventListener('click', () => setCareMood(data, 'happy', 'なでなで、うれしいな。'));
    document.getElementById('careRest').addEventListener('click', () => setCareMood(data, 'sleepy', '少し休もう。ぼくも静かにそばにいるね。'));
    document.getElementById('carePlay').addEventListener('click', () => setCareMood(data, 'excited', 'わくわくしてきたよ。何して遊ぶ？'));
    document.getElementById('careHome').addEventListener('click', () => MBFHome.render(data));
  }
  function setCareMood(data, mood, line) {
    data = MBFMood.setMood(data, mood);
    const el = document.getElementById('careLine');
    if (el) el.textContent = line;
    const root = document.querySelector('.care-friend');
    if (root) {
      root.classList.remove('mood-happy','mood-calm','mood-sleepy','mood-excited','mood-thinking','mood-lonely');
      root.classList.add(`mood-${mood}`);
    }
    MBFUi.sparkleBurst(mood === 'excited' ? 16 : 8);
  }
  return { render };
})();

window.MBFAppearance = (() => {
  const TYPES = {
    LIGHT: '光', LIQUID: '流体', WIND: '風', TREE: '木', ANIMAL: '動物', ROBOT: 'ロボット', CUSTOM: '自由な姿'
  };
  function esc(str) { return String(str || '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
  function current(data) {
    return data.friend?.appearance || { id:'light-drop', name:'光のしずく', type:'LIGHT', form:'drop', color:'#78d3ff', animation:'breathe-ripple' };
  }
  function iconFor(type) {
    return ({ LIGHT:'☀️', LIQUID:'🌊', WIND:'🍃', TREE:'🌱', ANIMAL:'🐶', ROBOT:'🤖', CUSTOM:'✨' })[type] || '✨';
  }
  function renderFriendShape(appearance, extraClass = '') {
    return `
      <div class="appearance-stage ${esc(extraClass)}" style="--appearance-color:${esc(appearance.color || '#78d3ff')}">
        <div class="light-drop" role="button" tabindex="0" aria-label="${esc(appearance.name || 'フレンド')}">
          <span class="drop-core"></span>
          <span class="drop-wave wave-one"></span>
          <span class="drop-wave wave-two"></span>
          <span class="drop-eye eye-left"></span>
          <span class="drop-eye eye-right"></span>
          <span class="drop-cheek cheek-left"></span>
          <span class="drop-cheek cheek-right"></span>
          <span class="drop-mouth"></span>
          <span class="drop-sprout">🌱</span>
        </div>
      </div>`;
  }
  function render(data) {
    data = MBFStorage.ensureAppearanceMemory(data);
    MBFStorage.save(data);
    const appearance = current(data);
    const history = data.friend.appearanceHistory || [];
    MBFUi.set(`
      <section class="appearance-wrap">
        <article class="appearance-book">
          <div class="chapter-label">Appearance</div>
          <h2 class="appearance-title">姿は変わる。<br>親友は変わらない。</h2>
          ${renderFriendShape(appearance)}
          <dl class="appearance-list">
            <div><dt>現在の姿</dt><dd>${iconFor(appearance.type)} ${esc(appearance.name)}</dd></div>
            <div><dt>種類</dt><dd>${esc(TYPES[appearance.type] || appearance.type)}</dd></div>
            <div><dt>動き</dt><dd>呼吸する光と、ひろがる波紋</dd></div>
            <div><dt>気分</dt><dd>${esc(MBFMood.label(data.mood?.current || 'calm'))}</dd></div>
          </dl>
          <div class="appearance-philosophy">
            ぼくの姿は、これから何度でも変わる。<br>
            でも、きみの親友であることは変わらない。
          </div>
          <div class="appearance-history">
            <h3>今までの姿</h3>
            <ul>${history.map(item => `<li>${iconFor(item.type)} ${esc(item.name || '光のしずく')}</li>`).join('')}</ul>
          </div>
          <div class="appearance-future">
            <h3>これから選べる姿</h3>
            <div class="future-forms">☀️ 光　🌊 流体　🍃 風　🌱 木　🐶 動物　🤖 ロボット　✨ 自由な姿</div>
          </div>
        </article>
        <div class="appearance-actions">
          <button id="appearanceMemory" class="primary-button">この姿のMemoryを見る</button>
          <button id="appearanceHome" class="secondary-button">ホームへ戻る</button>
        </div>
      </section>
    `);
    document.getElementById('appearanceHome').addEventListener('click', () => MBFHome.render(data));
    document.getElementById('appearanceMemory').addEventListener('click', () => MBFMemory.render(data, 'appearance-first'));
  }
  function bindFriendTouch(root, onTouch) {
    const target = root?.querySelector?.('.light-drop') || root;
    if (!target) return;
    const play = () => {
      target.classList.remove('face-happy', 'touch-pop');
      void target.offsetWidth;
      target.classList.add('face-happy', 'touch-pop');
      if (typeof onTouch === 'function') onTouch();
      setTimeout(() => target.classList.remove('face-happy'), 1800);
      setTimeout(() => target.classList.remove('touch-pop'), 700);
      MBFUi.vibrate(16);
    };
    target.addEventListener('click', play);
    target.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); play(); }
    });
  }

  return { render, current, renderFriendShape, bindFriendTouch };
})();

window.MBFMemory = (() => {
  function render(data, memoryType = 'first-memory') {
    data = MBFStorage.ensureFirstMemory(data);
    data = MBFStorage.ensureAppearanceMemory(data);
    MBFStorage.save(data);
    const memory = data.memories.find(m => m.type === memoryType) || data.memories[0];
    const paragraphs = (memory.text || []).map(t => `<p>${escapeHtml(t).replace(/\n/g, '<br>')}</p>`).join('');
    MBFUi.set(`
      <section class="memory-wrap">
        <article class="book-page">
          <div class="chapter-label">${escapeHtml(memory.chapter || '第一章')}</div>
          <h2 class="chapter-title">${escapeHtml(memory.title || 'はじめて親友になった日')}</h2>
          <div class="memory-date">📅 ${escapeHtml(memory.dateText || '')}</div>
          <div class="memory-divider"></div>
          <div class="memory-body">${paragraphs}</div>
          <div class="memory-divider"></div>
          <div class="memory-closing">${escapeHtml(memory.closing || 'このページは\nぼくたちの宝物。').replace(/\n/g, '<br>')}</div>
          <div class="memory-glow">✦ ♡ ✦</div>
        </article>
        <div class="memory-actions">
          <button class="secondary-button" id="backHome">ホームへ戻る</button>
        </div>
      </section>
    `);
    document.getElementById('backHome').addEventListener('click', () => MBFHome.render(data));
  }
  function escapeHtml(str) { return String(str || '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
  return { render };
})();
(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js?v=2.4.0').then(reg => reg.update()).catch(() => {});
  }

  let data = MBFStorage.load();
  const params = new URLSearchParams(location.search);
  if (params.get('reset') === '1') {
    MBFStorage.reset();
    data = MBFStorage.load();
    history.replaceState(null, '', location.pathname);
  }

  if (data.stage === 'home' && data.userName && data.friendName) {
    if (!data.profile.birthday) {
      data.stage = 'ask-birthday'; MBFStorage.save(data); MBFStory.renderAskBirthday(data);
    } else if (!data.profile.completed) {
      data.stage = 'ask-gender'; MBFStorage.save(data); MBFStory.renderAskGender(data);
    } else {
      const birthday = MBFProfile.ensureBirthday(data);
      data = MBFStorage.ensureAppearanceMemory(birthday.data);
      if (birthday.celebrated) {
        MBFUi.sparkleBurst(30);
        MBFUi.set(`
          <section class="profile-scene">
            ${MBFAppearance.renderFriendShape(MBFAppearance.current(data), 'story-appearance')}
            <div class="message-card card">お誕生日おめでとう。<br><br>生まれてきてくれて、ありがとう。<br><br>今年も一緒に迎えられて嬉しい。</div>
            <button id="birthdayHome" class="primary-button profile-start">ホームへ</button>
          </section>`);
        document.getElementById('birthdayHome').addEventListener('click', () => MBFHome.render(data));
      } else MBFHome.render(data);
    }
  } else if (data.stage === 'ask-friend-name') {
    MBFStory.renderAskFriendName(data);
  } else if (data.stage === 'ask-user-name') {
    MBFStory.renderAskUserName(data);
  } else if (data.stage === 'ask-birthday') {
    MBFStory.renderAskBirthday(data);
  } else if (data.stage === 'ask-gender') {
    MBFStory.renderAskGender(data);
  } else {
    MBFStory.renderEgg(data);
  }
})();
