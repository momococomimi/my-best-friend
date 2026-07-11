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


## v3.7.3
- Voice is an in-place Home interaction using the Web Speech API when available.
- Profile rows use a reusable accordion component; Form opens the existing Friend's Form screen.


## v4.0.0 Navigation and viewport contract
- Homeは没入感を優先し、左上ボタンを表示しない。
- Profile / Message / Memory / Guardian は左上の共通「メインへ」でHomeへ戻る。
- 固定ボトムドックは各画面で共通表示し、本文にはdock分のsafe spaceを確保する。
- MemoryとProfileは内容量に応じて縦スクロールし、固定高さを持たない。
- Friendは空中を浮遊し、Sproutは地面に根付く独立した世界オブジェクトとして描画する。
