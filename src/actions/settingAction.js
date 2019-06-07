import { CHANGE_LANGUAGE } from './types'

type SettingInfo = {
    language: string
}

export const changeLanguage = (info: SettingInfo) => {
    return {
        type: CHANGE_LANGUAGE,
        data: info,
    };
};