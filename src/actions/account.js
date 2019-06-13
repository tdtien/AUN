import { LOGIN, LOGOUT } from './types'

export const loginAccount = item => {
    return {
        type: LOGIN,
        id: item.id,
        token: item.token,
        email: item.email,
        admin: item.admin
    }
}

export const logoutAccount = () => {
    return {
        type: LOGOUT
    }
}

export const setFirstTime = (toogle) => {
    return {
        type: SET_FIRST_TIME,
        isFirstTime: toggle
    }
}