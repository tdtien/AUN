const regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ ;
const regPassword = /^[a-zA-Z0-9]{8,50}/ ;
const regFileName = /^[a-zA-Z0-9_]{1,50}/;

export function validateEmail(text) {
    return regEmail.test(text);
}

export function validatePassword(text) {
    return regPassword.test(text);
}

export function validateFileName(text) {
    return regFileName.test(text);
}