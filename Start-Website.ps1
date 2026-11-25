param([string]$NodeExecutable='', [switch]$Build)
$ErrorActionPreference='Stop'
Set-Location -LiteralPath $PSScriptRoot
if (-not $NodeExecutable) {
  $candidateNodes=@((Get-Command node -ErrorAction SilentlyContinue).Source)
  $candidateNodes+=@(Get-ChildItem -Path 'C:\Program Files\WindowsApps\OpenAI.CodexPrimaryRuntime*\dependencies\node\bin\node.exe' -ErrorAction SilentlyContinue | Select-Object -ExpandProperty FullName)
  $runtimePackages=@(Get-AppxPackage -Name 'OpenAI.CodexPrimaryRuntime*' -ErrorAction SilentlyContinue)
  foreach ($runtimePackage in $runtimePackages) { $candidateNodes+=Join-Path $runtimePackage.InstallLocation 'dependencies\node\bin\node.exe' }
  foreach ($candidateNode in $candidateNodes) {
    if (-not $candidateNode -or -not (Test-Path -LiteralPath $candidateNode)) { continue }
    $versionText=& $candidateNode --version
    $version=[version]($versionText.TrimStart('v'))
    if ($version -ge [version]'22.23.4') { $NodeExecutable=$candidateNode; break }
  }
}
if (-not $NodeExecutable) { throw 'Node.js 22.23.4 or newer is required. Pass -NodeExecutable with its full path.' }
if ($Build -or -not (Test-Path -LiteralPath '.\dist\index.html')) {
  & $NodeExecutable '.\scripts\run-astro.mjs' build
  if ($LASTEXITCODE -ne 0) { throw 'Website build failed.' }
}
& $NodeExecutable '--env-file-if-exists=.env' '.\server\index.mjs'
