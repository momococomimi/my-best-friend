# Architecture — v3.6.0

## FriendState

フレンドは世界に一人だけです。Home、Form、Message、Voice、Memoryは同じ保存状態を参照します。

## Living Friend

`MBFLiving` が呼吸、まばたき、視線、静かな再会を担当します。表示画面を離れる時はタイマーを停止し、画面ごとの別人格を作りません。

## Accessibility

`prefers-reduced-motion` を尊重し、動きを減らす設定では連続アニメーションを停止します。
