@echo off

set TOOL_NAME=git.exe

where %TOOL_NAME% >nul 2>&1

if %errorlevel% equ 0 (
  echo TRUE
) else (
  echo FALSE
)