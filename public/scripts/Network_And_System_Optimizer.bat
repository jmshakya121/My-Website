@echo off
setlocal enabledelayedexpansion
title PC Network and System Optimizer
color 0B

:: Self-Elevate to Administrator for System Privileges
openfiles >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

cls
echo ===================================================
echo   PC Network and System Optimizer
echo ===================================================
echo.

:: 1. Reset Winsock and IP Stack
echo [1/5] Resetting Winsock and IP Stack...
netsh winsock reset >nul 2>&1
netsh int ip reset >nul 2>&1

:: 2. Flush and Reset DNS Resolver Cache
echo [2/5] Flushing DNS Cache...
ipconfig /flushdns >nul 2>&1
ipconfig /renew >nul 2>&1

:: 3. Clear File Explorer Cache
echo [3/5] Cleaning Explorer History and Cache...
del /f /s /q /a "%LocalAppData%\Microsoft\Windows\Explorer\thumbcache_*.db" >nul 2>&1

:: 4. Optimize Network Adapters
echo [4/5] Optimizing Network Adapters...
netsh interface tcp set global autotuninglevel=normal >nul 2>&1

:: 5. Clear Temporary Logs
echo [5/5] Clearing System Event Logs...
for /f "tokens=*" %%g in ('wevtutil el 2^>nul') do wevtutil cl "%%g" >nul 2>&1

echo.
echo ===================================================
echo   SUCCESS: Network and System Optimization Complete!
echo ===================================================
echo   Note: Restart your PC for full network speedup.
echo.
pause