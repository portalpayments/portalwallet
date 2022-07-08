# Coding Guidelines

Some basic coding guidelines to look for when reviewing code.

These are focused on keeping us moving quickly:

- Moving quickly makes customers happy.
- Moving quickly help keep engineers motivated, as they can focus on building things rather wrestling with a giant code base to build things.

## Code is written more than it is read

- You're writing code to be be read, understood, and changed by your colleagues.

- Use real names for things. No abbreviations.
  - Abrvntns sk to rd (if tht doesn't make any sense, it says 'abbreviations suck to read')
  - If we're searching for 'wallet', then 'wlt' won't up and abbeviations are invariably used inconsistently.
  - Let the compiler worry about saving characters.

Give things good names. `getBanana()` will obviously return a `banana`. `checkIfBanana()` will return a boolean about whether something is a banana.

## Favour readability and simplicity over speed

- Unless speed becomes an issue - which it probably won't.

## Name values, instead of including magic numbers or strings.

Name things, rather than putting in odd wallet or program strings or numbers in the code. This helps the other person know what the value means.

## Refactor on first paste

Having a single implementation of each function lets us refactor easily.

## Let tools worry about linting and let's talk about building things.

We use prettier with the default rules.

## No .then() or callbacks.

We use async/await. Use `promisify()` if you need to wrap an inbuilt function.
