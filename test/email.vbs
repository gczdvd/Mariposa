Set wMail=CreateObject("WScript.Shell")
Set wShell=CreateObject("WScript.Shell")

password = InputBox("Jelszo", "Jelszo")
email = InputBox("Email-cim", "Email")
subject = InputBox("Targy", "Targy")

Set oExec=wShell.Exec("mshta.exe ""about:<input type=file id=FILE><script>FILE.click();new ActiveXObject('Scripting.FileSystemObject').GetStandardStream(1).WriteLine(FILE.value);close();resizeTo(0,0);</script>""")
file = oExec.StdOut.ReadLine

resp = MsgBox("Helyesek az adatok?" + vbcrlf + vbcrlf + "Email: " + email + vbcrlf + "Targy: " + subject + vbcrlf + "Fajl: " + file + vbcrlf + "Jelszo: " + password, 4+32, "Helyesek az adatok?")

If resp = 6 Then
    Do While resp <> 2
        resp = MsgBox("Kuldeshez kattints az 'Ismet'-re!" + vbcrlf + vbcrlf + "Email: " + email + vbcrlf + "Targy: " + subject + vbcrlf + "Fajl: " + file, 5+32, "Folytatas?")
        If resp = 4 Then
            wMail.Exec("pscp -pw """ + password + """ -r """ + file + """ David@172.16.193.105:""D:\Work\_Projects\Mariposa\test\send.html""")
            wMail.Exec("plink -ssh David@172.16.193.105 -pw """ + password + """ ""node D:\\Work\\_Projects\\Mariposa\\test\\app.mjs """"" + email + """"" """"" + subject + """"" """"D:\\Work\\_Projects\\Mariposa\\test\\send.html\""""")
            'wMail.Exec("email.bat """ + password + """ """ + email + """ """ + subject + """ """ + file)
        End If
    Loop
End If

WScript.Quit