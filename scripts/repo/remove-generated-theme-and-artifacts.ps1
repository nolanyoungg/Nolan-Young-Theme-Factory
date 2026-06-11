param(
  [Parameter(Mandatory = $true)]
  [Alias('Slug')]
  [string] $Theme,

  [switch] $Yes,
  [switch] $DryRun
)

$ErrorActionPreference = 'Stop'

$argsForBash = @('scripts/repo/remove-generated-theme-and-artifacts.sh', $Theme)
if ($Yes) {
  $argsForBash += '--yes'
}
if ($DryRun) {
  $argsForBash += '--dry-run'
}

bash @argsForBash
