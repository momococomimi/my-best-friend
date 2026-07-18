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


## v4.0.1 Navigation and Message
- Secondary screens expose one minimal back arrow whose destination is always Home.
- Message uses a fixed shell: header and composer remain visible while only chat history scrolls.

## v4.4.0
- Product title remains metadata/PWA identity and is not rendered as a permanent screen heading.
- Message is a friend-presence screen: a single FriendState portrait remains visible while conversation history scrolls independently.
- Memory begins with the project dedication before chapter content.


## v4.4.0
Home atmosphere is decorative and pointer-events-free. Message keeps a fixed composer while only the conversation log scrolls. Reduced-motion preferences disable ambient animation.


## v4.4.0 A Living World
HomeのFriendとSproutは独立した座標・影・アニメーションを持つ。MessageのheaderはFriendのpresenceのみを表示し、名前ラベルに依存しない。

## v4.4.0
- Home environment is decorative-only and isolated inside `.home-atmosphere`.
- Message keeps a compact presence header while the scrollable chat log receives most available height.
- Motion respects `prefers-reduced-motion`.

## v5.1.0 Living Friend
- Home comment is a voice surface, not a message bubble with an avatar.
- Home uses a stable three-row layout: world / voice card / persistent navigation.
- Friend floating motion and sprout sway remain independent visual systems.


## v5.2.0 Voice Context
中央マイクは画面遷移を起こさず、現在画面の文脈で動作する。会話履歴は単一のconversationsへ保存し、Guardianのみ入力を無効化する。


## v5.2.1 — Voice transcript ownership
- Speech recognition interim and final transcripts appear on the user side first.
- The temporary user-side draft is replaced by the finalized transcript.
- Only the Friend's generated response appears on the Friend side.


## v5.5.0 stability note
This release intentionally keeps the v5.2.1 DOM structure unchanged. Living motion is added only through the existing MBFLiving controller and isolated CSS overrides, preventing cross-screen layout regressions.


## v5.5.0 center-lock note

Homeの位置決めは `.home-appearance` の `left: 50%` と、全キーフレーム内の `translateX(-50%)` に一本化する。感情クラスが横方向のアンカーを上書きしないこと。


## v5.5.1 voice feedback rule
- Home: response replaces the Home comment.
- Message: voice and text share the same conversation history.
- Profile / Memory: transient compact cream Friend bubble above the dock.
- Guardian: voice remains disabled and no bubble is created.
