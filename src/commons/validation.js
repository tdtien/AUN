const regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
const regPassword = /^[a-zA-Z0-9]{8,50}/ ;

export function validateEmail(text) {
    return regEmail.test(text);
}

export function validatePassword(text) {
    return regPassword.test(text);
}