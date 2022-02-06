; #Include <Comment>
#Include <StandardLibrary>
#Include <Recurse_A>
#Include <LocalLibClass>
#Include ./otherscript.ahk
#Include ./otherscript2.ahk

#Include %A_LineFile%\..\lib\nestlib
#Include NestLibClass.ahk
#Include NestLibFunction.ahk

#Include <.DotLibFile>
#Include %A_LineFile%\..\.DotFile.ahk
LocalLib_MsgBox(StrSplit(A_ScriptName, ".")[1])