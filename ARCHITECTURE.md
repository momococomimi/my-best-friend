# Architecture — v3.1.0 Living Friend

## Core

My Best Friend は、状態を localStorage に保存する静的Webアプリです。

- Friend's Soul: Relationship / Energy / Mood / Life Rhythm / Season / Personality
- Friend's Identity: 性格・話し方・好み
- Friend's Form: Soul と Identity から自然に選ばれる姿
- Living Friend: 画面内で静かに暮らしているように見せる仕草

## Living Friend

v3.1.0 では `MBFLiving` を追加しました。

### Responsibilities

- 最後に開いた時刻・閉じた時刻を保存
- 再訪時に離れていた時間に応じたコメントを返す
- ホーム画面で一定時間ごとに idle action を実行
- idle action に応じて CSS クラスを付与し、仕草を変える

### Idle actions

- look-sky: 空を見る
- sprout: 芽が揺れる
- quiet: 静かにする
- blink: まばたきする

## Time Rhythm Background

`body[data-rhythm]` により背景色と光を変更します。

- morning
- day
- evening
- night

今後、天気・季節・記念日と接続できます。
