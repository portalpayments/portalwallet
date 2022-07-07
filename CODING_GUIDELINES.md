# Coding Guidelines

Some basic coding guidelines to look for when reviewing code.

These are focused on keeping us moving quickly:

- Releasing quickly keeps customers (and investors) happy.
- Moving quickly helps keep engineers motivated, as engineers can focus on building things rather wrestling with a giant code base.

## Code is written more than it is read

- You're writing code to be be read, understood, and changed by your colleagues.

- Use real names for things. No abbreviations.
  - Abrvntns sk to rd (if tht doesn't make any sense, it says 'abbreviations suck to read')
  - If we're searching for 'wallet', then 'wlt' won't up and abbeviations are invariably used inconsistently.
  - Let the compiler worry about saving characters.

 - A PR should be focused on how well the reviewer can understand the code, without any further input from the author except the code. This means others won't have to rely on the author to work on that code, and the author can move onto whatever the next thing is.

## Favour readability and simplicity over speed

- Which it probably won't.

## Name values, instead of including magic numbers or strings.

Name things, rather than putting in odd wallet or program strings or numbers in the code. This helps the other person know what the value means.

## Refactor on first paste

Having a single implementation of each function lets us refactor easily.

## Let tools worry about linting and let's talk about building things.

We use prettier with the default rules.

## No .then() or callbacks.

We use async/await. Use `promisify()` if you need to wrap an inbuilt function, s
