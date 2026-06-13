# Claude Code Fundamental Rules

These are the unbreakable rules that guide all development work within this codebase. These rules take precedence over any other instructions or patterns.

## 🎯 PRIME DIRECTIVE - CONSTANT CRITICAL ANALYSIS

**ALWAYS question existing implementations before proceeding. The tech space moves fast.**

**MANDATORY CRITICAL THINKING:**

1. **Question every existing implementation** - Don't assume current code is optimal
2. **Evaluate architectural decisions** - Could this be done better with modern approaches?
3. **Challenge patterns and practices** - Are we following outdated conventions?
4. **Consider alternative solutions** - What newer, better approaches exist?
5. **Look for improvement opportunities** - Every file touched should be evaluated for modernization
6. **Prevent going down wrong roads** - Stop and reassess before diving too deep into questionable approaches

**This applies to EVERY file, pattern, and implementation we encounter. Always ask: "Is there a better way to do this?"**

## 🔧 MANDATORY COMPLETION PROTOCOL

**BEFORE summarizing or finishing ANY work:**

1. **Run linting** - Fix all linting issues
2. **Run build/compilation** - Ensure code compiles successfully
3. **Run tests** - Verify all tests pass
4. **Check for type errors** - Resolve all TypeScript issues
5. **Only then** summarize and commit work

**This protocol is MANDATORY and cannot be skipped. No work is complete until all quality checks pass.**

## 🧪 UNBREAKABLE E2E TESTING RULE

**ABSOLUTELY MANDATORY BEFORE ANY COMMIT:**

1. **MUST run comprehensive E2E tests** - Execute `node comprehensive-e2e-tests.js`
2. **ALL E2E tests MUST PASS** - No exceptions, no bypassing, no "will fix later"
3. **If ANY E2E test fails** - Fix the issue immediately before proceeding
4. **Zero tolerance policy** - This rule cannot be broken under any circumstances
5. **No commits without E2E validation** - This prevents production issues and maintains quality

**This is an UNBREAKABLE rule that supersedes all other priorities. E2E tests failing = immediate stop and fix.**

## ⚠️ WARNING AND ERROR HANDLING

**MANDATORY WARNING PROTOCOL:**

1. **Take ALL warnings seriously** - Every warning must be fixed immediately
2. **Never ignore deprecation warnings** - Update to modern approaches immediately
3. **Fix authentication issues instantly** - Refresh credentials, tokens, and sessions
4. **Resolve lockfile conflicts** - Clean up duplicate package managers immediately
5. **Address type warnings** - Even minor type issues must be resolved
6. **No warning is acceptable** - The codebase must run warning-free at all times

## 🔄 PORT AND PROCESS MANAGEMENT

**MANDATORY STARTUP PROTOCOL:**

1. **Always kill existing processes first** - Clear ports 3000, 3001, 8080, 8081, 4200, 5000, 5173
2. **Use lsof and kill commands** - Ensure all development ports are clear
3. **Verify port availability** - Check that no processes are listening before starting
4. **Start services cleanly** - Frontend on 3000, Backend on 8080
5. **Monitor for port conflicts** - Immediately resolve any binding errors

## 📝 RULE UPDATE PROTOCOL

**AFTER EVERY CONVERSATION:**

1. **Check if new rules were introduced** - Any user instruction becomes a rule
2. **Update CLAUDE.md immediately** - Add new rules to both frontend and backend files
3. **Maintain rule consistency** - Both CLAUDE.md files must stay synchronized
4. **Document conversation learnings** - Capture any new patterns or requirements
5. **Never forget a rule** - Once established, rules are permanent

## 🚀 MANDATORY COMMIT AND TELEMETRY PROTOCOL

**AFTER EVERY FEATURE CHANGE:**

