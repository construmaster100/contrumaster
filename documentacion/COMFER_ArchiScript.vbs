' =============================================================================
' COMFER_ArchiScript.vbs
' Ruta: C:\Users\USUARIO\Desktop\COMFER\COMFER_ArchiScript.vbs
'
' Este script se llama desde Archicad usando:
'   Menú Archicad → Ventana → Paletas → Consola GDL
'   O desde un atajo de teclado personalizado en Archicad
'
' CONFIGURAR ATAJO EN ARCHICAD:
'   1. Opciones → Entorno de trabajo → Atajos de teclado
'   2. Buscar "Ejecutar script" o usar la Consola GDL
'   3. Asignar el atajo que prefieras (ej: Ctrl+Shift+B)
' =============================================================================

' Ruta al script principal del buscador
Dim vbsPath
vbsPath = "C:\Users\USUARIO\Desktop\COMFER\COMFER_Buscador.vbs"

' Ejecutar con WScript en modo oculto (0 = oculto, 1 = normal)
Dim shell
Set shell = CreateObject("WScript.Shell")
shell.Run "wscript.exe """ & vbsPath & """", 1, False

Set shell = Nothing
