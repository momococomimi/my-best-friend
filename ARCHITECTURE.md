# Architecture — v3.4.0 Friend Engine

## Friend Engine

My Best Friend keeps one shared FriendState.

- name
- form
- mood
- energy
- relationship
- personality
- identity
- memory
- profile notes

Every screen renders the same `data.friend.appearance` state.

## Screen Rule

Home, Friend’s Form, Message, Voice, Memory, Profile, and Guardian must never calculate a separate Friend form. They only display the current FriendState.

## Sprout Rule

The sprout is not part of the Friend body. It belongs to the Home world as the place where shared memories grow.


## v3.4.1 Sprout Ground
Home sprout is rendered as a world-side CSS plant. It is larger, separated from the Friend body, and animated independently.
