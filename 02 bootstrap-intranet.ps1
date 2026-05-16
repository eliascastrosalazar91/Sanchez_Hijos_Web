# bootstrap-intranet.ps1
# Scaffold Vite + React + Chart.js en la subcarpeta 'intranet/'.
# Requiere haber ejecutado antes 'bootstrap-dev.ps1' (Node.js y npm operativos).
#
# Uso:
#   1. Abrir PowerShell en la raiz del repositorio.
#   2. Ejecutar:  .\bootstrap-intranet.ps1
#
# Lo que hace (idempotente):
#   1. Verifica que node y npm esten disponibles.
#   2. Si 'intranet/' no existe: crea el proyecto Vite + React JS y corre 'npm install'.
#      Si 'intranet/' ya existe: salta el scaffold y solo valida dependencias.
#   3. Verifica si 'chart.js' esta instalado; si no, lo instala via 'npm install chart.js'.
#   4. Imprime el listado final de archivos generados.
# No ejecuta 'npm run dev' (el desarrollador lo hace manualmente para verificar).

$ErrorActionPreference = "Stop"

Write-Host "=== Scaffold intranet Vite + React ===" -ForegroundColor Cyan

# 1. Verificar node y npm en la sesion actual
Write-Host "`n[1/5] Verificando entorno..." -ForegroundColor Yellow
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: 'node' no esta disponible en esta sesion." -ForegroundColor Red
    Write-Host "Ejecuta primero .\bootstrap-dev.ps1 o abre una nueva ventana de PowerShell." -ForegroundColor Red
    exit 1
}
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: 'npm' no esta disponible en esta sesion." -ForegroundColor Red
    exit 1
}
Write-Host "  node: $(node --version)" -ForegroundColor Green
Write-Host "  npm : $(npm --version)" -ForegroundColor Green


# 2. Detectar modo: scaffold completo vs. solo verificacion de dependencias
Write-Host "`n[2/4] Detectando estado de 'intranet/'..." -ForegroundColor Yellow
$intranetExiste = Test-Path -Path ".\intranet"
if ($intranetExiste) {
    Write-Host "'intranet/' ya existe. Modo: verificacion de dependencias." -ForegroundColor Cyan
}
else {
    Write-Host "'intranet/' no existe. Modo: scaffold completo." -ForegroundColor Cyan
}

# 3. Scaffold y dependencias (solo si intranet/ no existia)
if (-not $intranetExiste) {
    Write-Host "`n[3/4] Creando proyecto Vite + React (puede tardar)..." -ForegroundColor Yellow
    npx --yes create-vite@latest intranet --template react
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: 'create-vite' fallo." -ForegroundColor Red
        exit 1
    }
    Write-Host "Proyecto base creado." -ForegroundColor Green

    Write-Host "`nInstalando dependencias base (npm install)..." -ForegroundColor Yellow
    Push-Location .\intranet
    try {
        npm install
        if ($LASTEXITCODE -ne 0) {
            throw "npm install fallo"
        }
    }
    catch {
        Pop-Location
        Write-Host "ERROR: $_" -ForegroundColor Red
        exit 1
    }
    Pop-Location
}
else {
    Write-Host "`n[3/4] Scaffold omitido (intranet/ ya existe)." -ForegroundColor Cyan
}

# 4. Verificar/instalar chart.js (siempre, independiente del modo)
Write-Host "`n[4/4] Verificando 'chart.js'..." -ForegroundColor Yellow
Push-Location .\intranet
try {
    # 'npm list chart.js --depth=0' devuelve exit code != 0 si no esta instalado
    $listOutput = & npm list chart.js --depth=0 2>&1 | Out-String
    $chartInstalled = ($LASTEXITCODE -eq 0) -and ($listOutput -match "chart\.js@")

    if ($chartInstalled) {
        $version = ($listOutput | Select-String -Pattern "chart\.js@([\d\.]+)").Matches.Groups[1].Value
        Write-Host "chart.js ya esta instalado (v$version). No se reinstala." -ForegroundColor Green
    }
    else {
        Write-Host "chart.js no esta instalado. Instalando..." -ForegroundColor Yellow
        npm install chart.js
        if ($LASTEXITCODE -ne 0) {
            throw "npm install chart.js fallo"
        }
        Write-Host "chart.js instalado correctamente." -ForegroundColor Green
    }
}
catch {
    Pop-Location
    Write-Host "ERROR: $_" -ForegroundColor Red
    exit 1
}
Pop-Location

# Resumen final
Write-Host "`n=== Scaffold completado ===" -ForegroundColor Green
Write-Host "Estructura inicial en 'intranet/':" -ForegroundColor Cyan
Get-ChildItem -Path .\intranet -Force | Where-Object { $_.Name -ne 'node_modules' } | Select-Object Name | Format-Table -HideTableHeaders

# Lanzar dev server y abrir el navegador automaticamente
Write-Host "`nLanzando 'npm run dev' y abriendo http://localhost:5173/ ..." -ForegroundColor Cyan
Write-Host "Para detener el dev server: Ctrl+C en esta ventana." -ForegroundColor Yellow

# Dar unos segundos a Vite para arrancar antes de abrir el navegador
Start-Job -ScriptBlock {
    Start-Sleep -Seconds 4
    Start-Process "http://localhost:5173/"
} | Out-Null

# npm run dev queda corriendo en primer plano hasta que el dev presione Ctrl+C
Push-Location .\intranet
npm run dev
Pop-Location