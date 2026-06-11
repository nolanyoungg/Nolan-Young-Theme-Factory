param(
  [Parameter(Mandatory = $true)]
  [string] $Slug,

  [switch] $Yes,
  [switch] $DryRun
)

$ErrorActionPreference = 'Stop'

$argsForBash = @('scripts/repo/remove-generated-theme-and-artifacts.sh', $Slug)
if ($Yes) {
  $argsForBash += '--yes'
}
if ($DryRun) {
  $argsForBash += '--dry-run'
}

bash @argsForBash
