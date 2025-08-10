
### 找到執行檔並刪除.
netstat -ano | findstr ":500" 
netstat -ano | findstr ":300" 
Stop-Process -Id xxxxx -Force 