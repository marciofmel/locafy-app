$env:PATH = [System.Environment]::GetEnvironmentVariable("PATH", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH", "User")
Set-Location -LiteralPath "C:\Users\Marcio\Downloads\frete360\alugue360\backend"
Remove-Item -LiteralPath "C:\Users\Marcio\Downloads\frete360\alugue360\backend\started.txt" -ErrorAction SilentlyContinue
node src/server.js
