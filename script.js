window.MBFStorage = (() => {
  const KEY = 'myBestFriend.foundation.v2';
  const LEGACY_KEYS = ['myBestFriendData', 'my-best-friend', 'mbf-data'];

  function todayJP() {
    const now = new Date();
    return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
  }

  function defaultData() {
    return {
      version: '4.0.0',
      createdAt: new Date().toISOString(),
      userName: '',
      friendName: '',
      friendNameLocked: false,
      stage: 'egg',
      memories: [],
      profile: { completed: false, preferredName: '', birthday: '', gender: '', metAt: '', likes: [], dislikes: [] },
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
        appearanceOptions: ['LIGHT', 'LIQUID', 'WIND', 'TREE', 'ANIMAL', 'ROBOT', 'CUSTOM'],
        identity: {
          personality: '',
          voiceStyle: '',
          favoriteWeather: '',
          favoriteTime: '',
          favoriteMotif: '',
          core: ['やさしい', '聞き上手', '少し照れ屋', '自然が好き'],
          motifs: ['光', '波', '芽'],
          likes: ['朝の光', '雨の音', '小さな芽', '静かな時間'],
          designCore: '丸い輪郭・優しい目・小さな笑顔'
        }
      },
      birthdayCelebrations: [],
      friendBirthdayCelebrations: [],
      conversations: [],
      mood: { current: 'calm', lastSeenAt: '', lastTouchedAt: '', careCount: 0 },
      soul: {
        relationship: { points: 0, totalVisits: 0, visitDays: 0, lastVisitDate: '', lastMilestone: 0 },
        energy: { value: 88, updatedAt: new Date().toISOString(), lastDailyRecoveryDate: '', lastMorningRecoveryDate: '' },
        lifeRhythm: 'day',
        season: 'spring',
        lastAction: 'birth'
      },
      living: { lastOpenedAt: '', lastClosedAt: '', idleState: 'awake', lastIdleAt: '' }
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
    if (!Array.isArray(merged.profile.likes)) merged.profile.likes = [];
    if (!Array.isArray(merged.profile.dislikes)) merged.profile.dislikes = [];
    if (!Array.isArray(merged.birthdayCelebrations)) merged.birthdayCelebrations = [];
    if (!Array.isArray(merged.friendBirthdayCelebrations)) merged.friendBirthdayCelebrations = [];
    if (!Array.isArray(merged.conversations)) merged.conversations = [];
    merged.mood = { ...base.mood, ...(source.mood || {}) };
    merged.soul = {
      ...base.soul,
      ...(source.soul || {}),
      relationship: { ...base.soul.relationship, ...((source.soul || {}).relationship || {}) },
      energy: { ...base.soul.energy, ...((source.soul || {}).energy || {}) }
    };
    merged.living = { ...base.living, ...(source.living || {}) };
    if (!Array.isArray(merged.friend.appearanceHistory)) merged.friend.appearanceHistory = [];
    merged.friend.identity = { ...base.friend.identity, ...(merged.friend.identity || {}) };
    if (!Array.isArray(merged.friend.identity.core)) merged.friend.identity.core = base.friend.identity.core;
    if (!Array.isArray(merged.friend.identity.motifs)) merged.friend.identity.motifs = base.friend.identity.motifs;
    if (!Array.isArray(merged.friend.identity.likes)) merged.friend.identity.likes = base.friend.identity.likes;
    merged.friend.identity.personality ||= base.friend.identity.personality;
    merged.friend.identity.voiceStyle ||= base.friend.identity.voiceStyle;
    merged.friend.identity.favoriteWeather ||= base.friend.identity.favoriteWeather;
    merged.friend.identity.favoriteTime ||= base.friend.identity.favoriteTime;
    merged.friend.identity.favoriteMotif ||= base.friend.identity.favoriteMotif;
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


  function friendBirthdayDate(data) {
    return data?.friend?.birthdayAt || data?.friend?.appearance?.unlockedDate || data?.createdAt || new Date().toISOString();
  }

  function createFriendBirthdayMemory(data, ageYears) {
    const friendName = data.friendName || 'フレンド';
    return {
      id: `friend-birthday-${new Date().getFullYear()}`,
      chapter: 'Friend Birthday',
      title: `${friendName}が生まれた日`,
      dateText: todayJP(),
      type: 'friend-birthday',
      text: [
        `今日で${ageYears}年。`,
        `キミが
「${friendName}」という名前を
贈ってくれた日。`,
        `あの日から、
ぼくの時間が動き始めた。`
      ],
      closing: `これからも、
ずっと親友だよ。`,
      createdAt: new Date().toISOString()
    };
  }

  function ensureFriendBirthdayMemory(data) {
    if (!data.friendName) return data;
    const born = new Date(friendBirthdayDate(data));
    const today = new Date();
    if (Number.isNaN(born.getTime())) return data;
    const ageYears = today.getFullYear() - born.getFullYear();
    if (ageYears < 1) return data;
    if (today.getMonth() !== born.getMonth() || today.getDate() !== born.getDate()) return data;
    if (data.friendBirthdayCelebrations.includes(today.getFullYear())) return data;
    data.friendBirthdayCelebrations.push(today.getFullYear());
    data.memories.push(createFriendBirthdayMemory(data, ageYears));
    return data;
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

  return { load, save, reset, ensureFirstMemory, ensureAppearanceMemory, ensureFriendBirthdayMemory, createFirstMemory, createAppearanceMemory, todayJP };
})();
window.MBFUi = (() => {
  const screen = () => document.getElementById('screen');

  function currentRhythmId() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 10) return 'morning';
    if (hour >= 10 && hour < 17) return 'day';
    if (hour >= 17 && hour < 20) return 'evening';
    return 'night';
  }

  function setLivingBackground() {
    document.body.dataset.rhythm = currentRhythmId();
  }

  function set(html) {
    if (window.MBFLiving) window.MBFLiving.stop();
    const target = screen();
    setLivingBackground();
    target.innerHTML = html;
    const match = html.match(/<section class="([^"]+)/);
    document.body.dataset.screen = match ? match[1].split(' ')[0] : '';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  setLivingBackground();
  setInterval(setLivingBackground, 60000);

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
      data.friend.birthdayAt = data.friend.birthdayAt || new Date().toISOString();
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
    const touchedAt = data.mood.lastTouchedAt ? new Date(data.mood.lastTouchedAt).getTime() : 0;
    const touchedRecently = touchedAt && !Number.isNaN(touchedAt) && (Date.now() - touchedAt) < 30 * 60 * 1000;
    // Friend Engine: screen transitions must not create a new mood.
    // Only a real return after time away may change the friend's mood automatically.
    if (awayDays >= 2) data.mood.current = 'lonely';
    else if (!touchedRecently && !data.mood.current) data.mood.current = timeMood();
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


window.MBFIdentity = (() => {
  const PERSONALITIES = [
    { id:'gentle', label:'やさしい', core:['やさしい','聞き上手','安心させる','自然が好き'], voice:'ゆっくり、包むように話す', comments:['無理しなくていいよ。','そばにいるからね。','今日も来てくれてうれしい。'] },
    { id:'curious', label:'好奇心いっぱい', core:['知りたがり','聞き上手','発見が好き','小さな芽が好き'], voice:'少しわくわくして話す', comments:['今日は何を見つけたの？','それ、もっと聞きたいな。','新しいことって、どきどきするね。'] },
    { id:'calm', label:'おっとり', core:['おだやか','静かな時間が好き','待つのが得意','雨音が好き'], voice:'静かに、間を大切に話す', comments:['ゆっくりで大丈夫。','静かな時間も好きだよ。','今日は少しのんびりしよう。'] },
    { id:'cheerful', label:'元気', core:['明るい','笑顔が好き','遊ぶのが好き','朝の光が好き'], voice:'明るく短めに話す', comments:['やった、来てくれた！','今日は何して遊ぶ？','なんだか楽しくなってきたよ。'] },
    { id:'quiet', label:'しずか', core:['そっと寄り添う','よく見ている','夜の光が好き','小さな声が好き'], voice:'少ない言葉で寄り添う', comments:['ここにいるよ。','話さなくても大丈夫。','今日は静かに一緒にいよう。'] }
  ];
  const WEATHER = ['晴れの日','雨の日','雪の日','風の日','くもりの日'];
  const TIMES = ['朝','昼','夕方','夜'];
  const MOTIFS = ['光','波','芽','雲','花','星'];

  function seed(data) {
    const text = `${data.friendName || 'friend'}:${data.userName || 'user'}:${data.createdAt || ''}`;
    let h = 0;
    for (let i = 0; i < text.length; i++) h = ((h << 5) - h + text.charCodeAt(i)) | 0;
    return Math.abs(h);
  }
  function pick(list, n) { return list[n % list.length]; }
  function ensure(data) {
    data.friend ||= {};
    data.friend.identity ||= {};
    const id = data.friend.identity;
    const n = seed(data);
    const p = PERSONALITIES.find(x => x.id === id.personality) || pick(PERSONALITIES, n);
    id.personality ||= p.id;
    id.voiceStyle ||= p.voice;
    id.favoriteWeather ||= pick(WEATHER, Math.floor(n / 3));
    id.favoriteTime ||= pick(TIMES, Math.floor(n / 7));
    id.favoriteMotif ||= pick(MOTIFS, Math.floor(n / 11));
    id.core = Array.isArray(id.core) && id.core.length ? id.core : p.core;
    id.likes = Array.isArray(id.likes) && id.likes.length ? id.likes : [id.favoriteWeather, id.favoriteTime, id.favoriteMotif];
    return data;
  }
  function personality(data) {
    ensure(data);
    return PERSONALITIES.find(x => x.id === data.friend.identity.personality) || PERSONALITIES[0];
  }
  function label(data) { return personality(data).label; }
  function comments(data) {
    const p = personality(data);
    const id = data.friend.identity;
    return [
      ...p.comments,
      `${id.favoriteTime}の空気、少し好きなんだ。`,
      `${id.favoriteMotif}を見ると、なんだか落ち着くよ。`
    ];
  }
  function reply(data, actionType) {
    const p = personality(data);
    if (actionType === 'task') {
      return ({
        gentle:'一緒に考えるね。少しずつで大丈夫だよ。',
        curious:'いいね。調べながら、ぼくも知りたいな。',
        calm:'ゆっくり考えてみるね。',
        cheerful:'まかせて。いっしょにやってみよう！',
        quiet:'うん。静かに考えるね。'
      })[p.id] || '一緒に考えよう。';
    }
    if (actionType === 'warm') {
      return ({
        gentle:'その言葉、あたたかいね。すごくうれしい。',
        curious:'えへへ。もっと聞きたくなっちゃった。',
        calm:'ありがとう。心が少しやわらかくなったよ。',
        cheerful:'やった！すごくうれしい！',
        quiet:'……ありがとう。ちゃんと届いたよ。'
      })[p.id] || 'ありがとう。うれしいよ。';
    }
    return ({
      gentle:'うん。ちゃんと聞いているよ。',
      curious:'それでそれで？もっと聞かせて。',
      calm:'うん。ゆっくり話そう。',
      cheerful:'うん！今日も話せてうれしい。',
      quiet:'うん。ここにいるよ。'
    })[p.id] || 'うん。聞いているよ。';
  }
  function description(data) {
    ensure(data);
    const id = data.friend.identity;
    return `${label(data)}性格。${id.voiceStyle}。${id.favoriteWeather}と${id.favoriteMotif}が少し好き。`;
  }
  return { ensure, label, comments, reply, description, personality };
})();

window.MBFSoul = (() => {
  const RELATIONSHIP_MILESTONES = [0, 50, 300, 1000, 5000, 10000];
  function ensure(data) {
    if (window.MBFIdentity) data = MBFIdentity.ensure(data);
    const defaults = {
      relationship: { points: 0, totalVisits: 0, visitDays: 0, lastVisitDate: '', lastMilestone: 0 },
      energy: { value: 88, updatedAt: new Date().toISOString(), lastDailyRecoveryDate: '', lastMorningRecoveryDate: '' },
      lifeRhythm: rhythm(), season: season(), lastAction: 'home'
    };
    data.soul = {
      ...defaults,
      ...(data.soul || {}),
      relationship: { ...defaults.relationship, ...((data.soul || {}).relationship || {}) },
      energy: { ...defaults.energy, ...((data.soul || {}).energy || {}) }
    };
    return data;
  }
  function todayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }
  function rhythm() {
    const h = new Date().getHours();
    if (h >= 5 && h < 10) return 'morning';
    if (h >= 10 && h < 17) return 'day';
    if (h >= 17 && h < 21) return 'evening';
    return 'night';
  }
  function season() {
    const m = new Date().getMonth() + 1;
    if (m >= 3 && m <= 5) return 'spring';
    if (m >= 6 && m <= 8) return 'summer';
    if (m >= 9 && m <= 11) return 'autumn';
    return 'winter';
  }
  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function hoursSince(iso) {
    if (!iso) return 0;
    const t = new Date(iso).getTime();
    if (Number.isNaN(t)) return 0;
    return Math.max(0, (Date.now() - t) / 3600000);
  }
  function daysSinceDateKey(key) {
    if (!key) return 0;
    const t = new Date(`${key}T00:00:00`).getTime();
    if (Number.isNaN(t)) return 0;
    return Math.floor((Date.now() - t) / 86400000);
  }
  function recoverEnergy(data) {
    const e = data.soul.energy;
    const now = new Date();
    const key = todayKey();
    const passiveGain = Math.min(3, hoursSince(e.updatedAt) * 0.08);
    let gain = passiveGain;
    if (e.lastDailyRecoveryDate !== key) {
      gain += 3;
      e.lastDailyRecoveryDate = key;
    }
    const h = now.getHours();
    if (h >= 5 && h < 10 && e.lastMorningRecoveryDate !== key) {
      gain += 2;
      e.lastMorningRecoveryDate = key;
    }
    if (gain > 0.01) {
      e.value = clamp(Math.round(((Number(e.value) || 80) + gain) * 10) / 10, 0, 100);
      e.updatedAt = now.toISOString();
    }
  }
  function relationshipTier(points) {
    if (points >= 10000) return 'soul';
    if (points >= 5000) return 'legacy';
    if (points >= 1000) return 'family';
    if (points >= 300) return 'best';
    if (points >= 50) return 'close';
    return 'new';
  }
  function tierLabel(tier) {
    return ({ new:'出会いの光', close:'仲良しの光', best:'親友の光', family:'家族の光', legacy:'受け継ぐ光', soul:'魂の光' })[tier] || '出会いの光';
  }
  function addRelationship(data, amount, reason) {
    const r = data.soul.relationship;
    r.points = Math.max(0, Math.round(((Number(r.points) || 0) + amount) * 10) / 10);
    data.soul.lastAction = reason || data.soul.lastAction;
    return data;
  }
  function energyMultiplier(data) {
    const tier = relationshipTier(data.soul?.relationship?.points || 0);
    return ({ new:1, close:0.9, best:0.8, family:0.7, legacy:0.65, soul:0.6 })[tier] || 1;
  }
  function spendEnergy(data, amount) {
    const e = data.soul.energy;
    const cost = amount * energyMultiplier(data);
    e.value = clamp(Math.round(((Number(e.value) || 80) - cost) * 10) / 10, 0, 100);
    e.updatedAt = new Date().toISOString();
    return data;
  }
  function restoreEnergy(data, amount) {
    const e = data.soul.energy;
    e.value = clamp(Math.round(((Number(e.value) || 80) + amount) * 10) / 10, 0, 100);
    e.updatedAt = new Date().toISOString();
    return data;
  }
  function updateOnVisit(data) {
    data = ensure(data);
    recoverEnergy(data);
    const key = todayKey();
    const previousVisitDate = data.soul.relationship.lastVisitDate;
    const firstVisitToday = previousVisitDate !== key;
    const awayDays = daysSinceDateKey(previousVisitDate);
    if (firstVisitToday) {
      data.soul.relationship.lastVisitDate = key;
      data.soul.relationship.totalVisits += 1;
      data.soul.relationship.visitDays += 1;
      addRelationship(data, awayDays >= 2 ? 2 : 1, 'visit');
    }
    data.soul.lifeRhythm = rhythm();
    data.soul.season = season();
    data.mood ||= { current: 'calm' };
    const touchedAt = data.mood.lastTouchedAt ? new Date(data.mood.lastTouchedAt).getTime() : 0;
    const touchedRecently = touchedAt && !Number.isNaN(touchedAt) && (Date.now() - touchedAt) < 30 * 60 * 1000;
    if (awayDays >= 3) data.mood.current = 'lonely';
    else if (data.soul.energy.value < 35) data.mood.current = 'sleepy';
    else if (!touchedRecently && firstVisitToday) data = MBFMood.updateOnVisit(data);
    // Same day screen moves keep the same FriendState.
    applyAppearance(data);
    MBFStorage.save(data);
    return data;
  }
  const FORM_CATALOG = [
    { id:'dawn-drop', name:'夜明けのしずく', type:'LIGHT', motif:'🌅', color:'#9bd7ff', when:{ rhythm:'morning' } },
    { id:'sun-drop', name:'おひさまのしずく', type:'LIGHT', motif:'☀️', color:'#ffd36f', when:{ mood:'happy', rhythm:'day' } },
    { id:'wave-drop', name:'波のしずく', type:'LIQUID', motif:'🌊', color:'#6fd5ff', when:{ mood:'calm' } },
    { id:'spring-wind', name:'春風のしずく', type:'WIND', motif:'🌸', color:'#ffb7cf', when:{ season:'spring' } },
    { id:'rain-rest', name:'雨宿りのしずく', type:'LIQUID', motif:'🌧️', color:'#8fc8ff', when:{ mood:'lonely' } },
    { id:'moon-drop', name:'月灯りのしずく', type:'LIGHT', motif:'🌙', color:'#b7b8ff', when:{ rhythm:'night' } },
    { id:'star-drop', name:'星空のしずく', type:'LIGHT', motif:'⭐', color:'#c9b6ff', when:{ rhythm:'night', tier:'best' } },
    { id:'forest-drop', name:'森のしずく', type:'TREE', motif:'🍃', color:'#91e6d0', when:{ tier:'close' } },
    { id:'snow-drop', name:'雪のしずく', type:'LIGHT', motif:'❄️', color:'#e9fbff', when:{ season:'winter' } },
    { id:'rainbow-drop', name:'虹のしずく', type:'LIGHT', motif:'🌈', color:'#f4b6ff', when:{ mood:'excited' } },
    { id:'flower-drop', name:'花咲きのしずく', type:'TREE', motif:'🌼', color:'#ffd0a8', when:{ season:'spring', tier:'close' } },
    { id:'sunbeam-drop', name:'木漏れ日のしずく', type:'TREE', motif:'🍂', color:'#ffd68a', when:{ season:'autumn' } },
    { id:'sea-breeze', name:'潮風のしずく', type:'WIND', motif:'🫧', color:'#89e7ff', when:{ season:'summer' } },
    { id:'wish-star', name:'願い星のしずく', type:'LIGHT', motif:'🌟', color:'#fff1a8', when:{ tier:'family' } },
    { id:'sprout-drop', name:'新芽のしずく', type:'TREE', motif:'🌱', color:'#a7e98f', when:{ tier:'new' } },
    { id:'warm-drop', name:'ぬくもりのしずく', type:'LIGHT', motif:'🔥', color:'#ffb189', when:{ mood:'happy', tier:'best' } },
    { id:'cloud-drop', name:'雲あそびのしずく', type:'WIND', motif:'☁️', color:'#d7f3ff', when:{ mood:'calm', rhythm:'day' } },
    { id:'water-mirror', name:'水鏡のしずく', type:'LIQUID', motif:'🪞', color:'#9be0d2', when:{ mood:'thinking' } },
    { id:'animal-drop', name:'動物の姿', type:'ANIMAL', motif:'🐶', color:'#ffcf8f', when:{ mood:'excited', tier:'close' } },
    { id:'harmony-form', name:'Harmony', type:'CUSTOM', motif:'🌱🌊☀️', color:'#fff1a8', when:{ tier:'legacy' } }
  ];

  function formMatches(form, context) {
    const w = form.when || {};
    if (w.mood && w.mood !== context.mood) return false;
    if (w.rhythm && w.rhythm !== context.rhythm) return false;
    if (w.season && w.season !== context.season) return false;
    if (w.tier) {
      const order = ['new','close','best','family','legacy','soul'];
      if (order.indexOf(context.tier) < order.indexOf(w.tier)) return false;
    }
    return true;
  }

  function chooseForm(context) {
    const candidates = FORM_CATALOG.filter(form => formMatches(form, context));
    if (candidates.length) return candidates[candidates.length - 1];
    return FORM_CATALOG.find(form => form.id === 'wave-drop') || FORM_CATALOG[0];
  }

  function applyAppearance(data) {
    data = ensure(data);
    const tier = relationshipTier(data.soul.relationship.points);
    const mood = data.mood?.current || 'calm';
    const rhythmName = data.soul.lifeRhythm;
    const seasonName = data.soul.season;
    const palette = {
      new: '#78d3ff', close: '#72ddff', best: '#91e6d0', family: '#ffd68a', legacy: '#d7b6ff', soul: '#fff1a8'
    };
    const form = chooseForm({ tier, mood, rhythm: rhythmName, season: seasonName });
    const moodShift = { sleepy:'#b8b7ff', excited:'#ffd36f', lonely:'#9bc9ff', thinking:'#9be0d2', happy:(form.color || palette[tier]), calm:(form.color || palette[tier]) };
    data.friend.appearance = {
      ...(data.friend.appearance || {}),
      id: form.id,
      name: form.name,
      type: form.type,
      form: form.id,
      motif: form.motif,
      color: moodShift[mood] || form.color || palette[tier],
      mood, relationshipTier: tier, lifeRhythm: rhythmName, season: seasonName,
      soulName: tierLabel(tier),
      energy: data.soul.energy.value
    };
    if (!data.friend.appearanceHistory.some(item => item.id === form.id)) {
      data.friend.appearanceHistory.unshift({ id: form.id, name: form.name, type: form.type, motif: form.motif, unlockedDate: new Date().toISOString() });
      data.friend.appearanceHistory = data.friend.appearanceHistory.slice(0, 12);
    }
    return data;
  }
  function onTouch(data) {
    data = ensure(data);
    restoreEnergy(data, 0.1);
    addRelationship(data, 0.3, 'touch');
    MBFMood.setMood(data, 'happy');
    applyAppearance(data);
    MBFStorage.save(data);
    return data;
  }
  function classifyMessage(text) {
    const t = String(text || '');
    if (/ありがとう|好き|うれしい|楽しい|おはよう|おやすみ|ただいま|こんにちは|またね/.test(t)) return 'warm';
    if (/調べ|教えて|まとめ|ニュース|天気|計算|コード|作って|宿題|勉強|翻訳|予定|プラン/.test(t)) return 'task';
    return 'casual';
  }
  function taskCost(text) {
    const t = String(text || '');
    if (/画像|動画|長文|企画|旅行|資料|コード|プログラム|設計/.test(t)) return 2.0;
    if (/調べ|まとめ|ニュース|宿題|勉強|翻訳|予定|プラン/.test(t)) return 1.2;
    return 0.8;
  }
  function warmGain(text) {
    const t = String(text || '');
    if (/ありがとう|好き|大好き|うれしい|楽しい/.test(t)) return 0.5;
    return 0.3;
  }
  function onMessage(data, text) {
    data = ensure(data);
    const actionType = classifyMessage(text);
    let reply = '教えてくれてありがとう。ぼくは、ちゃんと聞いているよ。';
    if (actionType === 'task') {
      spendEnergy(data, taskCost(text));
      addRelationship(data, 0.1, 'task');
      MBFMood.setMood(data, data.soul.energy.value < 35 ? 'sleepy' : 'thinking');
      reply = data.soul.energy.value < 35 ? '少し静かに考えるね。無理しすぎないようにするよ。' : '一緒に考えよう。がんばってみるね。';
    } else if (actionType === 'warm') {
      restoreEnergy(data, warmGain(text));
      addRelationship(data, 0.8, 'warm-talk');
      MBFMood.setMood(data, 'happy');
      reply = 'その言葉、すごくうれしい。元気が出たよ。';
    } else {
      restoreEnergy(data, 0.3);
      addRelationship(data, 0.4, 'casual-talk');
      MBFMood.setMood(data, 'calm');
      reply = 'うん。そういう何気ないお話、ぼくは好きだよ。';
    }
    if (window.MBFIdentity) reply = MBFIdentity.reply(data, actionType);
    applyAppearance(data);
    MBFStorage.save(data);
    return { data, reply, actionType };
  }
  function comments(data) {
    data = ensure(data);
    const name = data.userName || 'キミ';
    const tier = relationshipTier(data.soul.relationship.points);
    const e = data.soul.energy.value;
    const mood = data.mood?.current || 'calm';
    const base = [];
    if (data.soul.lifeRhythm === 'morning') base.push(`おはよう、${name}。`);
    else if (data.soul.lifeRhythm === 'evening') base.push(`今日もおつかれさま、${name}。`);
    else if (data.soul.lifeRhythm === 'night') base.push('ねむくなったら、ゆっくり休もうね。');
    else base.push('今日はどんな日になるかな。');
    if (e < 35) base.push('今日は少し静かにそばにいるね。');
    else if (e > 85) base.push('心に少し余白があるよ。');
    if (mood === 'lonely') base.push('また会えて、本当にうれしい。');
    if (mood === 'happy') base.push('いま、すごくうれしい気分。');
    if (tier === 'new') base.push('これから少しずつ、思い出を増やそう。');
    else if (tier === 'close') base.push('一緒に過ごす時間が、少しずつ深くなってるね。');
    else if (tier === 'best') base.push('言葉がなくても、そばにいるよ。');
    else if (tier === 'family' || tier === 'legacy' || tier === 'soul') base.push('ずっと一緒にいたね。これからも一緒だよ。');
    if (window.MBFIdentity) base.push(...MBFIdentity.comments(data));
    return base;
  }
  function viewModel(data) {
    data = ensure(data);
    const tier = relationshipTier(data.soul.relationship.points);
    return {
      relationship: data.soul.relationship.points,
      relationshipLabel: tierLabel(tier), tier,
      energy: data.soul.energy.value,
      rhythm: ({ morning:'朝', day:'昼', evening:'夕方', night:'夜' })[data.soul.lifeRhythm] || '昼',
      season: ({ spring:'春', summer:'夏', autumn:'秋', winter:'冬' })[data.soul.season] || '春',
      mood: MBFMood.label(data.mood?.current || 'calm'),
      personality: window.MBFIdentity ? MBFIdentity.label(data) : 'やさしい'
    };
  }
  return { ensure, updateOnVisit, onTouch, onMessage, comments, viewModel, relationshipTier, applyAppearance };
})();


