/**
 * 描述: 相册工具
 * 版权: Copyright (c) 2016
 * 作者: 毛耀平
 * 版本: 1.0.0
 * 创建时间: 2018/3/19
 */
import ReactNativeImagePicker from 'react-native-image-picker';



const options = {
  title: '选择照片', // 选择器的标题，可以设置为空来不显示标题
  cancelButtonTitle: '取消',
  takePhotoButtonTitle: '拍照', // 调取摄像头的按钮，可以设置为空使用户不可选择拍照
  chooseFromLibraryButtonTitle: '从相册中选择', // 调取相册的按钮，可以设置为空使用户不可选择相册照片
  
  storageOptions: {
      skipBackup: true,
      path: 'images'
  },
  quality: 0.75,// 图片品质
  allowsEditing: true, // 当用户选择过照片之后是否允许再次编辑图片
};
export function ImagePicker() {
    return new Promise((resolve, reject) => {
        //console.log(options)
        ReactNativeImagePicker.showImagePicker(options, (response) => {
            //console.log('进来了')
            if (response.didCancel) {
                // 取消
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                // 选中照片
                resolve(response);
            }
        });
    });
}


