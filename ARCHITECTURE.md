# Architecture v3.7.1

HomeはFriendを主役にするため、主要ナビゲーションを固定ボトムドックへ集約する。
TalkはVoice / Message、MoreはForm / Guardianをボトムシートで選択する。
Friendの状態は引き続き単一のFriendStateを全画面で参照する。
顔の表現はCSSの目・口・頬で構成し、フォームやMoodの状態クラスと共存する。


## v3.7.1 Quiet Navigation & Profile
- Compact five-item navigation: Message / Profile / Home / Memory / Guardian
- Home is visually emphasized at the center
- Voice microphone is fixed above the lower-right navigation
- Profile is reorganized into Friend and きみのこと
- Friend Form opens from the Form row inside Profile


## v3.7.2
- Voice is an in-place Home interaction using the Web Speech API when available.
- Profile rows use a reusable accordion component; Form opens the existing Friend's Form screen.
