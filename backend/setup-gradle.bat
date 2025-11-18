@echo off
setlocal enabledelayedexpansion

echo ========================================
echo Gradle Wrapper 설치 스크립트
echo ========================================
echo.

REM Gradle 버전 설정
set GRADLE_VERSION=8.5

echo Gradle Wrapper를 설치합니다...
echo.

REM gradle 폴더가 없으면 생성
if not exist "gradle\wrapper" mkdir gradle\wrapper

echo Gradle Wrapper JAR 다운로드 중...
powershell -Command "& {Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/gradle/gradle/master/gradle/wrapper/gradle-wrapper.jar' -OutFile 'gradle/wrapper/gradle-wrapper.jar'}"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [오류] Gradle Wrapper JAR 다운로드 실패
    echo.
    echo 대안:
    echo 1. Gradle을 직접 설치: https://gradle.org/install/
    echo 2. IDE 사용 (IntelliJ IDEA가 자동으로 처리)
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Gradle Wrapper 설치 완료!
echo ========================================
echo.
echo 이제 다음 명령으로 백엔드를 실행할 수 있습니다:
echo   gradlew.bat bootRun
echo.
echo 또는 루트 폴더에서:
echo   npm run dev
echo.
pause
