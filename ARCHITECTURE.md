# Architecture v3.7.0

HomeはFriendを主役にするため、主要ナビゲーションを固定ボトムドックへ集約する。
TalkはVoice / Message、MoreはForm / Guardianをボトムシートで選択する。
Friendの状態は引き続き単一のFriendStateを全画面で参照する。
顔の表現はCSSの目・口・頬で構成し、フォームやMoodの状態クラスと共存する。
