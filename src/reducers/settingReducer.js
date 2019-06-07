import { CHANGE_LANGUAGE } from "../actions/types";
import I18n from "../i18n/i18n";

const initialState = {
    language: 'en',
};

const settingReducer = (state = initialState, action) => {
    let { data } = action;
    switch (action.type) {
        case CHANGE_LANGUAGE: {
            // console.log('old I18n: ' + JSON.stringify(I18n));
            if (data.language !== 'en' && data.language !== 'vi') {
                data.language = 'en';
            }
            state = Object.assign({}, state, { language: data.language });
            I18n.locale = data.language;
            // console.log('new I18n: ' + JSON.stringify(I18n));
            return state;
        }
        default:
            return state;
    }
}

export default settingReducer;