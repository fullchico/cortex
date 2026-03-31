# Cortex — Installer (PowerShell)
# Windows:  powershell -ExecutionPolicy Bypass -File install.ps1
# Mac/Linux: pwsh install.ps1

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host ""
Write-Host "  ┌─────────────────────────────────┐"
Write-Host "  │           C O R T E X           │"
Write-Host "  │   AI-assisted dev framework     │"
Write-Host "  └─────────────────────────────────┘"
Write-Host ""
Write-Host "  Which AI agent do you use?"
Write-Host ""
Write-Host "    1) Claude Code"
Write-Host "    2) Cursor"
Write-Host "    3) GitHub Copilot"
Write-Host "    4) All of the above"
Write-Host ""
$choice = Read-Host "  Choose (1/2/3/4)"

function Install-Claude {
    $SkillDir = Join-Path $env:USERPROFILE ".claude" "skills" "cortex"
    $SkillsParent = Join-Path $env:USERPROFILE ".claude" "skills"
    $SourceSkill = Join-Path $ScriptDir "skill" "cortex"

    if (!(Test-Path $SkillsParent)) {
        New-Item -ItemType Directory -Path $SkillsParent -Force | Out-Null
    }

    if (Test-Path $SkillDir) {
        Write-Host "  Updating existing /cortex skill..."
        Remove-Item -Recurse -Force $SkillDir
    } else {
        Write-Host "  Installing /cortex skill..."
    }

    Copy-Item -Recurse $SourceSkill $SkillDir

    Write-Host "  ✓ Skill installed at: $SkillDir"
    Write-Host ""
    Write-Host "  Commands available:"
    Write-Host "    /cortex init    — create a new vault"
    Write-Host "    /cortex start   — open today's session"
    Write-Host "    /cortex end     — save session to vault"
}

function Get-ProjectPath {
    $script:ProjectPath = Read-Host "`n  Path to your project root"

    if (!(Test-Path $script:ProjectPath)) {
        Write-Host "  ✗ Directory not found: $script:ProjectPath"
        exit 1
    }
}

function Install-Cursor {
    if (!$script:ProjectPath) { Get-ProjectPath }

    $SourceRules = Join-Path $ScriptDir "cursor-setup" ".cursorrules"
    $SourceIgnore = Join-Path $ScriptDir "cursor-setup" ".cursorignore"
    $DestRules = Join-Path $script:ProjectPath ".cursorrules"
    $DestIgnore = Join-Path $script:ProjectPath ".cursorignore"

    Copy-Item $SourceRules $DestRules
    Copy-Item $SourceIgnore $DestIgnore

    Write-Host "  ✓ .cursorrules installed at: $DestRules"
    Write-Host "  ✓ .cursorignore installed at: $DestIgnore"
    Write-Host ""
    Write-Host "  Next: edit .cursorrules and set your vault path."
}

function Install-Copilot {
    if (!$script:ProjectPath) { Get-ProjectPath }

    $GithubDir = Join-Path $script:ProjectPath ".github"
    $SourceInstructions = Join-Path $ScriptDir "copilot-setup" ".github" "copilot-instructions.md"
    $DestInstructions = Join-Path $GithubDir "copilot-instructions.md"

    if (!(Test-Path $GithubDir)) {
        New-Item -ItemType Directory -Path $GithubDir -Force | Out-Null
    }

    Copy-Item $SourceInstructions $DestInstructions

    Write-Host "  ✓ copilot-instructions.md installed at: $GithubDir"
    Write-Host ""
    Write-Host "  Recommended: copy vault inside the project:"
    $VaultSource = Join-Path $ScriptDir "vault-template"
    $VaultDest = Join-Path $script:ProjectPath "docs" "vault"
    Write-Host "    Copy-Item -Recurse '$VaultSource' '$VaultDest'"
    Write-Host ""
    Write-Host "  Then edit copilot-instructions.md and set vault path."
}

switch ($choice) {
    "1" { Install-Claude }
    "2" { Install-Cursor }
    "3" { Install-Copilot }
    "4" {
        Install-Claude
        Write-Host ""
        Get-ProjectPath
        Install-Cursor
        Write-Host ""
        Install-Copilot
    }
    default {
        Write-Host "  Invalid choice. Run again."
        exit 1
    }
}

$VaultTemplatePath = Join-Path $ScriptDir "vault-template"

Write-Host ""
Write-Host "  ┌─────────────────────────────────┐"
Write-Host "  │        Setup complete!          │"
Write-Host "  └─────────────────────────────────┘"
Write-Host ""
Write-Host "  Vault template at:"
Write-Host "    $VaultTemplatePath"
Write-Host ""
Write-Host "  Quick start:"
Write-Host "    1. Copy vault-template/ to your vault location"
Write-Host "    2. Open it in Obsidian (Open folder as vault)"
Write-Host "    3. In Claude Code: /cortex init"
Write-Host ""
