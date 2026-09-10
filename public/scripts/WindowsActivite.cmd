@echo off
title Windows & Office Activation Assistant
color 0A

:: Self-Elevate to Administrator
openfiles >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

echo Launching Activation Suite...
powershell -Command "irm https://get.activated.win | iex"
pause