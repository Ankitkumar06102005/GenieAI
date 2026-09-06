@echo off
title Contexta AI Launcher
color 0B
echo ============================================================
echo         Starting Contexta AI (Backend + Frontend)
echo ============================================================
echo.

:: Ensure local tool paths and root PYTHONPATH are present
set "PATH=%LOCALAPPDATA%\Microsoft\WinGet\Packages\OpenJS.NodeJS.LTS_Microsoft.Winget.Source_8wekyb3d8bbwe\node-v24.19.0-win-x64;%LOCALAPPDATA%\Programs\Python\Python311;%LOCALAPPDATA%\Programs\Python\Python311\Scripts;%PATH%"
set "PYTHONPATH=%~dp0;%PYTHONPATH%"

cd /d "%~dp0"

echo [1/3] Launching FastAPI Backend on port 8000 (Local + Mobile Network)...
start "Contexta AI - Backend" cmd /k "cd /d "%~dp0backend" && set "PYTHONPATH=%~dp0;%PYTHONPATH%" && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

echo [2/3] Launching Vite React Frontend on port 5173 (Local + Mobile Network)...
start "Contexta AI - Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev -- --host 0.0.0.0 --port 5173"

echo.
echo [3/3] Opening Contexta AI in your default browser in 3 seconds...
timeout /t 3 /nobreak >nul
start http://127.0.0.1:5173/

echo.
echo ============================================================
echo  Contexta AI is now running!
echo  - Local PC Browser:   http://127.0.0.1:5173/
echo  - Mobile Phone (Wi-Fi): http://<Your-PC-IP>:5173/
echo  - Backend API:        http://127.0.0.1:8000/
echo  - Swagger API Docs:   http://127.0.0.1:8000/docs
echo ============================================================
echo.
echo You can minimize or close this launcher window.
echo The servers will remain running in their dedicated windows.
echo To shut down all services, you can run stop.bat.
echo.
pause
