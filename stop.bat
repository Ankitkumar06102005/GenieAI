@echo off
title Stop Contexta AI
color 0C
echo ============================================================
echo                 Stopping Contexta AI
echo ============================================================
echo.

echo Stopping backend on port 8000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 ^| findstr LISTENING') do (
    taskkill /F /PID %%a 2>nul
)

echo Stopping frontend on port 5173...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173 ^| findstr LISTENING') do (
    taskkill /F /PID %%a 2>nul
)

echo.
echo All Contexta AI services have been stopped.
echo ============================================================
timeout /t 3 /nobreak >nul
