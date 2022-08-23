# Coding Guidelines

Some basic coding guidelines to look for when reviewing code.

These are focused on keeping us moving quickly:

- Moving quickly makes customers happy.
- Moving quickly help keep engineers motivated, as they can focus on building things rather wrestling with a giant code base to build things.

## Code is written more than it is read

- You're writing code to be be read, understood, and changed by your colleagues.

- Use real names for things. No abbreviations.
  - Abrvntns sk to rd (if that doesn't make any sense, it says 'abbreviations suck to read')
  - If we're searching for 'wallet', then 'wlt' won't up and abbeviations are invariably used inconsistently. It's entirely possible we'll have 'wallet', 'w', 'wlt' and 'wllt' at the same time. Maybe referring to slightly different things.
  - Let the compiler worry about saving characters. Humans are the expensive part - readable names saves them time.

Give things good names. `getBanana()` will obviously return a `banana`. `checkIsBanana()` will return a boolean about whether something is a banana. `isBanana` is a boolean. `bananaById` is an Object of bananas sorted by ID.

## Use links for issues when working around an issue

That way the next person know if/when it's fixed:

```
# TODO: add code to close sockets
# See https://github.com/PLhery/node-twitter-api-v2/issues/326
```

## Favour readability and simplicity over speed

- Unless speed becomes an issue - which it probably won't.

## Use pure functions

It's much easier to read, test and refactor code that always has the same output for the same input. Use scope and closures for state rather than creating custom classes. In React, use hooks.

## Name values, instead of including magic numbers or strings.

Name things, rather than putting in [magic numbers](<https://en.wikipedia.org/wiki/Magic_number_(programming)#Unnamed_numerical_constants>) or magic strings (like unnamed wallet pubkeys) in the code. This helps the other person know what the value means.

## Remove code, rather than comment it out

It's just noise, nobody else will understand why it's commented out, and we can always get it back from git if we need to.

## Refactor on first paste

Having a single implementation of each function lets us refactor and fix bugs easily.

## Let tools worry about linting and let's talk about building things.

We use prettier with the default rules.

# JS specific guidelines

## Use `null` to indicate absense of a value

There's a difference between `score` of `0` (the score is zero) and `score` of `null` (we don't know the score). `null` is a way to state explicitly that a value is missing.

Using `null` is better than `undefined` as any unset variable, or missing key has the variable `undefined` - let's keep `undefined` for bugs!

## No `.then()` or callbacks.

We use `async`/`await`. This means we can catch errors using `try {} catch() {}`

Use `promisify()` if you need to wrap a callback function. Since using `promisify()` is boilerplate code, hide it away in `functions.js`:

```typescript
import { scrypt as scryptCallback } from "crypto";
export const scrypt = promisify(scryptCallback);
```

This way we can jump `import { script } from './functions'` and have a working `scrypt` we can use with `async/await`

## Use the SECONDS / MINUTES etc constants for times

`30 * SECONDS` for example, is more readable than `30000` or `30_000` would be.

```typescript
test(
  `thing that will take 30 seconds`,
  () => {
    // code
    // goes
    // here
  },
  30 * SECONDS
);
```

## Just `throw new Error()`

JS lets you throw objects, strings and other things that aren't errors. Just throw Errors.

Our code assumes thrown objects will be errors, ie:

```typescript
try {
  ...
  if ( badness ) {
    throw new Error(`oh no!`)
  }
} catch (thrownObject) {
  const error = thrownObject as Error
  ...
}
```

# CSS Guidelines

**Just use CSS grid**. There's no point bothering with margin hacks, overflow, clear: both etc. Just use grid.
