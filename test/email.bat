@echo on
pscp -pw %1 -r %4 David@172.16.193.105:"D:\Work\_Projects\Mariposa\test\send.html"
plink -ssh David@172.16.193.105 -pw %1 "node D:\\Work\\_Projects\\Mariposa\\test\\app.mjs \"%2\" \"%3\" \"D:\\Work\\_Projects\\Mariposa\\test\\send.html\""