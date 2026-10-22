# Project Guidelines

## Readable conditions

- Extract compound conditions containing multiple checks with `&&` or `||` into
  descriptively named `const` boolean variables before using them in `if`
  statements.
- Apply the same pattern to compound conditions in ternaries and JSX rendering.
- Prefer names that explain intent, such as `isInvalidResponse`,
  `hasErrorMessage`, or `canShowGoogleButton`. Keep simple single checks inline.
- Preserve short-circuit evaluation, TypeScript type safety, and existing behavior
  when extracting conditions.

# Before generating code(!IMPORTANT)

-Plan the change in small steps.
-Only perform one step at a time.
-Ask before proceeding with the next step.
-Never assume, ask for clarification.
-Don't add anything unecessary.

# Testing

-Never add tests without asking first.

# Frontend

-Frontend uses Atomic Design as its Design Methodology.
-Break out longer pieces of code into their own components.
