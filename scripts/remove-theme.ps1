param(
  [Parameter(Mandatory = $true)]
  [Alias('Slug')]
  [string] $Theme,

  [switch] $Yes,
  [switch] $DryRun
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$argsForScript = @('-ExecutionPolicy', 'Bypass', '-File', (Join-Path $scriptDir 'repo/remove-generated-theme-and-artifacts.ps1'), $Theme)
if ($Yes) { $argsForScript += '-Yes' }
if ($DryRun) { $argsForScript += '-DryRun' }
& powershell.exe @argsForScript
exit $LASTEXITCODE