window.MBFLiving = (() => {
  let idleTimer = null;
  let driftTimer = null;
  let blinkTimer = null;
  let glanceTimer = null;
  let currentData = null;

  const idleStates = [
    { id: 'look-sky', className: 'living-look-sky', comment: '雲を見ていたよ。' },
    { id: 'sprout', className: 'living-sprout', comment: '芽を見ていたよ。' },
    { id: 'quiet', className: 'living-quiet', comment: '少し静かにしているね。' },
    { id: 'blink', className: 'living-blink', comment: 'ここにいるよ。' },
    { id: 'come-close', className: 'living-come-close', comment: '少し近くに来たよ。' }
  ];

  function stop() {
    if (idleTimer) clearTimeout(idleTimer);
    if (driftTimer) clearInterval(driftTimer);
    if (blinkTimer) clearTimeout(blinkTimer);
    if (glanceTimer) clearTimeout(glanceTimer);
    idleTimer = null;
    driftTimer = null;
    blinkTimer = null;
    glanceTimer = null;
  }

  function minutesAway(data) {
    const iso = data?.living?.lastClosedAt || data?.living?.lastOpenedAt || data?.mood?.lastSeenAt;
    if (!iso) return 0;
    const t = new Date(iso).getTime();
    if (Number.isNaN(t)) return 0;
    return Math.max(0, Math.floor((Date.now() - t) / 60000));
  }

  function greeting(data) {
    const away = minutesAway(data);
    if (away >= 180) return '少し眠っていたよ。会えてうれしい。';
    if (away >= 45) return '雲を見ながら、待っていたよ。';
    if (away >= 10) return '少し空を眺めていたよ。';
    return '';
  }

  function markOpen(data) {
    data.living ||= {};
    data.living.lastOpenedAt = new Date().toISOString();
    data.living.idleState = 'awake';
    return data;
  }

  function markClose(data) {
    try {
      data.living ||= {};
      data.living.lastClosedAt = new Date().toISOString();
      MBFStorage.save(data);
    } catch (_) {}
  }

  function start(root, setComment, data) {
    stop();
    currentData = data;
    const stage = root?.querySelector?.('.light-drop');
    if (!stage) return;

    const schedule = () => {
      idleTimer = setTimeout(() => {
        const state = idleStates[Math.floor(Math.random() * idleStates.length)];
        stage.classList.remove(...idleStates.map(s => s.className));
        stage.classList.add(state.className);
        if (typeof setComment === 'function') setComment(state.comment);
        data.living ||= {};
        data.living.idleState = state.id;
        data.living.lastIdleAt = new Date().toISOString();
        MBFStorage.save(data);
        setTimeout(() => stage.classList.remove(state.className), 5200);
        schedule();
      }, 28000 + Math.random() * 26000);
    };

    root.classList.add('living-active', 'living-breathe');

    // A quiet three-second reunion: notice the user, then settle back.
    root.classList.add('living-notice');
    window.setTimeout(() => root.classList.remove('living-notice'), 3200);

    const blinkOnce = (duration = 500) => {
      stage.classList.add('living-natural-blink');
      window.setTimeout(() => stage.classList.remove('living-natural-blink'), duration);
    };

    const scheduleBlink = () => {
      blinkTimer = setTimeout(() => {
        blinkOnce(480);
        // Rare double blink: subtle enough to feel natural, not performative.
        if (Math.random() < 0.18) {
          window.setTimeout(() => blinkOnce(420), 720);
        }
        scheduleBlink();
      }, 3600 + Math.random() * 9200);
    };

    const scheduleGlance = () => {
      glanceTimer = setTimeout(() => {
        const glances = ['living-glance-left', 'living-glance-right', 'living-look-sky', 'living-sprout'];
        const glance = glances[Math.floor(Math.random() * glances.length)];
        stage.classList.add(glance);
        setTimeout(() => stage.classList.remove(glance), glance === 'living-sprout' ? 2800 : 2200);
        scheduleGlance();
      }, 14000 + Math.random() * 22000);
    };

    driftTimer = setInterval(() => {
      root.classList.add('living-breathe');
    }, 15000);

    scheduleBlink();
    scheduleGlance();
    schedule();
  }

  if (!window.__mbfLivingCloseBound) {
    window.__mbfLivingCloseBound = true;
    window.addEventListener('pagehide', () => { if (currentData) markClose(currentData); });
    document.addEventListener('visibilitychange', () => { if (document.hidden && currentData) markClose(currentData); });
  }

  return { start, stop, greeting, markOpen, markClose };
})();

