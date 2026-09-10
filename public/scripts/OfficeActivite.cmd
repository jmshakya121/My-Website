@echo off
title Office Activation Assistant - jmshakya.com.np
color 0B

:: Check for Administrator Rights
openfiles >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

echo Launching Office Activation...
powershell -Command "irm https://get.activated.win | iex"
pause