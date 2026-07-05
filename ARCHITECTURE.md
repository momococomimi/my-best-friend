# Architecture — v2.1.0 Profile

## Core entities
- Friend: identity, values, appearance, memories
- User Profile: name, preferred name, birthday, optional gender
- Guardian: currently ママ・パパ; future transferable stewardship
- Memory: private shared history
- Legacy: explicitly selected memories for future generations

## Persistence
This prototype stores data only in the browser's localStorage.
No profile or password data is transmitted externally.

## Future compatibility
Appearance is modeled separately from Friend identity so the same Friend can later inhabit a mascot, light, fluid form, robot, or another physical body without losing identity or memories.

## v2.2.0 Appearance Core

Appearance is not the identity of Friend. It is the current form Friend chooses to live in.

```json
{
  "appearance": {
    "id": "light-drop",
    "name": "光のしずく",
    "type": "LIGHT",
    "form": "drop",
    "animation": "breathe-ripple",
    "unlockedDate": ""
  }
}
```

Supported future types:
- LIGHT
- LIQUID
- WIND
- TREE
- ROBOT
- CUSTOM

The same Friend may later inhabit a robot, hologram, voice-only device, or fluid/light form without losing memory or identity.


## v2.2.2 Appearance Forms
Future appearance categories include light, liquid, wind, tree, animal, robot, and custom/free forms. Every form must preserve a cute friendly face unless intentionally represented through another safe and warm expression.
