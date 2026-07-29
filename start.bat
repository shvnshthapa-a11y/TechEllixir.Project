@echo off
title TechEllixir Platform Launcher
color 0A

echo ========================================================
echo          🚀 TechEllixir Enterprise Platform
echo       Starting Backend & Frontend Servers...
echo ========================================================
echo.

set PROJECT_ROOT=%~dp0

echo [1/3] Starting Backend Server (Port 8080)...
start "TechEllixir Backend (Port 8080)" /min cmd /k "cd /d "%PROJECT_ROOT%backend" && node index.js"

echo [2/3] Starting Frontend Dev Server (Port 5173)...
start "TechEllixir Frontend (Port 5173)" /min cmd /k "cd /d "%PROJECT_ROOT%frontend" && npm run dev -- --port 5173"

echo.
echo [3/3] Waiting for servers to initialize...
timeout /t 3 /nobreak >nul

echo.
echo --------------------------------------------------------
echo ✅ Backend API Server  : http://localhost:8080
echo ✅ Frontend Web Portal : http://localhost:5173
echo ✅ Admin Master Console: http://localhost:5173/admin
echo.
echo 🔑 Admin Credentials   : admin / admin@123
echo --------------------------------------------------------
echo.
echo Launching your default web browser to http://localhost:5173 ...
start http://localhost:5173

pause
