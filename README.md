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

答：init命令默认会创建最新的版本，而目前最新的0.45版本需要下载boost库编译。此库体积庞大，在国内即便翻墙也很难下载成功，导致很多人无法正常运行iOS项目，推荐暂时使用0.44.3的版本。创建项目暂时先使用react-native init MyApp –version 0.44.3，指定某个版本。 你可以使用–version参数（注意是两个杠）创建指定版本的项目。例如react-native init MyApp –version 0.44.3。注意版本号必须精确到两个小数点。

4.macos运行react-native run-android报错Connection reset

答：执行sudo react-native run-android

5.macos运行react-native run-android报错
SDK location not found. Define location with sdk.dir in the local.properties file or with an ANDROID_HOME environment variable.

答：配置ANDROID_HOME环境变量，并且在工程的android目录下新建local.properties文件，然后文件内配置sdk.dir=/Users/.../Library/Android/sdk

6.react-native android项目怎么hot reload

答：在emulator上按command + M 即可，windows系统则按ctrl + M