import axios from 'axios';

const apiServer = 'https://food-delivery-server.herokuapp.com';
const loginURL = `${apiServer}/login`;
const registerURL = `${apiServer}/register`;

export async function requestLogin(email, password) {
    axios.post(loginURL, {email: email, password: password})
    .then(function(response) {
        console.log(response);
    }).catch(function(error) {
        console.log(error);
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