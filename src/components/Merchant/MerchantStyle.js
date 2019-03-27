import { StyleSheet } from 'react-native';
import { AppCommon } from '../../commons/commons';

export const merchantStyles = StyleSheet.create({
    cameraButton: {
        position: 'absolute',
        width: 60,
        height: 60,
        bottom: 20,
        right: 20,
        borderRadius: 60,
        backgroundColor: AppCommon.colors,
        alignItems: 'center',
        justifyContent: 'center',
    }
})