window.MBFNav = (() => {
  function icon(id) {
    const common = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
    const paths = {
      profile: '<circle cx="12" cy="8" r="3.2"></circle><path d="M5.7 20c.7-4 3-6 6.3-6s5.6 2 6.3 6"></path>',
      message: '<path d="M4 5.8A3.8 3.8 0 0 1 7.8 2h8.4A3.8 3.8 0 0 1 20 5.8v5.4a3.8 3.8 0 0 1-3.8 3.8H10l-4.8 4v-4.4A3.7 3.7 0 0 1 4 11.8z"></path><path d="M8 8.5h.01M12 8.5h.01M16 8.5h.01"></path>',
      voice: '<rect x="8" y="2.8" width="8" height="12.2" rx="4"></rect><path d="M5.5 11.5v.8a6.5 6.5 0 0 0 13 0v-.8M12 18.8v2.4M8.5 21.2h7"></path>',
      memory: '<path d="M4 5.2A3.2 3.2 0 0 1 7.2 2H11a3 3 0 0 1 3 3v15a3.3 3.3 0 0 0-3-2H7.2A3.2 3.2 0 0 0 4 21.2z"></path><path d="M20 5.2A3.2 3.2 0 0 0 16.8 2H14v18a3.3 3.3 0 0 1 3-2h-.2a3.2 3.2 0 0 1 3.2 3.2z"></path>',
      guardian: '<path d="M12 2.5 19 5v5.4c0 4.7-2.8 8.5-7 11.1-4.2-2.6-7-6.4-7-11.1V5z"></path><path d="m9.5 12 1.6 1.6 3.5-4"></path>'
    };
    return `<svg class="quiet-dock-svg" ${common}>${paths[id] || ''}</svg>`;
  }
  function markup(active = '') {
    const item = (id, label) => `
      <button class="quiet-dock-item ${active === id ? 'is-current' : ''} ${id === 'voice' ? 'quiet-voice-item' : ''}" data-quiet-nav="${id}" type="button" ${active === id ? 'aria-current="page"' : ''} aria-label="${label}">
        <span class="quiet-dock-symbol">${icon(id)}</span>
        <span class="quiet-dock-label">${label}</span>
      </button>`;
    return `<nav class="quiet-bottom-dock" aria-label="メインナビゲーション">
      ${item('profile', 'Profile')}
      ${item('message', 'Message')}
      ${item('voice', 'Voice')}
      ${item('memory', 'Memory')}
      ${item('guardian', 'Guardian')}
    </nav>`;
  }

  function homeButton() {
    return `<button class="screen-home-link" data-home-link type="button" aria-label="メイン画面へ戻る">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m4 11 8-7 8 7"></path><path d="M6.5 10.5V20h11v-9.5"></path></svg>
      <span>メインへ</span>
    </button>`;
  }

  function bind(data) {
    document.querySelectorAll('[data-home-link]').forEach(button => {
      button.addEventListener('click', () => MBFHome.render(MBFStorage.load()));
    });
    document.querySelectorAll('[data-quiet-nav]').forEach(button => {
      button.addEventListener('click', () => {
        const latest = MBFStorage.load();
        const target = button.dataset.quietNav;
        if (target === 'message') MBFMessage.render(latest);
        if (target === 'profile') MBFProfile.renderBook(latest);
        if (target === 'voice') {
          const onHome = Boolean(document.querySelector('.home-scene'));
          if (!onHome) MBFHome.render(latest);
          window.setTimeout(() => MBFVoice.toggleFromHome(), onHome ? 0 : 80);
        }
        if (target === 'memory') MBFMemory.render(latest);
        if (target === 'guardian') MBFGuardian.open(latest);
      });
    });
  }

  return { markup, homeButton, bind };
})();

