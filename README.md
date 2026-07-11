# My Best Friend v3.8.0

## Friend Design Sprint 2

- Homeの6つの大型ボタンを、静かな下部ナビゲーションへ整理
- TalkからVoice / Messageを選ぶボトムシートを追加
- MoreからForm / Guardianへ移動できる構成を追加
- 目に深いネイビーの質感と小さな光を追加
- 口に柔らかな立体感と淡い内側の色を追加
- 顔・頬の質感を調整
- v3.6.1までのFriendState、呼吸、まばたき、芽、背景動作を維持

GitHub Pages確認URL: `https://momococomimi.github.io/my-best-friend/?v=370`


## v3.7.1 Quiet Navigation & Profile
- Compact five-item navigation: Message / Profile / Home / Memory / Guardian
- Home is visually emphasized at the center
- Voice microphone is fixed above the lower-right navigation
- Profile is reorganized into Friend and きみのこと
- Friend Form opens from the Form row inside Profile


## v3.8.0 In-place Voice & Accordion Profile
- Voice専用画面を廃止し、Home右下のマイクから直接音声認識
- マイクを標準的なSVGアイコンへ変更
- ProfileをFriend / きみのことのアコーディオンUIへ変更
- Profile内の文字サイズを統一


## v3.8.0
- Voice button is orange while idle and green only while listening.
- Home comment card is fixed above the microphone and navigation so it remains visible.
- Removed the extra “フレンドの姿を見る” button from Form details.
- Profile scrolling was rebuilt so “少し苦手なこと” can always be reached.


## v4.0.0 Living Friend — Layout Foundation
- Homeでフレンドが見切れないよう、表示領域とサイズを再設計
- フレンドと芽の距離を調整し、浮遊するフレンド／地面から育つ芽を明確化
- Home以外の画面左上に小さな「メインへ」を追加
- Memoryを最後まで読める縦スクロール構成へ修正
- Profileのアコーディオン展開時も最後まで閲覧可能
- 固定ナビゲーションと本文の重なりを解消

GitHub Pages確認URL: `https://momococomimi.github.io/my-best-friend/?v=400`


## v4.0.1 Scrollable Message
- Message history scrolls independently while the input composer remains visible.
- Every non-Home screen uses a minimal left-arrow button to return to Home.

## v4.1.0 Friend Conversation Room
- 画面上の恒常的なアプリタイトル表示を廃止
- Memory冒頭に「いつか 大きくなる、キミへの贈りもの。」を配置
- Messageをフレンドが常駐する会話空間へ刷新
- 会話履歴はスクロール、入力欄は固定
- 考え中・返答時の小さなフレンド反応を追加
- ProfileのForm表記から「〜の姿」を削除
