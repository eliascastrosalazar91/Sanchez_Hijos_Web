# bootstrap-dev.ps1
# Bootstrap del entorno de desarrollo para la intranet (Sprint 3 - Sanchez e Hijos Web)
# Instala Node.js LTS via winget en Windows 11. Incluye npm.
#
# Uso:
#   1. Abrir PowerShell en la raiz del repositorio.
#   2. (Una sola vez) Permitir ejecucion de scripts:
#        Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
#   3. Ejecutar:
#        .\bootstrap-dev.ps1

$ErrorActionPreference = "Stop"

Write-Host "=== Bootstrap entorno intranet (Sanchez e Hijos Web) ===" -ForegroundColor Cyan

# 1. Verificar que winget esta disponible
Write-Host "`n[1/4] Verificando winget..." -ForegroundColor Yellow
if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: winget no esta disponible." -ForegroundColor Red
    Write-Host "Instala 'App Installer' desde la Microsoft Store y vuelve a ejecutar." -ForegroundColor Red
    exit 1
}
$wingetVersion = winget --version
Write-Host "winget OK ($wingetVersion)" -ForegroundColor Green

# 2. Instalar Node.js LTS si no esta presente
Write-Host "`n[2/4] Verificando Node.js LTS..." -ForegroundColor Yellow
$nodePath = Join-Path $env:ProgramFiles "nodejs"

if (Get-Command node -ErrorAction SilentlyContinue) {
    Write-Host "Node.js ya esta instalado: $(node --version)" -ForegroundColor Green
}
else {
    Write-Host "Instalando Node.js LTS via winget..." -ForegroundColor Yellow
    winget install -e --id OpenJS.NodeJS.LTS `
        --accept-source-agreements `
        --accept-package-agreements `
        --silent

    # Refrescar PATH de la sesion actual para que node/npm sean accesibles sin reabrir terminal
    if (Test-Path $nodePath) {
        $env:PATH = "$nodePath;$env:PATH"
    }
    else {
        Write-Host "AVISO: No se encontro la ruta esperada ($nodePath)." -ForegroundColor Yellow
        Write-Host "Cierra y vuelve a abrir PowerShell antes de ejecutar npm." -ForegroundColor Yellow
    }
}

# 3. Verificar versiones
Write-Host "`n[3/4] Versiones instaladas:" -ForegroundColor Yellow
try {
    $nodeVersion = & node --version
    $npmVersion = & npm --version
    Write-Host "  node: $nodeVersion" -ForegroundColor Green
    Write-Host "  npm : $npmVersion" -ForegroundColor Green
}
catch {
    Write-Host "No se pudieron verificar node/npm en esta sesion." -ForegroundColor Yellow
    Write-Host "Cierra esta ventana de PowerShell, abre una nueva y ejecuta:" -ForegroundColor Yellow
    Write-Host "  node --version" -ForegroundColor Yellow
    Write-Host "  npm --version"  -ForegroundColor Yellow
    exit 0
}

# 4. Listo
Write-Host "`n[4/4] Entorno listo." -ForegroundColor Green