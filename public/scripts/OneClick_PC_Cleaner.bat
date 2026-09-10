@echo off
setlocal enabledelayedexpansion
title PC Cleaner Utility
color 0A

:: Self-Elevate to Administrator for Windows Privileges
openfiles >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

cls
echo ===================================================
echo   Running System Cleaning Utility
echo ===================================================
echo.

:: 1. User Temp Directory
echo [1/4] Cleaning User Local Temp...
if exist "%temp%" (
    del /s /f /q "%temp%\*.*" >nul 2>&1
    for /d %%p in ("%temp%\*") do rmdir /s /q "%%p" >nul 2>&1
)

:: 2. Windows System Temp
echo [2/4] Cleaning Windows System Temp...
if exist "%SystemRoot%\Temp" (
    del /s /f /q "%SystemRoot%\Temp\*.*" >nul 2>&1
    for /d %%p in ("%SystemRoot%\Temp\*") do rmdir /s /q "%%p" >nul 2>&1
)

:: 3. Windows Prefetch Cache
echo [3/4] Cleaning Windows Prefetch Cache...
if exist "%SystemRoot%\Prefetch" (
    del /s /f /q "%SystemRoot%\Prefetch\*.*" >nul 2>&1
    for /d %%p in ("%SystemRoot%\Prefetch\*") do rmdir /s /q "%%p" >nul 2>&1
)

:: 4. DNS Cache Flush
echo [4/4] Flushing DNS Resolver Cache...
ipconfig /flushdns >nul 2>&1

echo.
echo ===================================================
echo   SUCCESS: Cleanup Completed Successfully!
echo ===================================================
echo.
pause