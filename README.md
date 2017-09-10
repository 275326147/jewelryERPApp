# jewelry-erp-app GainHon jewelry ERP app project
开发环境搭建请参考https://github.com/275326147/jewelryERPApp.git

环境搭建报错FAQ（更多FAQ请查看http://www.jianshu.com/p/98c8f2a970eb）:

1.运行android虚拟机（emulator @myavd）报错
ERROR:./android/qt/qt_setup.cpp:28:Qt library not found   
../emulator/qemu/darwin-x86_64/qemu-system-x86_64 没有该命令或者目录  

答：新版android sdk将emulator从tools里面分离出来了，所以配置环境变量的时候，先配置emulator目录，然后配置tools和platform-tools目录


2.在macOS运行react-native run-ios报错
xcrun: error: unable to find utility "instruments", not a developer tool or in PATH

答：执行如下命令 sudo xcode-select -s /Applications/Xcode.app/Contents/Developer/


3.在macOS运行react-native run-ios报错
An error was encountered processing the command (domain=NSPOSIXErrorDomain, code=2):
Failed to install the requested application
An application bundle was not found at the provided path.
Provide a valid path to the desired application bundle.
Print: Entry, ":CFBundleIdentifier", Does Not Exist

答：
1. 安装
npm i -g rninit
2. 用特定的 react-native npm 版本创建工程：
rninit init [Project Name] --source react-native@0.44.3


4.macos运行react-native run-android报错Connection reset

答：执行sudo react-native run-android


5.macos运行react-native run-android报错
SDK location not found. Define location with sdk.dir in the local.properties file or with an ANDROID_HOME environment variable.

答：配置ANDROID_HOME环境变量，并且在工程的android目录下新建local.properties文件，然后文件内配置sdk.dir=/Users/.../Library/Android/sdk


6.react-native项目怎么hot reload

答：android工程在emulator上按command + M 即可，windows系统则按ctrl + M。iOS工程在emulator上按command + R即可


7.react-native项目run-ios成功后提示No devices are booted.并没有部署成功

答：到emulator的Hardware下reboot设备，然后重新执行react-native run-ios，千万不要加sudo