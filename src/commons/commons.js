import { Platform } from 'react-native'
import RNFS from "react-native-fs";

export class AppCommon {
    static colors = "#2196F3"
    static icon_size = 27
    static directoryPath = Platform.OS === 'android' ? RNFS.ExternalDirectoryPath : RNFS.LibraryDirectoryPath
    static root_dir = "/AUNMobile"
    static pdf_dir = "/PDFFolder"
    static icon = (name) => {
        if (name == 'camera' && Platform.OS == 'android') {
            return name;
        }
        return Platform.OS === 'ios' ? 'ios-' : 'md-' + name;
    }
}