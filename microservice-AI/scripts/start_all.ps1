Write-Host "🚀 Starting Smart Career AI Microservice" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

# Step 1: Start Ollama if not running
Write-Host "`n1. Checking Ollama service..." -ForegroundColor Yellow
$ollamaProcess = Get-Process -Name "ollama" -ErrorAction SilentlyContinue

if ($ollamaProcess -eq $null) {
    Write-Host "   Starting Ollama..." -ForegroundColor Yellow
    Start-Process -NoNewWindow -FilePath "ollama" -ArgumentList "serve"
    Start-Sleep -Seconds 5
    Write-Host "   ✅ Ollama started" -ForegroundColor Green
} else {
    Write-Host "   ✅ Ollama is already running" -ForegroundColor Green
}

# Step 2: Pull model if needed
Write-Host "`n2. Checking model availability..." -ForegroundColor Yellow
ollama pull mistral

# Step 3: Activate virtual environment
Write-Host "`n3. Activating Python virtual environment..." -ForegroundColor Yellow
.\venv\Scripts\Activate.ps1

# Step 4: Install dependencies
Write-Host "`n4. Installing dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

# Step 5: Start FastAPI server
Write-Host "`n5. Starting AI Microservice..." -ForegroundColor Yellow
Write-Host "   API Documentation: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "   Health Check: http://localhost:8000/api/v1/health" -ForegroundColor Cyan
Write-Host "`nPress Ctrl+C to stop the server" -ForegroundColor Red

cd app
uvicorn main:app --reload --host 0.0.0.0 --port 8000