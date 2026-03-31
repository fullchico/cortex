#!/bin/bash

# Cortex — Installer
# Installs Cortex for Claude Code or Cursor

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo "  ┌─────────────────────────────────┐"
echo "  │           C O R T E X           │"
echo "  │   AI-assisted dev framework     │"
echo "  └─────────────────────────────────┘"
echo ""
echo "  Which AI agent do you use?"
echo ""
echo "    1) Claude Code"
echo "    2) Cursor"
echo "    3) GitHub Copilot"
echo "    4) All of the above"
echo ""
read -p "  Choose (1/2/3/4): " choice

install_claude() {
  SKILL_DIR="$HOME/.claude/skills/cortex"

  if [ ! -d "$HOME/.claude/skills" ]; then
    mkdir -p "$HOME/.claude/skills"
  fi

  if [ -d "$SKILL_DIR" ]; then
    echo "  Updating existing /cortex skill..."
    rm -rf "$SKILL_DIR"
  else
    echo "  Installing /cortex skill..."
  fi

  cp -r "$SCRIPT_DIR/skill/cortex" "$SKILL_DIR"

  echo "  ✓ Skill installed at: $SKILL_DIR"
  echo ""
  echo "  Commands available:"
  echo "    /cortex init    — create a new vault"
  echo "    /cortex start   — open today's session"
  echo "    /cortex end     — save session to vault"
}

ask_project_path() {
  echo ""
  read -p "  Path to your project root: " PROJECT_PATH

  if [ ! -d "$PROJECT_PATH" ]; then
    echo "  ✗ Directory not found: $PROJECT_PATH"
    exit 1
  fi
}

install_cursor() {
  if [ -z "$PROJECT_PATH" ]; then
    ask_project_path
  fi

  cp "$SCRIPT_DIR/cursor-setup/.cursorrules" "$PROJECT_PATH/.cursorrules"
  cp "$SCRIPT_DIR/cursor-setup/.cursorignore" "$PROJECT_PATH/.cursorignore"

  echo "  ✓ .cursorrules installed at: $PROJECT_PATH/.cursorrules"
  echo "  ✓ .cursorignore installed at: $PROJECT_PATH/.cursorignore"
  echo ""
  echo "  Next: edit .cursorrules and set your vault path."
  echo "  See cursor-setup/SETUP-CURSOR.md for details."
}

install_copilot() {
  if [ -z "$PROJECT_PATH" ]; then
    ask_project_path
  fi

  mkdir -p "$PROJECT_PATH/.github"
  cp "$SCRIPT_DIR/copilot-setup/.github/copilot-instructions.md" "$PROJECT_PATH/.github/copilot-instructions.md"

  echo "  ✓ copilot-instructions.md installed at: $PROJECT_PATH/.github/"
  echo ""
  echo "  Recommended: copy vault inside the project:"
  echo "    cp -r $SCRIPT_DIR/vault-template/ $PROJECT_PATH/docs/vault/"
  echo ""
  echo "  Then edit .github/copilot-instructions.md and set vault path."
  echo "  See copilot-setup/SETUP-COPILOT.md for details."
}

case $choice in
  1)
    install_claude
    ;;
  2)
    install_cursor
    ;;
  3)
    install_copilot
    ;;
  4)
    install_claude
    echo ""
    ask_project_path
    install_cursor
    echo ""
    install_copilot
    ;;
  *)
    echo "  Invalid choice. Run again."
    exit 1
    ;;
esac

echo ""
echo "  ┌─────────────────────────────────┐"
echo "  │       Vault template at:        │"
echo "  │  $SCRIPT_DIR/vault-template/    │"
echo "  └─────────────────────────────────┘"
echo ""
echo "  To create a vault, copy the template:"
echo "    cp -r vault-template/ ~/vaults/my-project/"
echo ""
echo "  Or use Claude Code:"
echo "    /cortex init"
echo ""
