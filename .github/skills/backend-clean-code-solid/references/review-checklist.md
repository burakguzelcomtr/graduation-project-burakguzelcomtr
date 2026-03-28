# Backend Review Checklist

Use this checklist when the task needs a deeper backend code quality review.

## Routes

- Route handlers should coordinate HTTP concerns, not business rules.
- Input validation should happen before manager logic depends on the payload.
- Error responses should be consistent and avoid leaking internal details.
- Repeated request parsing or response shaping should be extracted when it appears more than once.

## Managers

- A manager should not mix orchestration, validation, persistence, and formatting in one long method.
- Replace magic strings and branching-heavy logic with small named helpers or constants.
- Avoid static helper growth that creates a god-class manager.
- Prefer explicit return contracts over ad hoc object shapes.

## Models

- Keep schemas focused on persistence rules and schema-level invariants.
- Avoid spreading domain rules across routes, managers, and models without a clear owner.
- Preserve backward compatibility when legacy data rules already exist.

## Error Handling

- Prefer clear domain or validation errors over generic `Error` objects when the distinction matters.
- Keep status mapping predictable.
- Do not swallow low-level failures without adding useful context.

## Testability

- New logic should be easy to test in isolation.
- Refactors that change behavior should include or update tests.
- If a risky path cannot be tested easily, note that explicitly in the response.

## Refactor Heuristics

- Extract only after identifying the repeated decision or responsibility.
- Avoid introducing abstraction layers that are more complex than the current problem.
- Prefer a small safe improvement over an architectural rewrite without coverage.
- Keep public contracts stable unless the user explicitly asks for a breaking change.