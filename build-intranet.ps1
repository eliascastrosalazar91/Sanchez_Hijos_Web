# build-intranet.ps1
# Constructor del build de produccion de la intranet React.
# Se ejecuta desde la raiz del repositorio:
#     .\build-intranet.ps1
#
# Pasos que realiza:
#   1. Verifica que exista la carpeta intranet/ junto al script.
#   2. Si no hay intranet/node_modules, ejecuta 'npm install' para
#      instalar dependencias (util en un clon limpio del repo).
#   3. Borra intranet/dist/ si existia, para asegurar un build limpio.
#   4. Ejecuta 'npm run build' dentro de intranet/.
#   5. Reporta exito o falla con codigo de salida apropiado.
#
# El script NO toca archivos fuente: solo genera/limpia intranet/dist/.
#
# Requisitos en la maquina:
#   - Node.js + npm en el PATH (probado con Node 18+).
#   - PowerShell 5.1 o superior (incluido en Windows 10/11).

# Detener la ejecucion ante cualquier error no manejado
$ErrorActionPreference = 'Stop'

# Paths anclados al script: funciona aunque ejecutes desde cualquier directorio
$RepoRoot    = $PSScriptRoot
$IntranetDir = Join-Path $RepoRoot   'intranet'
$DistDir     = Join-Path $IntranetDir 'dist'
$NodeModules = Join-Path $IntranetDir 'node_modules'

Write-Host ''
Write-Host '====================================================' -ForegroundColor Cyan
Write-Host '  Build de la intranet React (Sanchez e Hijos SpA)  ' -ForegroundColor Cyan
Write-Host '====================================================' -ForegroundColor Cyan
Write-Host ''

# ------------------------------------------------------------------
# Paso 1/4: validar estructura
# ------------------------------------------------------------------
if (-not (Test-Path $IntranetDir -PathType Container)) {
    Write-Host "ERROR: no se encontro la carpeta intranet/ en $RepoRoot" -ForegroundColor Red
    Write-Host "Verifica que el script este en la raiz del repositorio."  -ForegroundColor Red
    exit 1
}
Write-Host "[1/4] Estructura validada: $IntranetDir" -ForegroundColor Green

# ------------------------------------------------------------------
# Paso 2/4: instalar dependencias si node_modules no existe
# ------------------------------------------------------------------
if (-not (Test-Path $NodeModules -PathType Container)) {
    Write-Host ''
    Write-Host "[2/4] node_modules no encontrado. Ejecutando 'npm install'..." -ForegroundColor Yellow
    Push-Location $IntranetDir
    try {
        npm install
        if ($LASTEXITCODE -ne 0) {
            throw "npm install fallo con codigo $LASTEXITCODE"
        }
    } finally {
        Pop-Location
    }
    Write-Host "[2/4] Dependencias instaladas." -ForegroundColor Green
} else {
    Write-Host "[2/4] node_modules ya existe, se omite 'npm install'." -ForegroundColor Green
}

# ------------------------------------------------------------------
# Paso 3/4: limpiar dist/ previo
# ------------------------------------------------------------------
if (Test-Path $DistDir) {
    Write-Host ''
    Write-Host "[3/4] Eliminando build anterior en $DistDir..." -ForegroundColor Yellow
    Remove-Item -Path $DistDir -Recurse -Force
}
Write-Host "[3/4] Carpeta dist limpia, lista para el build." -ForegroundColor Green

# ------------------------------------------------------------------
# Paso 4/4: ejecutar el build de Vite
# ------------------------------------------------------------------
Write-Host ''
Write-Host "[4/4] Ejecutando 'npm run build' en $IntranetDir..." -ForegroundColor Yellow
Write-Host ''
Push-Location $IntranetDir
try {
    npm run build
    $buildExit = $LASTEXITCODE
} finally {
    Pop-Location
}

Write-Host ''
if ($buildExit -ne 0) {
    Write-Host '====================================================' -ForegroundColor Red
    Write-Host "  BUILD FALLIDO (codigo $buildExit)                  " -ForegroundColor Red
    Write-Host '====================================================' -ForegroundColor Red
    exit $buildExit
}

# Verificacion minima del resultado
$DistIndex = Join-Path $DistDir 'index.html'
if (-not (Test-Path $DistIndex)) {
    Write-Host "ADVERTENCIA: el build termino sin error pero no se genero $DistIndex" -ForegroundColor Red
    exit 1
}

Write-Host '====================================================' -ForegroundColor Green
Write-Host '  BUILD EXITOSO                                     ' -ForegroundColor Green
Write-Host '====================================================' -ForegroundColor Green
Write-Host ''
Write-Host "  Salida:           $DistDir"   -ForegroundColor Green
Write-Host "  Punto de entrada: $DistIndex" -ForegroundColor Green
Write-Host ''
Write-Host '  Para verificar, abre el index.html en tu navegador (doble click).' -ForegroundColor Cyan
Write-Host ''
exit 0