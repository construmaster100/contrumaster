Dim xlApp, xlBook, xlPath, fso
xlPath = "C:\Users\USUARIO\Desktop\COMFER\documentacion\V1 Construmaster.xlsm"
Set fso = CreateObject("Scripting.FileSystemObject")
If Not fso.FileExists(xlPath) Then
    MsgBox "No se encontró: " & xlPath, vbExclamation, "COMFER"
    WScript.Quit
End If
On Error Resume Next
Set xlApp = GetObject(, "Excel.Application")
On Error GoTo 0
If IsNull(xlApp) Or IsEmpty(xlApp) Then
    Set xlApp = CreateObject("Excel.Application")
    xlApp.Visible = True
End If
Dim libroAbierto : libroAbierto = False
Dim wb
For Each wb In xlApp.Workbooks
    If InStr(LCase(wb.FullName), "v1_construmaster") > 0 Then
        Set xlBook = wb : libroAbierto = True : Exit For
    End If
Next
If Not libroAbierto Then
    Set xlBook = xlApp.Workbooks.Open(xlPath, , False)
End If
xlApp.Visible = True
xlApp.WindowState = -4137
xlBook.Activate
On Error Resume Next
xlApp.Run "'" & xlBook.Name & "'!BuscarMaterial"
On Error GoTo 0