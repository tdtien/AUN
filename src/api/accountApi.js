import axios from 'axios';

const userAPI = 'https://aun-api.herokuapp.com/user';
const loginURL = `${userAPI}/login`;
const registerURL = `${userAPI}/register`;

export async function requestLogin(email, password) {
    var info = {
        userName: email,
        passWord: password
    }
    var infoJSON = JSON.stringify(info);
    return new Promise((resolve, reject) => {
        axios.post(loginURL, infoJSON, {headers: {'Content-Type': 'application/json'}})
        .then(res => resolve(res))
        .catch(error => reject(error));
    })
}

export function requestRegister(email, password) {
    return new Promise((resolve, reject) => {
        axios.post(registerURL, {
            email: email,
            password: password
        }).then(response => {
            resolve(response.data);
        }).catch(error => {
            reject(error);
        });
    })
}