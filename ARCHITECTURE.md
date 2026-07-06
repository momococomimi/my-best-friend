# Architecture — v2.3.3 Flow & Space Fix

## Core entities
- Friend: identity, values, appearance, voice, message, memories
- User Profile: name, preferred name, birthday, optional gender
- Guardian: 見守り設定; future transferable stewardship
- Memory: private shared history
- Conversation: local lightweight records of message exchange

## Voice
v2.3.3 introduces the Voice screen as a foundation. Real speech recognition and synthesis will be added later after safety and privacy design.

## Message
v2.3.3 introduces the first Message screen. Messages are stored locally in browser localStorage only and are not sent externally.

## Appearance sync
Opening, Home, Appearance, Voice, and Message use the same Friend appearance component so the Friend feels like the same presence across screens.

## Future compatibility
The Friend’s body is still separate from identity. The same Friend can later inhabit light, fluid, animal, robot, or physical forms without losing memories.


## v2.3.3 Flow & Space Fix
- Home buttons are equal-sized compact cells.
- Friend comments fade in place instead of sliding.
- Friend touch changes facial expression temporarily.
- Home layout is biased toward a single iPhone viewport without scrolling.


## v2.4.0 Care & Mood

- Mood is stored as part of Friend state.
- Appearance changes automatically based on Mood.
- Care actions can gently change Mood without using points, levels, or rewards.
- The Friend remains the same identity even when color, light, or animation changes.


## v2.4.2
Guardian Room supports user name editing instead of a separate preferred calling name. Setup screens and Home share a centered Friend layout. Guardian Room is scrollable on iPhone Safari.
