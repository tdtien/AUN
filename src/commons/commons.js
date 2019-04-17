import { Platform } from 'react-native'
import RNFS from "react-native-fs";

export class AppCommon {
    static colors = "#2196F3"
    static background_color = "#F7F5F5"
    static icon_size = 27
    static icon_largeSize = 40
    static font_size = 18
    static directoryPath = Platform.OS === 'android' ? RNFS.ExternalDirectoryPath : RNFS.LibraryDirectoryPath
    static root_dir = "/AUNMobile"
    static pdf_dir = "/PDFFolder"
    static icon = (name) => {
        if (name == 'camera' && Platform.OS == 'android') {
            return name;
        }
        return Platform.OS === 'ios' ? ('ios-' + name ): ('md-' + name);
    }
}