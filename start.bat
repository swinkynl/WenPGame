@echo off
rem Start het spel: dubbelklik op dit bestand.
rem Op de iPad (zelfde wifi): open http://<ip-adres-van-deze-laptop>:8080
cd /d "%~dp0"
echo.
echo  Het spel draait! Open in de browser: http://localhost:8080
echo  Op de iPad (zelfde wifi) gebruik je een van deze adressen:
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do echo     http:%%a:8080
echo.
echo  Sluit dit venster om te stoppen.
start "" http://localhost:8080
python -m http.server 8080
