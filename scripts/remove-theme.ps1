param(
  [Parameter(Mandatory = $true)]
  [string] $Slug,

  [switch] $Yes,
  [switch] $DryRun
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$argsForScript = @('-ExecutionPolicy', 'Bypass', '-File', (Join-Path $scriptDir 'repo/remove-generated-theme-and-artifacts.ps1'), $Slug)
if ($Yes) { $argsForScript += '-Yes' }
if ($DryRun) { $argsForScript += '-DryRun' }
& powershell.exe @argsForScript
exit $LASTEXITCODE