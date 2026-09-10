@echo off
setlocal enabledelayedexpansion
title Windows Old Storage Cleaner
color 0C

:: Self-Elevate to Administrator
openfiles >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

cls
echo ===================================================
echo   Windows Old and Storage Cleaner
echo ===================================================
echo.

:: 1. Force Remove Windows.old Folder
if exist "%SystemDrive%\Windows.old" (
    echo [1/2] Windows.old found! Taking ownership...
    takeown /F "%SystemDrive%\Windows.old" /A /R /D Y >nul 2>&1
    icacls "%SystemDrive%\Windows.old" /grant Administrators:F /T /C /Q >nul 2>&1
    
    echo [*] Deleting Windows.old folder...
    rmdir /s /q "%SystemDrive%\Windows.old" >nul 2>&1
) else (
    echo [*] No Windows.old folder found on %SystemDrive%\.
)

:: 2. Fast System Update Cleanup via Windows Cleanmgr
echo [2/2] Cleaning system update caches and temporary installation files...
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\VolumeCaches\Previous Installations" /v StateFlags0001 /t REG_DWORD /d 2 /f >nul 2>&1
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\VolumeCaches\Update Cleanup" /v StateFlags0001 /t REG_DWORD /d 2 /f >nul 2>&1
cleanmgr /sagerun:1 >nul 2>&1

echo.
echo ===================================================
echo   SUCCESS: Cleanup Completed!
echo ===================================================
echo.
pause