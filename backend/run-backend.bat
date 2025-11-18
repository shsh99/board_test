@echo off
echo ========================================
echo Kanban Board Backend 실행
echo ========================================
echo.
echo Java 버전 확인 중...
java -version
echo.
echo ========================================
echo.
echo 백엔드를 실행하려면 다음 중 하나를 선택하세요:
echo.
echo [방법 1] IntelliJ IDEA 사용 (권장)
echo   1. IntelliJ IDEA 실행
echo   2. File -^> Open -^> backend 폴더 선택
echo   3. Gradle 프로젝트 import 대기
echo   4. KanbanBoardApplication.java 파일 열기
echo   5. main 메서드 옆 실행 버튼 클릭
echo.
echo [방법 2] Gradle 명령 실행
echo   Gradle이 설치되어 있다면:
echo   gradle wrapper --gradle-version 8.5
echo   gradlew.bat bootRun
echo.
echo ========================================
pause
