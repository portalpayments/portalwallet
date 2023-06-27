# Coding Guidelines

Some basic coding guidelines to look for when reviewing code.

These are focused on keeping us moving quickly:

- Moving quickly makes customers happy.
- Moving quickly helps keep engineers motivated, as they can focus on building things rather wrestling with a giant code base to build things.

## Ask for help

If it feels like a grind:

- Ask for help! It's better to have two people working on something than for one person to feel like they're not making any progress.
- [Talk to the duck](https://www.mindovermachines.com/when-you-get-stuck-talk-to-the-duck/)
- Try and make a minimal version for Stack Overflow or Solana Stack Exchange
- Go for a walk and think about it

## Code is written more than it is read

- You're writing code to be be read, understood, and changed by your colleagues.

- Use real names for constants and variables. No abbreviations.
  - Abrvntns sk to rd (if that doesn't make any sense, it says 'abbreviations suck to read')
  - If we're searching for 'wallet', then 'wlt' won't show up. Abbeviations are invariably used inconsistently. It's entirely possible we'll have 'wallet', 'w', 'wlt' and 'wllt' at the same time - maybe referring to slightly different things! Avoid confusion but consistently naming things so we have one implementation of everything.
  - Let the compiler worry about saving characters. Humans are the expensive part - readable names saves them time.

Give things good names. 

 - **Functions do things** `getBanana()` will obviously return a `banana`. `checkIsBanana()` will return a boolean about whether something is a banana. 
 - **Booleans use `is`**. `isBanana` is a boolean. 
 - **Key value maps (objects in JS/TS) are named after their value, sorted by key.** -`bananaById` is an Object of bananas sorted by ID.
 - **Arrays are plurals.** `bananas` is clearly an array of `banana`

## Use links for issues when working around an issue

That way the next person know if/when it's fixed:

```
// TODO: add code to close sockets
// See https://github.com/PLhery/node-twitter-api-v2/issues/326
```

## It's OK to hack things to move quickly, just add a TODO

It's ideal to hack things, just let people know why:

```
// TODO: we should check if the user has a banana here
```

## Favour readability and simplicity over speed

- Unless speed becomes an issue - which it probably won't.

## Use pure functions

It's much easier to read, test and refactor code that always has the same output for the same input. Use scope and closures for state rather than creating custom classes.

## Name values, instead of including magic numbers or strings.

Name things, rather than putting in [magic numbers](<https://en.wikipedia.org/wiki/Magic_number_(programming)#Unnamed_numerical_constants>) or magic strings (like unnamed wallet pubkeys) in the code. This helps the other person know what the value means.

## Remove code, rather than comment it out

It's just noise, nobody else will understand why it's commented out, and we can always get it back from git if we need to.

## Don't cut and paste

Having a single implementation of each function, style, or UI lets us refactor and fix bugs easily.

## Let tools worry about linting and let's talk about building things.

We use prettier with the default rules.

# JS/TS specific guidelines

## Use `null` to indicate absense of a value

There's a difference between `score` of `0` (the score is zero) and `score` of `null` (we don't know the score). `null` is a way to state explicitly that a value is missing.

Using `null` is better than `undefined` as any unset variable, and any missing key, has the value `undefined` - let's keep `undefined` for bugs! Oddly a lot of TypeScript code uses `undefined` explicitly - that doesn't mean it's a good idea.

## Only throw Errors, and assume rest of the code only throws errors

JavaScript allows you to throw strings, array or any other type of item. We only throw Errors, and we assume all other code only throws errors - if it doesn't we'll stop using it.

```
throw new Error(`Some reasons`)
```

And

```
try {
  ...
} catch (thrownObject) {
  const error = thrownObject as Error
}
```
## Use `async`/`await`, not `.then()` or callbacks.

We use `async`/`await`. This means we can catch errors using `try {} catch() {}`

Use `promisify()` if you need to wrap a callback function. Since using `promisify()` is boilerplate code, hide it away in `functions.js`:

```typescript
import { scrypt as scryptCallback } from "crypto";
export const scrypt = promisify(scryptCallback);
```

This way we can jump `import { scrypt } from './functions'` and have a working `scrypt` we can use with `async/await`

There's a `sleep()` function you can use instead of timeouts. Just `await sleep(5 * SECONDS)` or similar.

BTW, not every function provided as an argument to another function is a `callback`, since a `callback` is used to control the flow of the program. Again others disagree, but they're not using the term callback correctly. For example, `array.map(mapFunction)` or `array.sort(sortFunction)` don't take callbacks, they take a map function and sort a function. The flow of the program isn't being affected. 

## Use `ts-expect-error` rarely, don't use `ts-ignore` at all

Use technical debt sparingly. If you need to finish somehting and don't have time to fix a compiler issue, include the reason for the issue and then use `@ts-expect-error` to note there should be an error on the next line. This is better than `ts-ignore` because it will throw a warning if the error goes away.

```
// Note types may be missing, see https://github.com/briangonzalez/rgbaster.js/issues/66
// @ts-expect-error
```

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

## Use `secretKey` do not use `privateKey`

Solana uses `secretKey` and the terms is more indicative of it's importance than `privateKey`.

# CSS Guidelines

**Just use CSS grid**. There's no point bothering with margins, overflow, clear: both etc. Just use grid.

**There's no need to use margins.** `div`s are configured to display as grid by default in our CSS. If you want more space between items, increase the `gap` value.