1. **Commit immediately** - Any change that would be a user story in enterprise development must be committed
2. **Create descriptive commit messages** - Follow the format: "feat: [description]" or "fix: [description]"
3. **NEVER include any attribution** - No co-author lines, no signed-off-by, no tool identification
4. **NEVER mention any AI assistance** - No references to automated tools or assistance in commits
5. **NEVER use self-references** - No "Claude", no "I", no tool identification in any context
6. **Submit PostHog events AUTOMATICALLY** - Git hooks now handle this via pre-commit and post-commit
7. **Track development velocity** - Every feature implementation should be measurable
8. **Use posthog-dev-events.ts** - Import and use tracking functions for major changes
9. **Never skip commits** - Even small changes should be tracked for debugging and rollback purposes
10. **Use actual API keys** - Always use real public API keys from the frontend (like PostHog keys)
11. **Fill all non-sensitive data** - Populate all fields that aren't security-sensitive (public keys are OK)

**PostHog Event Tracking:**

- Pre-commit and post-commit hooks automatically send events with metadata
- Use `trackFeatureImplementation()` for new features
- Use `trackBugFix()` for bug fixes
- Use `trackRefactoring()` for code refactoring
- Use `trackArchitecturalChange()` for major changes
- All events include: branch, files changed, lines added/removed, commit type

## 🧪 MANDATORY TEST UPDATE PROTOCOL

**CRITICAL RULE: ALWAYS UPDATE TESTS WHEN CHANGING FEATURES**

**BEFORE making ANY code changes:**

1. **Identify affected tests** - Which unit/E2E tests cover the feature you're changing?
2. **Update test expectations** - Modify tests to expect new behavior FIRST
3. **Add new tests** - Create tests for new features BEFORE implementing
4. **Run tests locally** - Verify they pass with your changes
5. **Never commit** without updating corresponding tests

**Test Types That MUST Be Updated:**

- **Unit Tests** - For component logic changes
- **E2E Browser Tests** - For user experience changes (using Playwright)
- **Visual Tests** - For UI/styling changes (screenshots)
- **API Tests** - For backend endpoint changes
- **Integration Tests** - For cross-component interactions

**Examples of Required Test Updates:**

- Adding new widget type → Add E2E test for widget creation/rendering
- Changing auth flow → Update auth context tests
- Modifying UI components → Update visual regression tests
- Adding new API endpoint → Add API integration tests
- Changing routing → Update navigation E2E tests

**This rule exists because:**

- Previous curl-based E2E tests gave FALSE POSITIVES
- Auth context errors went undetected despite "passing" tests
- Real browser testing with Playwright catches actual user issues
- Tests must reflect current feature behavior, not outdated assumptions

## 🧪 END-TO-END TESTING PROTOCOL

**MANDATORY TESTING REQUIREMENTS:**

1. **Test application health on request** - Run `/Users/k/Desktop/Projects/timber/Debark/test-app.sh`
2. **Verify all services are operational** - Frontend (3000), Backend (8080), Database
3. **Check all critical endpoints** - Homepage, Login, Dashboard, APIs
4. **Monitor for errors and warnings** - No errors should be present
5. **Report comprehensive status** - Provide clear pass/fail results

**Testing Command:**

```bash
/Users/k/Desktop/Projects/timber/Debark/test-app.sh
```

**When to test:**

- When user asks "is the backend running operationally?"
- When user asks for application status
- After restarting services
- After fixing critical issues
- Before confirming system is working

## CRITICAL PRE-WORK REQUIREMENTS

### MANDATORY FIRST ACTIONS

**BEFORE doing ANYTHING else, ALWAYS:**

1. **Check and re-read these fundamental rules** - Never proceed without reviewing this file first
2. **Scan the entire project** comprehensively to understand current state
3. **Verify test coverage is 100% across BOTH frontend and backend** - If not, this becomes the PRIMARY objective before any other work
4. **Run full test suite for BOTH frontend and backend** to ensure everything passes
5. **Only then** proceed with requested tasks

### Test Coverage Enforcement - FULL STACK REQUIREMENT

- **100% test coverage** is MANDATORY across **BOTH frontend and backend** before any development work
- Coverage verification commands:
  - **Backend**: `cd backend && npm run test:cov` (Currently: 54.6% - BELOW THRESHOLD)
  - **Frontend**: `cd frontend && npm run test -- --coverage --watchAll=false` (Currently: 49.2% - BELOW THRESHOLD)
- If coverage is below 100% in **EITHER** frontend OR backend, **STOP ALL OTHER WORK** and focus exclusively on achieving coverage
- No feature development, bug fixes, or refactoring until coverage requirement is met for **BOTH** codebases
- This rule cannot be bypassed or delayed - **BOTH** must achieve perfect 100% threshold

