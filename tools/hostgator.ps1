<#
.SYNOPSIS
  HostGator helpers for otrcable.com (uses ~/.ssh/config Host otrcable.com).

.PARAMETER Action
  RestoreLatestRawlsPublicHtmlBackup — Undo a bad public_html swap (see script body).
  DeployOtrToPublicHtml            — Upload this repo’s public site into ~/public_html (overwrites files).
  DeployOtrToAddonDocroot          — Upload into ~/otrcable.com/ (use after cPanel points otrcable.com there).

.NOTES
  - Nothing in this repo changes other domains; Rawls at rawlsprecisionconstruction.com uses its own folder.
  - If SSH from Cursor/agent fails with "Connection refused" on port 2222, run this script from your own PC
    (same keys); some networks block outbound 2222 or trigger fail2ban on rapid connects.
  - rawls-precision-construction: merge branch fix/deploy-to-addon-docroot so deploy.sh uses GIT_WORK_TREE
    /home2/agmsxxte/rawlsprecisionconstruction.com (stops future Rawls checkouts into public_html).
#>
param(
    [Parameter(Mandatory = $true)]
    [ValidateSet('RestoreLatestRawlsPublicHtmlBackup', 'DeployOtrToPublicHtml', 'DeployOtrToAddonDocroot')]
    [string] $Action
)

$ErrorActionPreference = 'Stop'
$RepoRoot = Split-Path $PSScriptRoot -Parent
if (-not (Test-Path (Join-Path $RepoRoot 'index.html'))) {
    throw "Could not find OTR site root (index.html missing at $($RepoRoot))."
}

$ScpDestPublic = "otrcable.com:/home2/agmsxxte/public_html/"
$ScpDestAddon = "otrcable.com:/home2/agmsxxte/otrcable.com/"

if ($Action -eq 'RestoreLatestRawlsPublicHtmlBackup') {
    $backup = (ssh -o BatchMode=yes otrcable.com "ls -dt /home2/agmsxxte/public_html_rawls_backup_* 2>/dev/null | head -1").Trim()
    if (-not $backup) { throw "No /home2/agmsxxte/public_html_rawls_backup_* directory found on server." }
    $hasRawls = (ssh -o BatchMode=yes otrcable.com "test -f /home2/agmsxxte/public_html/index.php -a -d /home2/agmsxxte/public_html/backend && echo yes").Trim()
    if ($hasRawls -eq 'yes') {
        Write-Host "public_html already contains Rawls (index.php + backend). No restore needed." -ForegroundColor Yellow
        exit 0
    }
    Write-Host "Restoring public_html from: $backup" -ForegroundColor Cyan
    ssh -o BatchMode=yes otrcable.com "rm -rf /home2/agmsxxte/public_html && mv $backup /home2/agmsxxte/public_html && chmod 0751 /home2/agmsxxte/public_html 2>/dev/null || true"
    if ($LASTEXITCODE -ne 0) { throw "Restore failed ($LASTEXITCODE)." }
    Write-Host "Done. https://otrcable.com/ should show Rawls again until you point the domain at OTR files." -ForegroundColor Green
    exit 0
}

function Send-OtrFiles {
    param([string] $Dest)
    $base = $RepoRoot
    scp "$base\.htaccess" $Dest
    scp "$base\robots.txt" $Dest
    scp "$base\sitemap.xml" $Dest
    Get-ChildItem $base -Filter *.html -File | ForEach-Object { scp $_.FullName $Dest }
    scp -r "$base\api" $Dest
    scp -r "$base\config" $Dest
    scp -r "$base\setup" $Dest
    scp -r "$base\leadership" $Dest
}

if ($Action -eq 'DeployOtrToPublicHtml') {
    Write-Warning "This overwrites matching paths under ~/public_html. Rawls deploy must target rawlsprecisionconstruction.com only (see rawls repo deploy.sh)."
    Send-OtrFiles $ScpDestPublic
    Write-Host "Deployed OTR site to public_html. Test https://otrcable.com/" -ForegroundColor Green
    exit 0
}

if ($Action -eq 'DeployOtrToAddonDocroot') {
    Send-OtrFiles $ScpDestAddon
    Write-Host @"
Deployed OTR files to /home2/agmsxxte/otrcable.com/
In HostGator → Websites → otrcable.com → set Document Root to that folder (not public_html), then test https://otrcable.com/
"@ -ForegroundColor Cyan
    exit 0
}
