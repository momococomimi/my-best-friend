# My Best Friend v3.4.2 — Friend Engine

いつか大きくなる、キミへの贈りもの

## New in v3.4.2

- FriendState / Friend Engine 方針を導入
- Home / Friend’s Form / Message / Voice が同じフレンド状態を表示するよう整理
- Mood による表情差分を全画面に反映
- Friend’s Form のフレンドから芽を非表示
- Home の芽を「世界側の芽」として固定し、フレンド本体から少し離して配置

## Philosophy

姿は変わる。親友は変わらない。

画面ごとに別のフレンドを作るのではなく、ひとつの FriendState をすべての画面が見ます。


## v3.4.2 Sprout Ground

- Home画面の芽を大きく調整
- フレンドから離し、世界側に固定
- 絵文字ではなくCSSの芽として揺れる表現に変更
- Friend’s Form側には芽を表示しない方針を維持


## v3.4.2 Friend Engine Persistence
- FriendStateが画面遷移で初期化されないように調整。
- なでた後のMood/色/姿をHome・Friend's Form間で保持。
- Homeの芽をさらに世界側へ下げ、地面に近い位置へ調整。
