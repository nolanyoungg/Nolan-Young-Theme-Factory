param(
  [Parameter(Position = 0)]
  [string]$ThemeSlug
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
& powershell.exe -ExecutionPolicy Bypass -File (Join-Path $scriptDir 'packaging/package-generated-wordpress-theme-zip.ps1') $ThemeSlug
exit $LASTEXITCODE