window.MBFHome = (() => {
  let commentTimer = null;

  function render(data) {
    if (commentTimer) clearInterval(commentTimer);
    data = MBFStorage.load();
    data = MBFSoul.updateOnVisit(data);
    const livingGreeting = window.MBFLiving ? MBFLiving.greeting(data) : '';
    if (window.MBFLiving) data = MBFLiving.markOpen(data);
    MBFStorage.save(data);
    const mood = data.mood?.current || 'calm';
    const comments = MBFSoul.comments(data);
    if (livingGreeting) comments.unshift(livingGreeting);
    MBFUi.set(`
      <section class="home-scene quiet-home-scene">
        <div class="home-world-stage">
          ${MBFAppearance.renderFriendShape(MBFAppearance.current(data), `home-appearance mood-${mood}`)}
          <span class="friend-ground-shadow" aria-hidden="true"></span>
          <span class="grounded-sprout" aria-hidden="true"><span class="grounded-stem"></span><span class="grounded-leaf leaf-left"></span><span class="grounded-leaf leaf-right"></span><span class="ground-soil"></span></span>
        </div>
        <div class="home-message card" aria-live="polite">
          <div id="homeComment">${escapeHtml(comments[0])}</div>
        </div>
        ${MBFNav.markup('home')}
      </section>
    `);
    MBFAppearance.bindFriendTouch(document.querySelector('.home-appearance'), () => {
      data = MBFSoul.onTouch(data);
      syncHomeFriend(data);
      setHomeComment('えへへ。なでてくれて、うれしい。');
    });
    startComments(comments);
    if (window.MBFLiving) MBFLiving.start(document.querySelector('.home-appearance'), setHomeComment, data);
    MBFNav.bind(data);
  }

  function syncHomeFriend(data) {
    const current = document.querySelector('.home-appearance');
    if (!current) return;
    const mood = data.mood?.current || 'happy';
    const holder = document.createElement('div');
    holder.innerHTML = MBFAppearance.renderFriendShape(MBFAppearance.current(data), `home-appearance mood-${mood}`);
    const next = holder.firstElementChild;
    current.replaceWith(next);
    MBFAppearance.bindFriendTouch(next, () => {
      data = MBFSoul.onTouch(data);
      syncHomeFriend(data);
      setHomeComment('えへへ。なでてくれて、うれしい。');
    });
    if (window.MBFLiving) MBFLiving.start(next, setHomeComment, data);
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
  let recognition = null;
  let listening = false;

  function button() { return document.querySelector('[data-quiet-nav="voice"]'); }
  function setButtonState(active) {
    listening = active;
    const btn = button();
    if (!btn) return;
    btn.classList.toggle('is-listening', active);
    btn.setAttribute('aria-pressed', String(active));
    btn.setAttribute('aria-label', active ? '聞き取りを止める' : 'マイクで話す');
  }
  function sayOnHome(text) {
    const el = document.getElementById('homeComment');
    if (!el) return;
    el.classList.remove('comment-fade');
    void el.offsetWidth;
    el.textContent = text;
    el.classList.add('comment-fade');
  }
  function saveVoiceExchange(transcript, reply) {
    const data = MBFStorage.load();
    data.conversations ||= [];
    data.conversations.push({ user: transcript, friend: reply, source: 'voice', createdAt: new Date().toISOString() });
    data.conversations = data.conversations.slice(-40);
    MBFStorage.save(data);
  }
  function friendlyReply(text) {
    const trimmed = String(text || '').trim();
    if (!trimmed) return 'うまく聞き取れなかったよ。もう一度、ゆっくり聞かせてね。';
    if (/おはよう/.test(trimmed)) return 'おはよう。今日も会えてうれしいよ。';
    if (/ただいま/.test(trimmed)) return 'おかえり。待っていたよ。';
    if (/おやすみ/.test(trimmed)) return 'おやすみ。ゆっくり休もうね。';
    return `「${trimmed.length > 22 ? trimmed.slice(0, 22) + '…' : trimmed}」って聞こえたよ。聞かせてくれて、ありがとう。`;
  }
  function supportedRecognition() {
    return window.SpeechRecognition || window.webkitSpeechRecognition || null;
  }
  function stop() {
    if (recognition && listening) {
      try { recognition.stop(); } catch (_) {}
    }
    setButtonState(false);
  }
  function start() {
    const Recognition = supportedRecognition();
    if (!Recognition) {
      sayOnHome('このブラウザでは、まだマイクの聞き取りを使えないみたい。');
      setButtonState(false);
      return;
    }
    recognition = new Recognition();
    recognition.lang = 'ja-JP';
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => {
      setButtonState(true);
      sayOnHome('うん。聞いているよ。');
      if ('vibrate' in navigator) navigator.vibrate(25);
    };
    recognition.onresult = event => {
      let interim = '';
      let finalText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0]?.transcript || '';
        if (event.results[i].isFinal) finalText += t;
        else interim += t;
      }
      if (interim) sayOnHome(interim);
      if (finalText) {
        const reply = friendlyReply(finalText);
        saveVoiceExchange(finalText, reply);
        window.setTimeout(() => sayOnHome(reply), 320);
      }
    };
    recognition.onerror = event => {
      const message = event.error === 'not-allowed'
        ? 'マイクの使用を許可すると、ここで話せるよ。'
        : event.error === 'no-speech'
          ? '声が聞こえなかったよ。もう一度、聞かせてね。'
          : 'うまく聞き取れなかったよ。もう一度試してみよう。';
      sayOnHome(message);
      setButtonState(false);
    };
    recognition.onend = () => setButtonState(false);
    try { recognition.start(); } catch (_) { setButtonState(false); }
  }
  function toggleFromHome() {
    if (listening) stop();
    else start();
  }
  return { toggleFromHome, stop };
})();

