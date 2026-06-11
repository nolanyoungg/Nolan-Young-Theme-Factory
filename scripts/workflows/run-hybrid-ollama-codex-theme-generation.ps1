param(
  [Parameter(ValueFromRemainingArguments = $true)]
  [string[]]$Arguments
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$bash = Get-Command bash -ErrorAction SilentlyContinue
if (-not $bash) {
  throw "bash is required to run the hybrid workflow from PowerShell."
}

& bash "$scriptDir/run-hybrid-ollama-codex-theme-generation.sh" @Arguments
exit $LASTEXITCODE
