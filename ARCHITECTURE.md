# Architecture v2.8.0

## Friend Identity

Friend Identity is the stable personality layer between Friend's Soul and Friend's Form.

```text
Friend's Soul
  ↓
Friend's Identity
  ↓
Friend's Form
```

## Internal fields

- personality
- voiceStyle
- favoriteWeather
- favoriteTime
- favoriteMotif
- core traits
- design motifs: 光 / 波 / 芽

## Behavior

- Personality changes comment tone.
- Warm conversation can restore a very small amount of Energy.
- Task requests use a small amount of Energy.
- Relationship never decreases.
- Friend's Form is chosen by mood, rhythm, season, and relationship.


## v2.8.1 Silent Identity

- Friend's Identity のタグ表示を削除し、文章だけで個性を伝えるように調整。
- 光・波・芽のモチーフタグは内部設計として保持し、画面には常時表示しない。
- Friend's Form の説明文をフォームごとに自然に変化する文章へ調整。
- Safariのフルページスクリーンショットで黒い楕円が出ないよう、強いぼかしエフェクトを削除。
- Relationshipのレベル表示は行わず、ゲーム感を避ける。


## v2.9.0 Living Friend

- 時間帯で背景の空気が変化
- Friend's Formに「どうして今この姿なの？」を追加
- Safariフルページスクショで崩れにくい安全なオーラへ調整
- Guardianの戻るボタンを他画面と同じボタンUIに統一
- 将来の天気・PWA・小窓表示に備えたLiving Friend設計を継続