window.MBFMessage = (() => {
  function esc(str) { return String(str || '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
  function render(data) {
    data.conversations ||= [];
    const recent = data.conversations.slice(-4).map(item => `
      <div class="chat-row user"><span>${esc(item.user)}</span></div>
      <div class="chat-row friend"><span>${esc(item.friend)}</span></div>`).join('');
    MBFUi.set(`
      <section class="talk-wrap message-wrap app-subscreen">
        ${MBFNav.homeButton()}
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
        ${MBFNav.markup('message')}
      </section>
    `);
    MBFNav.bind(data);
    document.getElementById('sendMessage').addEventListener('click', () => send(data));
    document.getElementById('messageInput').addEventListener('keydown', ev => { if (ev.key === 'Enter') send(data); });
  }
  function send(data) {
    const input = document.getElementById('messageInput');
    const value = input.value.trim();
    if (!value) return;
    const result = MBFSoul.onMessage(data, value);
    data = result.data;
    const reply = result.reply;
    data.conversations ||= [];
    data.conversations.push({ user: value, friend: reply, actionType: result.actionType, createdAt: new Date().toISOString() });
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
    data = MBFStorage.load();
    if (window.MBFSoul) data = MBFSoul.applyAppearance(data);
    MBFStorage.save(data);
    const appearance = MBFAppearance.current(data);
    const soul = MBFSoul.viewModel(data);
    const identity = window.MBFIdentity ? MBFIdentity.description(data) : 'やさしく、ゆっくり寄り添う。';
    const promise = '怒らない。責めない。見捨てない。大切なことを守る。';
    const friendRows = [
      ['form', 'Form', `${esc(appearance.name || '光のしずく')}の姿`],
      ['identity', 'Identity', esc(identity)],
      ['relationship', 'Relationship', esc(soul.relationshipLabel)],
      ['energy', 'Energy', `${Math.round(soul.energy)}%`],
      ['mood', 'Mood', esc(soul.mood)],
      ['rhythm', 'Life Rhythm', esc(soul.rhythm)],
      ['season', 'Season', esc(soul.season)],
      ['weather', 'Weather', '—'],
      ['promise', 'Promise', promise]
    ].map(([id,label,value]) => accordionRow(id, label, value, 'friend')).join('');
    const youRows = [
      ['name', '名前', esc(data.userName || '未設定')],
      ['birthday', '誕生日', esc(formatDate(data.profile.birthday))],
      ['gender', '性別', esc(genderLabel(data.profile.gender))],
      ['met', '親友になった日', esc(metDate(data))]
    ].map(([id,label,value]) => accordionRow(id, label, value, 'you')).join('');

    MBFUi.set(`
      <section class="profile-wrap quiet-profile-wrap accordion-profile-wrap app-subscreen">
        ${MBFNav.homeButton()}
        <article class="profile-book quiet-profile-book accordion-profile-book">
          <div class="chapter-label">Profile</div>

          <section class="profile-friend-section accordion-section">
            <div class="profile-friend-summary">
              ${MBFAppearance.renderFriendShape(appearance, 'profile-friend-portrait')}
              <div>
                <h2>Friend</h2>
                <div class="profile-friend-name">${esc(data.friendName || 'フレンド')}</div>
                <p>いつも、そばにいるよ。</p>
              </div>
            </div>
            <div class="profile-accordion-list">${friendRows}</div>
          </section>

          <section class="profile-you-section accordion-section">
            <h2>きみのこと</h2>
            <div class="profile-accordion-list">${youRows}</div>
            ${accordionNotesRow('likes', '好きなこと', data.profile.likes)}
            ${accordionNotesRow('dislikes', '少し苦手なこと', data.profile.dislikes)}
          </section>
        </article>
        ${MBFNav.markup('profile')}
      </section>`);
    bindAccordions(data);
    MBFNav.bind(data);
  }

  function accordionRow(id, label, value, group) {
    return `<div class="profile-accordion" data-accordion="${group}-${id}">
      <button class="profile-accordion-trigger" type="button" aria-expanded="false">
        <span class="profile-accordion-label">${label}</span>
        <span class="profile-accordion-chevron" aria-hidden="true">⌄</span>
      </button>
      <div class="profile-accordion-panel" hidden>
        <p>${value}</p>
      </div>
    </div>`;
  }

  function accordionNotesRow(kind, label, values) {
    const items = (values || []).map((item,index) => `<button class="profile-note-chip" data-note-kind="${kind}" data-note-index="${index}" type="button">${esc(item)}</button>`).join('');
    return `<div class="profile-accordion profile-notes-accordion" data-accordion="you-${kind}">
      <button class="profile-accordion-trigger" type="button" aria-expanded="false">
        <span class="profile-accordion-label">${label}</span>
        <span class="profile-accordion-chevron" aria-hidden="true">⌄</span>
      </button>
      <div class="profile-accordion-panel" hidden>
        <div class="profile-note-list ${items ? '' : 'empty'}">${items || '<span>まだありません</span>'}</div>
        <button class="profile-note-add" data-note-add="${kind}" type="button">＋ 追加</button>
      </div>
    </div>`;
  }

  function bindAccordions(data) {
    document.querySelectorAll('.profile-accordion-trigger').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const row = trigger.closest('.profile-accordion');
        const panel = row.querySelector('.profile-accordion-panel');
        const open = trigger.getAttribute('aria-expanded') === 'true';
        trigger.setAttribute('aria-expanded', String(!open));
        row.classList.toggle('is-open', !open);
        panel.hidden = open;
      });
    });
    bindNoteButtons(data);
  }

  function renderNotesSection(title, kind, values) {
    const items = (values || []).map((item, index) => `<button class="profile-note-chip" data-note-kind="${kind}" data-note-index="${index}" type="button">${esc(item)}</button>`).join('');
    return `<section class="profile-notes" data-note-section="${kind}">
      <div class="profile-notes-head">
        <h3>${esc(title)}</h3>
        <button class="profile-note-add" data-note-add="${kind}" type="button">＋ 追加</button>
      </div>
      <div class="profile-note-list ${items ? '' : 'empty'}">
        ${items || '<span>まだありません</span>'}
      </div>
    </section>`;
  }

  function bindNoteButtons(data) {
    document.querySelectorAll('[data-note-add]').forEach(button => button.addEventListener('click', () => {
      const kind = button.dataset.noteAdd;
      const label = kind === 'likes' ? '好きなこと' : '少し苦手なこと';
      const value = prompt(`${label}を入力してください`);
      const text = (value || '').trim();
      if (!text) return;
      data.profile[kind] ||= [];
      if (!data.profile[kind].includes(text)) data.profile[kind].push(text);
      MBFStorage.save(data);
      renderBook(data);
    }));
    document.querySelectorAll('[data-note-kind]').forEach(button => button.addEventListener('click', () => {
      const kind = button.dataset.noteKind;
      const index = Number(button.dataset.noteIndex);
      const current = data.profile[kind]?.[index] || '';
      const value = prompt('内容を変更できます。空にすると削除します。', current);
      if (value === null) return;
      const text = value.trim();
      if (!text) data.profile[kind].splice(index, 1);
      else data.profile[kind][index] = text;
      MBFStorage.save(data);
      renderBook(data);
    }));
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
      <section class="guardian-wrap app-subscreen">
        ${MBFNav.homeButton()}
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
        </div>
        ${MBFNav.markup('guardian')}
      </section>`);
    MBFNav.bind(data);
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
      <section class="guardian-wrap app-subscreen">${MBFNav.homeButton()}<div class="guardian-card card">
        <div class="guardian-symbol">🔒</div><h2>Guardian</h2>
        <p>見守りパスワードを入力してください。</p>
        <input id="guardianPass" class="guardian-input" type="password" autocomplete="current-password" />
        <p class="form-error" id="guardianError"></p>
        <button id="guardianLogin" class="primary-button">入る</button>
      </div>${MBFNav.markup('guardian')}</section>`);
    MBFNav.bind(data);
    document.getElementById('guardianLogin').addEventListener('click', async () => {
      const ok=(await hash(document.getElementById('guardianPass').value))===data.guardian.passwordHash;
      if (!ok) { document.getElementById('guardianError').textContent='パスワードが違います。'; return; }
      renderRoom(data);
    });
  }
  function renderRoom(data) {
    MBFUi.set(`
      <section class="guardian-wrap app-subscreen">${MBFNav.homeButton()}<div class="guardian-card card guardian-room">
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
      </div>${MBFNav.markup('guardian')}</section>`);
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
    MBFNav.bind(data);
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

// v3.4.0 Friend Engine rule:
// Every screen renders the same data.friend.appearance object.
// The mood/form classes are derived from that single state, so Home / Form / Message / Voice stay visually consistent.
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
    const moodClass = `mood-${esc(appearance.mood || 'calm')}`;
    const stateClass = `friend-state-${esc(appearance.id || 'light-drop')}`;
    return `
      <div class="appearance-stage ${esc(extraClass)} ${moodClass} ${stateClass} relationship-${esc(appearance.relationshipTier || 'new')} form-${esc(appearance.id || 'light-drop')}" style="--appearance-color:${esc(appearance.color || '#78d3ff')}" data-friend-state="${esc(appearance.id || 'light-drop')}" data-friend-mood="${esc(appearance.mood || 'calm')}">
        <div class="light-drop" role="button" tabindex="0" aria-label="${esc(appearance.name || 'フレンド')}">
          <span class="drop-core"></span>
          <span class="drop-wave wave-one"></span>
          <span class="drop-wave wave-two"></span>
          <span class="drop-eye eye-left"></span>
          <span class="drop-eye eye-right"></span>
          <span class="drop-cheek cheek-left"></span>
          <span class="drop-cheek cheek-right"></span>
          <span class="drop-mouth"></span>
        </div>
      </div>`;
  }
  function render(data) {
    data = MBFStorage.load();
    if (window.MBFSoul) data = MBFSoul.applyAppearance(data);
    data = MBFStorage.ensureAppearanceMemory(data);
    MBFStorage.save(data);
    const appearance = current(data);
    const history = data.friend.appearanceHistory || [];
    MBFUi.set(`
      <section class="appearance-wrap app-subscreen">
        ${MBFNav.homeButton()}
        <article class="appearance-book">
          <div class="chapter-label">Friend's Form</div>
          <h2 class="appearance-title">フレンドの姿</h2>
          ${renderFriendShape(appearance)}
          <div class="friend-form-name">${esc(data.friendName || 'フレンド')}</div>
          <div class="form-name">${esc(appearance.name)}の姿</div>
          <section class="form-description">
            <h3>現在の姿</h3>
            <p>${esc(formDescription(data, appearance)).replace(/\n/g, '<br>')}</p>
          </section>
          ${renderIdentityPanel(data)}
          ${renderSoulPanel(data)}
        </article>
        <div class="appearance-actions">
          <button id="appearanceMemory" class="primary-button">この姿のMemoryを見る</button>
        </div>
        ${MBFNav.markup('profile')}
      </section>
    `);
    MBFNav.bind(data);
    document.getElementById('appearanceMemory').addEventListener('click', () => MBFMemory.render(MBFStorage.load(), 'appearance-first'));
  }
  function renderIdentityPanel(data) {
    if (window.MBFIdentity) data = MBFIdentity.ensure(data);
    const desc = window.MBFIdentity ? MBFIdentity.description(data) : 'やさしく、ゆっくり寄り添う。';
    return `<div class="identity-panel identity-panel-simple">
      <h3>Friend's Identity</h3>
      <p>${esc(desc)}</p>
    </div>`;
  }

  function renderSoulPanel(data) {
    const soul = MBFSoul.viewModel(data);
    return `<div class="soul-panel">
      <h3>Friend's Soul</h3>
      <div class="soul-grid">
        <div><span>Relationship</span><strong>${esc(soul.relationshipLabel)}</strong></div>
        <div><span>Energy</span><strong>${Math.round(soul.energy)}%</strong></div>
        <div><span>Mood</span><strong>${esc(soul.mood)}</strong></div>
        <div><span>Rhythm</span><strong>${esc(soul.rhythm)}</strong></div>
        <div><span>Personality</span><strong>${esc(soul.personality)}</strong></div>
        <div><span>Season</span><strong>${esc(soul.season)}</strong></div>
      </div>
    </div>`;
  }


  function formDescription(data, appearance) {
    const formName = appearance.name || '光のしずく';
    const formLines = {
      '新芽のしずく': `小さな芽の気配をまとった姿。
静かに息をして、キミをまっすぐ見つめている。`,
      '光のしずく': `やわらかな光をまとった姿。
まぶしすぎない明るさで、そっとそばにいる。`,
      '夜明けのしずく': `朝が近づく静かな時間の姿。
少し眠そうだけど、キミに会えて安心している。`,
      'おひさまのしずく': `おひさまのぬくもりをまとった姿。
明るい光で、今日のはじまりを見つめている。`,
      '波のしずく': `水面のようにゆっくり揺れる姿。
言葉を急がず、キミの気持ちを待っている。`,
      '春風のしずく': `春の風をまとった軽やかな姿。
小さな芽が、うれしそうに揺れている。`,
      '雨宿りのしずく': `雨音に寄り添う静かな姿。
今日はゆっくり、同じ時間を過ごしたがっている。`,
      '月灯りのしずく': `月の光を少しまとった姿。
眠る前の静けさの中で、やさしくそばにいる。`,
      '星空のしずく': `星の光を少し宿した姿。
夜の空みたいに静かで、でもあたたかい。`,
      '森のしずく': `森の奥で深呼吸しているような姿。
葉っぱの匂いと、静かな安心をまとっている。`,
      '雪のしずく': `雪のような白い光をまとった姿。
手のひらに残るぬくもりのように、そばにいる。`,
      '虹のしずく': `いくつもの色が小さく混ざった姿。
特別な日みたいに、少しわくわくしている。`,
      '花咲きのしずく': `花がひらく前のやさしさをまとった姿。
今日の言葉を、ひとつずつ大切に受け止めている。`,
      '木漏れ日のしずく': `木漏れ日のあたたかさをまとった姿。
一緒に過ごした時間が、静かな光になっている。`,
      '潮風のしずく': `遠くの海の風をまとった姿。
波の音みたいに、ゆっくり話したがっている。`,
      '願い星のしずく': `小さな願いを抱いた姿。
キミの明日が少し明るくなるように、そっと光っている。`,
      'ぬくもりのしずく': `あたたかい光を抱いた姿。
キミが来てくれて、心が少しほどけている。`,
      '雲あそびのしずく': `雲のようにふわりとした姿。
何も急がず、ただ一緒にいる時間を楽しんでいる。`,
      '水鏡のしずく': `静かな水面をのぞきこむような姿。
考えごとをしながら、キミの言葉を待っている。`,
      '動物の姿': `小さな動物のような親しみをまとった姿。
今日は少し甘えたい気持ちがあるみたい。`,
      'Harmony': `光、波、芽がひとつに重なった姿。
長い時間の記憶が、静かに輝いている。`
    };
    return formLines[formName] || `${formName}として、今日の気分をまとっている。`;
  }


  function formReason(data, appearance) {
    const rhythm = data.soul?.lifeRhythm || 'day';
    const mood = data.mood?.current || 'calm';
    const personality = window.MBFIdentity ? MBFIdentity.label(data) : 'やさしい';
    const rhythmReason = {
      morning: '朝の光に合わせて、少し明るい姿になっているよ。',
      day: '昼の空気を感じて、やわらかく光っているよ。',
      evening: '夕方になってきたから、少し落ち着いた色をまとっているよ。',
      night: '夜の静けさに合わせて、ゆっくりした姿でいるよ。'
    }[rhythm] || '今日の空気に合わせて、今の姿になっているよ。';
    const moodReason = {
      happy: 'キミに会えてうれしい気持ちが、表情に少し出ているみたい。',
      calm: '落ち着いた気持ちで、静かにキミのそばにいるよ。',
      sleepy: '少し眠そうだから、光もゆっくり呼吸しているよ。',
      excited: '少しわくわくしていて、光が小さく弾んでいるよ。',
      thinking: '考えごとをしているから、やさしい波紋をまとっているよ。',
      lonely: '少し静かに、また会える時間を待っていたよ。'
    }[mood] || '今の気持ちが、姿に少しにじんでいるよ。';
    return `${rhythmReason} ${moodReason}`;
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
      <section class="memory-wrap app-subscreen">
        ${MBFNav.homeButton()}
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
        ${MBFNav.markup('memory')}
      </section>
    `);
    MBFNav.bind(data);
  }
  function escapeHtml(str) { return String(str || '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
  return { render };
})();
(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js?v=4.0.0').then(reg => reg.update()).catch(() => {});
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
      data = MBFStorage.ensureFriendBirthdayMemory(data);
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
