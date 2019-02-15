const regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;

export function validateEmail(text) {
    return regEmail.test(text);
}