# Cortex Installer (PowerShell)
# Run: powershell -ExecutionPolicy Bypass -File install.ps1

Write-Host ""
Write-Host "  =================================="
Write-Host "           C O R T E X"
Write-Host "    AI-assisted dev framework"
Write-Host "  =================================="
Write-Host ""
Write-Host "  Which AI agent do you use?"
Write-Host ""
Write-Host "    1) Claude Code"
Write-Host "    2) Cursor"
Write-Host "    3) GitHub Copilot"
Write-Host "    4) Show all setup instructions"
Write-Host ""
$choice = Read-Host "  Choose (1/2/3/4)"

Write-Host ""

switch ($choice) {
    "1" {
        Write-Host "  === CLAUDE CODE SETUP ==="
        Write-Host ""
        Write-Host "  Run this command to install the skill:"
        Write-Host ""
        Write-Host "    Copy-Item -Recurse 'skill\cortex' `"$env:USERPROFILE\.claude\skills\cortex`""
        Write-Host ""
        Write-Host "  Then open Claude Code and type:"
        Write-Host "    /cortex init"
    }
    "2" {
        Write-Host "  === CURSOR SETUP ==="
        Write-Host ""
        Write-Host "  Copy these files to your project root:"
        Write-Host ""
        Write-Host "    Copy-Item 'cursor-setup\.cursorrules' 'C:\path\to\your\project\.cursorrules'"
        Write-Host "    Copy-Item 'cursor-setup\.cursorignore' 'C:\path\to\your\project\.cursorignore'"
        Write-Host ""
        Write-Host "  Then edit .cursorrules and set your vault path."
        Write-Host "  See cursor-setup\SETUP-CURSOR.md for details."
    }
    "3" {
        Write-Host "  === GITHUB COPILOT SETUP ==="
        Write-Host ""
        Write-Host "  Copy this file to your project:"
        Write-Host ""
        Write-Host "    mkdir 'C:\path\to\your\project\.github'"
        Write-Host "    Copy-Item 'copilot-setup\.github\copilot-instructions.md' 'C:\path\to\your\project\.github\'"
        Write-Host ""
        Write-Host "  Recommended: copy vault INSIDE the project:"
        Write-Host "    Copy-Item -Recurse 'vault-template' 'C:\path\to\your\project\docs\vault'"
        Write-Host ""
        Write-Host "  Then edit copilot-instructions.md and set vault path."
        Write-Host "  See copilot-setup\SETUP-COPILOT.md for details."
    }
    "4" {
        Write-Host "  === ALL SETUPS ==="
        Write-Host ""
        Write-Host "  CLAUDE CODE:"
        Write-Host "    Copy-Item -Recurse 'skill\cortex' `"$env:USERPROFILE\.claude\skills\cortex`""
        Write-Host ""
        Write-Host "  CURSOR:"
        Write-Host "    Copy-Item 'cursor-setup\.cursorrules' 'YOUR_PROJECT\.cursorrules'"
        Write-Host "    Copy-Item 'cursor-setup\.cursorignore' 'YOUR_PROJECT\.cursorignore'"
        Write-Host ""
        Write-Host "  COPILOT:"
        Write-Host "    mkdir 'YOUR_PROJECT\.github'"
        Write-Host "    Copy-Item 'copilot-setup\.github\copilot-instructions.md' 'YOUR_PROJECT\.github\'"
        Write-Host ""
        Write-Host "  VAULT:"
        Write-Host "    Copy-Item -Recurse 'vault-template' 'YOUR_VAULT_PATH'"
    }
    default {
        Write-Host "  Invalid choice."
    }
}

Write-Host ""
Write-Host "  =================================="
Write-Host "  Vault template: vault-template\"
Write-Host "  Docs: README.md"
Write-Host "  =================================="
Write-Host ""
