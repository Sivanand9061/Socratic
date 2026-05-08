@echo off
title The Socratic - Local Server
color 0A

echo ===================================================
echo     Starting The Socratic Development Server
echo ===================================================
echo.

:: Check if Node.js is installed
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in your PATH.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b
)

:: Check if node_modules exists, run npm install if not
if not exist "node_modules\" (
    echo [INFO] First time setup: Installing dependencies...
    echo This may take a few minutes.
    call npm install
) else (
    echo [INFO] Dependencies found.
)

echo.
echo [INFO] Starting the development server...
echo [INFO] The website will open automatically in your browser shortly.
echo.

:: Start the Next.js server in the background
start /b npm run dev

:: Wait for a few seconds to let the server start
timeout /t 5 /nobreak >nul

:: Open the browser
start http://localhost:3000

echo.
echo Server is running! Keep this window open.
echo To stop the server, press Ctrl+C or simply close this window.
echo ===================================================

:: Keep window open
pause
