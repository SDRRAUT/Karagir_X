# Contributing to कलाकार सेतु (Kalakar Setu)

Thank you for your interest in contributing to Kalakar Setu! We are committed to building high-quality, culturally resonant technology that empowers rural Indian artisans.

---

## Code of Conduct

- **Artisan-Centric:** All interfaces and features must respect low-literacy users, prioritize vernacular voice/audio, and never introduce hidden fees or deceptive UX patterns.
- **Inclusive & Respectful:** We foster a respectful, welcoming community regardless of background, gender, or technical experience.

---

## Development Workflow

1. **Fork & Branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Code Standards:**
   - Write clean, type-safe TypeScript (strict mode enabled).
   - Use the Cultural Design System tokens defined in `src/theme/`.
   - Never use ad-hoc hardcoded hex colors or arbitrary font sizes.
   - Enforce $\ge 56\text{dp}$ touch target sizes for all interactive elements.

3. **Testing:**
   - Every new component, store, or service MUST include comprehensive unit tests in `mobile/__tests__/`.
   - Ensure all 48 test suites pass:
     ```bash
     cd mobile
     npm test
     ```

4. **Linting & Typechecking:**
   - Run typecheck and lint before submitting a PR:
     ```bash
     npm run typecheck
     npm run lint
     ```

5. **Commit Messages:**
   - Follow conventional commit style:
     - `feat: add voice search in marketplace`
     - `fix: correct status offline color token`
     - `docs: update B2B market linkage walkthrough`

---

## Submitting Pull Requests

1. Ensure all tests pass.
2. Provide a clear PR description detailing what was changed and screenshots if applicable.
3. Link related issues or requirements specifications.