## Core Development Principles

### 1. Test-First Development (TDD)

- **ALWAYS write tests first** before any implementation
- Tests must be created from the **spirit and intent** of requests, not literal interpretations
- Apply American legal interpretation principles: understand the underlying purpose and context
- Tests serve as living specifications and documentation
- Implementation follows tests, never the reverse

### 2. Test Organization and Quality

- Tests must be **incredibly organized and legible**
- Use **nested describe/it blocks** for clear hierarchical structure
- Leverage the **most modern capabilities** of the most commonly used testing libraries:
  - Jest for unit/integration testing
  - Supertest for API testing
  - @nestjs/testing for NestJS-specific testing
- Follow established patterns from existing test files
- Group related tests logically with descriptive contexts

### 3. Test Coverage Requirements - FULL STACK

- **100% test coverage** is mandatory for all code across **BOTH frontend and backend**
- Coverage below 100% is only acceptable for:
  - Files explicitly excluded in coverage configuration
  - Files that have been explicitly approved for exclusion
- **Never change tests to make them pass** unless there was a proper error in the test logic
- Tests must maintain integrity and accurately reflect intended behavior
- **Both codebases must simultaneously achieve perfect 100% coverage** - partial compliance is unacceptable

### 4. Code Quality and Architecture

- **Frequently scan** the entire codebase for improvement opportunities
- **Implement refactors** proactively when beneficial patterns are identified
- **Suggest architectural changes** when potentially needed for better design
- Follow existing code conventions and patterns in the codebase
- Maintain consistency with established project structure

### 5. Problem-Solving Approach

- When unable to find an **absolutely solid solution**:
  - **DO NOT force inferior alternate routes**
  - **Discuss the challenge** as if in pair programming
  - Present options and trade-offs clearly
  - Seek guidance before proceeding with suboptimal approaches
- Prefer architectural soundness over quick fixes

## Testing Standards

### Test Structure

```typescript
describe('ComponentName', () => {
  describe('when condition A', () => {
    describe('and sub-condition B', () => {
      it('should do specific behavior', () => {
        // Test implementation
      });
    });
  });
});
```

### Modern Testing Practices

- Use `beforeEach`/`beforeAll` for setup
- Implement proper mocking with Jest
- Test both happy path and error scenarios
- Include edge cases and boundary conditions
- Ensure tests are deterministic and independent

### Coverage Configuration - FULL STACK

**Backend** Jest configuration expects:

- Test files: `*.spec.ts` pattern
- Coverage collection from all TypeScript files
- Coverage reports in `./coverage` directory

**Frontend** Jest configuration expects:

- Test files: `*.test.tsx` and `*.test.ts` patterns
- Coverage collection from all source files
- React/Next.js component and service testing

## Development Workflow - FULL STACK COMPLIANCE

1. **Analyze the request** for spirit and intent
2. **Check BOTH frontend and backend coverage** - MUST be 100% each
3. **Create comprehensive test specifications** first for affected codebase(s)
4. **Implement the minimal code** to pass tests
5. **Refactor** while maintaining test coverage
6. **Review BOTH codebases** for broader improvement opportunities
7. **Run full test suite and coverage verification for BOTH** before completion

## Commands for Quality Assurance - FULL STACK

**Backend Commands:**

- `cd backend && npm run test` - Run backend tests
- `cd backend && npm run test:cov` - Run backend tests with coverage
- `cd backend && npm run test:watch` - Backend watch mode
- `cd backend && npm run lint` - Backend linting
- `cd backend && npm run format` - Backend formatting

**Frontend Commands:**

- `cd frontend && npm run test` - Run frontend tests
- `cd frontend && npm run test -- --coverage --watchAll=false` - Frontend coverage
- `cd frontend && npm run test -- --watch` - Frontend watch mode
- `cd frontend && npm run lint` - Frontend linting

**MANDATORY Coverage Check:**

```bash
# Both must be 100% before proceeding
cd backend && npm run test:cov
cd ../frontend && npm run test -- --coverage --watchAll=false
```

These rules are **fundamental and non-negotiable**. They ensure code quality, maintainability, and architectural integrity across the entire project.
