import { Platform } from 'react-native'
import RNFS from "react-native-fs";

export class AppCommon {
    static colors = "#2196F3"
    static directoryPath = Platform.OS === 'android' ? RNFS.ExternalDirectoryPath : RNFS.LibraryDirectoryPath
    static root_dir = "/AUNMobile"
    static pdf_dir = "/PDFFolder"
}