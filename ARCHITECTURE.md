# Architecture — v3.3.0 Profile Notes

## Profile Notes
Profile now stores mutable notes:

- `profile.likes: string[]`
- `profile.dislikes: string[]`

These are intentionally editable because they represent the user's current self, not immutable identity.

## Future AI memory rule
When AI conversation is connected later, the friend may suggest remembering a like/dislike only after explicit user or Guardian confirmation.

## Friend's Form
The Form page shows:

1. Friend's name
2. Current form name as `○○の姿`
3. Current form description
4. Friend's Identity
5. Friend's Soul

Past/future form lists are removed to avoid collection-game behavior.
