#!/bin/bash

# Cortex Installer (Mac/Linux)
# Run: chmod +x install.sh && ./install.sh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo "  =================================="
echo "           C O R T E X"
echo "    AI-assisted dev framework"
echo "  =================================="
echo ""
echo "  Which AI agent do you use?"
echo ""
echo "    1) Claude Code (installs skill automatically)"
echo "    2) Cursor (shows setup instructions)"
echo "    3) GitHub Copilot (shows setup instructions)"
echo "    4) Show all"
echo ""
read -p "  Choose (1/2/3/4): " choice

echo ""

case $choice in
  1)
    echo "  === CLAUDE CODE ==="
    echo ""
    SKILL_DIR="$HOME/.claude/skills/cortex"
    mkdir -p "$HOME/.claude/skills"

    if [ -d "$SKILL_DIR" ]; then
      rm -rf "$SKILL_DIR"
      echo "  Updating /cortex skill..."
    else
      echo "  Installing /cortex skill..."
    fi

    cp -r "$SCRIPT_DIR/skill/cortex" "$SKILL_DIR"
    echo "  ✓ Installed at: $SKILL_DIR"
    echo ""
    echo "  Open Claude Code and type: /cortex init"
    ;;

  2)
    echo "  === CURSOR SETUP ==="
    echo ""
    echo "  Copy these files to your project root:"
    echo ""
    echo "    cp $SCRIPT_DIR/cursor-setup/.cursorrules YOUR_PROJECT/.cursorrules"
    echo "    cp $SCRIPT_DIR/cursor-setup/.cursorignore YOUR_PROJECT/.cursorignore"
    echo ""
    echo "  Then edit .cursorrules and set your vault path."
    echo "  See cursor-setup/SETUP-CURSOR.md for details."
    ;;

  3)
    echo "  === GITHUB COPILOT SETUP ==="
    echo ""
    echo "  Copy to your project:"
    echo ""
    echo "    mkdir -p YOUR_PROJECT/.github"
    echo "    cp $SCRIPT_DIR/copilot-setup/.github/copilot-instructions.md YOUR_PROJECT/.github/"
    echo ""
    echo "  Copy vault INSIDE the project (recommended for Copilot):"
    echo "    cp -r $SCRIPT_DIR/vault-template/ YOUR_PROJECT/docs/vault/"
    echo ""
    echo "  Then edit copilot-instructions.md and set vault path."
    echo "  See copilot-setup/SETUP-COPILOT.md for details."
    ;;

  4)
    echo "  === ALL SETUPS ==="
    echo ""
    echo "  CLAUDE CODE (auto-install):"
    SKILL_DIR="$HOME/.claude/skills/cortex"
    mkdir -p "$HOME/.claude/skills"
    [ -d "$SKILL_DIR" ] && rm -rf "$SKILL_DIR"
    cp -r "$SCRIPT_DIR/skill/cortex" "$SKILL_DIR"
    echo "    ✓ Installed at: $SKILL_DIR"
    echo ""
    echo "  CURSOR (manual):"
    echo "    cp cursor-setup/.cursorrules YOUR_PROJECT/"
    echo "    cp cursor-setup/.cursorignore YOUR_PROJECT/"
    echo ""
    echo "  COPILOT (manual):"
    echo "    mkdir -p YOUR_PROJECT/.github"
    echo "    cp copilot-setup/.github/copilot-instructions.md YOUR_PROJECT/.github/"
    echo ""
    echo "  VAULT:"
    echo "    cp -r vault-template/ YOUR_VAULT_PATH/"
    ;;

  *)
    echo "  Invalid choice."
    exit 1
    ;;
esac

echo ""
echo "  =================================="
echo "  Vault template: $SCRIPT_DIR/vault-template/"
echo "  Docs: README.md"
echo "  =================================="
echo ""
