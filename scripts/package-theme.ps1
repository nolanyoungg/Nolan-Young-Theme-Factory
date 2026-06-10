param(
  [Parameter(Position = 0)]
  [string]$ThemeSlug
)

function Fail([string]$Message) {
  Write-Error $Message
  exit 1
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootDir = Split-Path -Parent $scriptDir

if (-not $ThemeSlug) {
  Fail "Usage: .\scripts\package-theme.ps1 <theme-slug>"
}

if ($ThemeSlug -notmatch '^(\d{3}_nolan_young_theme_[a-z0-9][a-z0-9_]*[a-z0-9]|nolan-showcase-theme-\d{2})$') {
  Fail "Invalid theme slug: $ThemeSlug"
}

$themeDir = Join-Path $rootDir "wp-content/themes/$ThemeSlug"
$zipDir = Join-Path $rootDir "dist/zipped-themes"
$zipPath = Join-Path $zipDir "$ThemeSlug.zip"

if (-not (Test-Path $themeDir -PathType Container)) {
  Fail "Theme directory is missing: $themeDir"
}

New-Item -ItemType Directory -Force -Path $zipDir | Out-Null
if (Test-Path $zipPath) {
  Remove-Item $zipPath -Force
}

Add-Type -AssemblyName System.IO.Compression.FileSystem
$zipStream = [System.IO.File]::Open($zipPath, [System.IO.FileMode]::CreateNew)
$archive = New-Object System.IO.Compression.ZipArchive($zipStream, [System.IO.Compression.ZipArchiveMode]::Create, $false)

try {
  Get-ChildItem -Path $themeDir -Recurse -File | Where-Object {
    $_.FullName -notmatch '[\\/](node_modules|\.git|reports|tmp)[\\/]'
  } | ForEach-Object {
    $relative = $_.FullName.Substring($themeDir.Length).TrimStart('\', '/')
    $entryName = ($ThemeSlug + '/' + $relative) -replace '\\', '/'
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $_.FullName, $entryName) | Out-Null
  }
}
finally {
  $archive.Dispose()
  $zipStream.Dispose()
}

if (-not (Test-Path $zipPath -PathType Leaf)) {
  Fail "ZIP was not created: $zipPath"
}

Write-Host "Created $zipPath"
