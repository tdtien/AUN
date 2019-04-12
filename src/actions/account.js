import { LOGIN } from './types'

export const loginAccount = item => {
    return {
        type: LOGIN,
        id: item.id,
        token: item.token,
        email: item.email,
        role: item.role
    }
}