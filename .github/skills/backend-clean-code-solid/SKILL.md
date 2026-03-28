---
name: backend-clean-code-solid
description: 'Review and refactor Node.js, Express, and Mongoose backend code for Clean Code and SOLID compliance. Use when analyzing or fixing backend routes, managers, models, validation, error handling, architecture issues, code smells, refactors, clean code, SOLID, temiz kod, backend analiz, backend duzeltme.'
argument-hint: 'Describe the backend file, module, route, manager, or diff to review and improve'
user-invocable: true
---

# Backend Clean Code and SOLID

Use this skill when the task is to review, analyze, or improve backend code quality in this repository with a Clean Code and SOLID lens. Its default mode is analysis and actionable recommendations; it should only edit code when the user explicitly asks for implementation.

## What This Skill Does

- Reviews backend changes for naming, responsibility boundaries, cohesion, coupling, validation, and error handling issues.
- Proposes the smallest safe change set that fixes the root cause instead of suggesting cosmetic edits.
- Preserves the current backend architecture where it is intentional, while reducing code smells and unnecessary coupling.
- Verifies implemented changes with relevant linting and tests when the environment allows it.

## When to Use

- Backend routes become too large or start containing business logic.
- Managers mix validation, persistence, formatting, and side effects.
- Model, route, or manager code has magic strings, duplicate logic, weak names, or unclear contracts.
- A backend bug fix should also improve structure without creating a large rewrite.
- A review request asks for Clean Code, SOLID, maintainability, or architecture feedback.

## Repository Context

This repository uses a Node.js backend under `backend/` with Express, Mongoose, Passport, Jest, and Supertest.

Preserve these repo-specific rules unless the user explicitly asks to change them:

- Keep routes thin. Prefer route handlers that delegate business logic to managers.
- Preserve the manager-as-facade pattern already used across the backend.
- Keep authentication compatible with Passport Local Mongoose using `usernameField: 'email'`.
- Preserve legacy lesson compatibility: older lesson documents may use `grade` instead of `classGroups`, `lessonType` instead of `type`, and missing `type` should still behave like `main`.
- Prefer existing async and error propagation patterns over broad rewrites.

Load the detailed review heuristics when needed: [backend review checklist](./references/review-checklist.md)

## Procedure

1. Define the scope.
   Determine whether the user wants a review only, a direct fix, or both. Default to review-only analysis and recommendations unless the user explicitly asks for code changes. Identify the exact backend files, module, route, manager, or diff that should be analyzed.

2. Read current behavior before proposing structure changes.
   Inspect the related route, manager, model, and tests together. Understand data flow, validation rules, persistence, side effects, and error behavior before editing.

3. Evaluate with Clean Code and SOLID criteria.
   Check whether names communicate intent, whether each function and module has a single reason to change, whether dependencies are unnecessarily concrete, and whether control flow can be simplified.

4. Decide the lowest-risk correction.
   Prefer extracting helpers, introducing small abstractions, isolating validation, replacing magic values with named constants, and tightening function boundaries. Avoid large rewrites unless the user asks for architectural work.

5. Apply repository-specific constraints.
   If the change touches auth, preserve the current Passport Local Mongoose contract. If it touches lessons or materials, keep backward compatibility for older lesson documents. If routes already delegate to managers, do not move business logic back into routes.

6. Add or update verification.
   When behavior changes, add or update focused tests. If a focused test already exists, extend it rather than creating redundant coverage.

7. Validate the result.
   From `backend/`, run the most relevant checks available, typically `npm run eslint:check` and `npm test` or a targeted Jest run if that is clearly faster and sufficient.

8. Report clearly.
   Explain what was wrong, what was changed, why the refactor is safer or cleaner, and what verification was completed or skipped.

## Decision Rules

- If the user asks for a review, prioritize findings first and do not edit unless they also ask for fixes.
- If the user asks to fix backend code explicitly, make the smallest justified change set.
- If the user asks generally for Clean Code or SOLID help without saying to edit, produce findings, a refactor plan, and recommended patch direction without changing files.
- If requirements are ambiguous, resolve what the code currently does first, then ask only the narrowest question needed.
- If a requested refactor would risk behavior changes without tests or clear contracts, stop and surface the risk before making a broad rewrite.
- Prefer composition, extracted helpers, and clearer module boundaries over inheritance-heavy solutions.
- Prefer root-cause fixes over formatting-only changes.

## Clean Code and SOLID Focus Areas

- Single Responsibility Principle: routes, managers, and helpers should each have one clear reason to change.
- Open Closed Principle: extend behavior through isolated helpers, configuration, or small abstractions instead of scattered conditionals.
- Liskov Substitution Principle: keep contracts stable when replacing or extracting components.
- Interface Segregation Principle: avoid passing oversized objects or requiring callers to depend on fields they do not need.
- Dependency Inversion Principle: reduce direct coupling to concrete dependencies when doing so materially improves testability or maintainability.
- Clean Code: use intention-revealing names, small focused functions, guard clauses, consistent error semantics, minimal duplication, and explicit domain constants.

## Completion Checks

Before considering the task finished, confirm these points:

- The main behavior still matches the existing contract.
- The change reduces responsibility mixing, duplication, or unclear naming.
- Validation happens in a clear place before unsafe persistence or side effects.
- Error handling remains consistent and understandable.
- Repo-specific compatibility constraints remain intact.
- Relevant linting or tests were run, or the reason they were not run is explicitly stated.

## Response Shape

For review-only requests:

- Present findings first, ordered by severity.
- Include concrete file references and the architectural reason each issue matters.
- Include a practical refactor plan with the minimum change set needed to address the highest-value issues.
- Mention testing gaps and residual risks after the findings.

For fix requests:

- Summarize the structural issue that was corrected.
- Summarize the change set in terms of responsibilities and behavior preservation.
- State what verification was run and any remaining risks.
