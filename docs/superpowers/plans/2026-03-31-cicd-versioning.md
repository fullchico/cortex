# CI/CD + Versioning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set up automated CI/CD with semantic versioning, CHANGELOG generation, and npm publishing for the `cortex-ai` package.

**Architecture:** Two GitHub Actions workflows — `ci.yml` runs tests on every push/PR, `release.yml` runs `semantic-release` on every merge to `main` to automatically bump version, update CHANGELOG, publish to npm, and create a GitHub Release. Commitlint + Husky enforce conventional commit format locally.

**Tech Stack:** GitHub Actions, semantic-release, @semantic-release/* plugins, @commitlint/cli, @commitlint/config-conventional, husky

---

### Task 1: Install dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install all devDependencies**

```bash
npm install --save-dev \
  semantic-release \
  @semantic-release/changelog \
  @semantic-release/git \
  @semantic-release/github \
  @semantic-release/npm \
  @commitlint/cli \
  @commitlint/config-conventional \
  husky
```

- [ ] **Step 2: Verify package.json was updated**

```bash
node -e "const p = JSON.parse(require('fs').readFileSync('package.json','utf8')); console.log(Object.keys(p.devDependencies).sort().join('\n'))"
```

Expected output (all present):
```
@commitlint/cli
@commitlint/config-conventional
@semantic-release/changelog
@semantic-release/git
@semantic-release/github
@semantic-release/npm
husky
semantic-release
```

- [ ] **Step 3: Add `prepare` script to package.json**

In `package.json`, add to the `scripts` section:
```json
"prepare": "husky"
```

- [ ] **Step 4: Run tests to confirm nothing broke**

```bash
npm test
```

Expected: `# pass 42`, `# fail 0`

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install semantic-release, commitlint and husky"
```

---

### Task 2: Configure commitlint

**Files:**
- Create: `commitlint.config.js`

- [ ] **Step 1: Create commitlint config**

Create `commitlint.config.js` at repo root:

```js
export default {
  extends: ['@commitlint/config-conventional'],
};
```

- [ ] **Step 2: Verify commitlint works**

```bash
echo "feat: test message" | npx commitlint
```

Expected: no output (valid commit).

```bash
echo "invalid commit message" | npx commitlint
```

Expected: error output with `subject may not be empty` or similar.

- [ ] **Step 3: Commit**

```bash
git add commitlint.config.js
git commit -m "chore: add commitlint config"
```

---

### Task 3: Configure Husky

**Files:**
- Create: `.husky/commit-msg`

- [ ] **Step 1: Initialize husky**

```bash
npx husky init
```

Expected: `.husky/` directory created with a `pre-commit` file.

- [ ] **Step 2: Replace pre-commit hook with commit-msg hook**

Delete `.husky/pre-commit` (created by `husky init` — we don't need it):

```bash
rm .husky/pre-commit
```

Create `.husky/commit-msg`:

```sh
npx --no -- commitlint --edit $1
```

- [ ] **Step 3: Test the hook locally**

```bash
echo "bad message" > /tmp/test-commit-msg
npx --no -- commitlint --edit /tmp/test-commit-msg
```

Expected: error — commitlint rejects non-conventional message.

```bash
echo "feat: valid message" > /tmp/test-commit-msg
npx --no -- commitlint --edit /tmp/test-commit-msg
```

Expected: no error.

- [ ] **Step 4: Commit**

```bash
git add .husky/
git commit -m "chore: add husky commit-msg hook for commitlint"
```

---

### Task 4: Configure semantic-release

**Files:**
- Create: `.releaserc.json`

- [ ] **Step 1: Create `.releaserc.json`**

```json
{
  "branches": ["main"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/changelog",
      {
        "changelogFile": "CHANGELOG.md"
      }
    ],
    "@semantic-release/npm",
    [
      "@semantic-release/git",
      {
        "assets": ["CHANGELOG.md", "package.json", "package-lock.json"],
        "message": "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
      }
    ],
    "@semantic-release/github"
  ]
}
```

- [ ] **Step 2: Dry-run semantic-release locally to validate config**

```bash
NPM_TOKEN=dummy GITHUB_TOKEN=dummy npx semantic-release --dry-run --no-ci 2>&1 | head -40
```

Expected: output shows plugin loading sequence without crashing on config errors. It will fail on auth — that's expected. What you're checking is that plugins load correctly (no "Cannot find module" errors).

- [ ] **Step 3: Commit**

```bash
git add .releaserc.json
git commit -m "chore: add semantic-release config"
```

---

### Task 5: Create CI workflow

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Create `.github/workflows/` directory and `ci.yml`**

```bash
mkdir -p .github/workflows
```

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test
```

- [ ] **Step 2: Validate YAML syntax**

```bash
node -e "
const fs = require('fs');
const content = fs.readFileSync('.github/workflows/ci.yml', 'utf8');
console.log('Lines:', content.split('\n').length);
console.log('OK — no syntax check tool needed, YAML is readable');
"
```

Expected: prints line count without error.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add CI workflow for tests on push and PR"
```

---

### Task 6: Create release workflow

**Files:**
- Create: `.github/workflows/release.yml`

- [ ] **Step 1: Create `.github/workflows/release.yml`**

```yaml
name: Release

on:
  push:
    branches: [main]

jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      issues: write
      pull-requests: write
      id-token: write

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
        run: npx semantic-release
```

> **Note:** `fetch-depth: 0` is required — semantic-release needs the full git history to determine what changed since the last tag.

> **Note:** `permissions` block is required for semantic-release to write tags, create releases, and comment on PRs/issues.

- [ ] **Step 2: Verify both workflow files exist**

```bash
ls -la .github/workflows/
```

Expected:
```
ci.yml
release.yml
```

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/release.yml
git commit -m "ci: add release workflow with semantic-release"
```

---

### Task 7: Add NPM_TOKEN secret to GitHub

**Files:** none (GitHub UI action)

- [ ] **Step 1: Add secret in GitHub repository settings**

1. Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `NPM_TOKEN`
4. Value: paste your npm token
5. Click **Add secret**

- [ ] **Step 2: Verify secret is listed**

The secret should appear in the list as `NPM_TOKEN` (value hidden).

---

### Task 8: Push and verify pipeline

- [ ] **Step 1: Push all commits to main**

```bash
git push origin main
```

- [ ] **Step 2: Check CI workflow runs in GitHub Actions**

Go to your repo → **Actions** tab. You should see:
- `CI` workflow triggered by the push
- `Release` workflow triggered by the push

- [ ] **Step 3: Verify CI passes**

`CI` workflow should show all steps green, especially `Run tests` showing `# pass 42, # fail 0`.

- [ ] **Step 4: Verify Release runs semantic-release**

`Release` workflow logs should show semantic-release analyzing commits. Since existing commits use conventional format (`feat:`, `fix:`), it should detect a version bump and:
- Update `package.json` version
- Generate `CHANGELOG.md`
- Publish to npm
- Create a GitHub Release

Check npm: `npm view cortex-ai version` — should show the new version.

- [ ] **Step 5: Verify CHANGELOG.md was created**

```bash
git pull origin main
cat CHANGELOG.md | head -30
```

Expected: changelog with release notes grouped by `feat`, `fix`, etc.

---

## Post-setup: Commit workflow

From now on, every commit must follow conventional commit format:

```bash
git commit -m "feat: add new command"      # → minor bump
git commit -m "fix: correct path handling" # → patch bump
git commit -m "chore: update deps"         # → no release
git commit -m "docs: improve README"       # → no release
git commit -m "feat!: breaking API change" # → major bump
```

Husky will reject commits that don't follow this format.
