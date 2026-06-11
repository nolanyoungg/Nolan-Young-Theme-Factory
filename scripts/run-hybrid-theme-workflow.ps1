param(
  [Parameter(ValueFromRemainingArguments = $true)]
  [string[]]$Arguments
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
& powershell.exe -ExecutionPolicy Bypass -File (Join-Path $scriptDir 'workflows/run-hybrid-ollama-codex-theme-generation.ps1') @Arguments
exit $LASTEXITCODE