@echo off
title PulseAlerts - Global Trading News Terminal
echo =====================================================================
echo                 PulseAlerts - GLOBAL TRADING TERMINAL
echo =====================================================================
echo [INFO] Launching PulseAlerts in Google Chrome...
echo [INFO] Background Monitoring: Active (War Radar + CPI/FOMC Calendar)
echo.

if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" "%~dp0index.html"
) else (
    start "" "%~dp0index.html"
)

echo [READY] PulseAlerts is running.
