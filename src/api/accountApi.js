const userAPI = 'https://aun-api.herokuapp.com/user';
const loginURL = `${userAPI}/login`;
const registerURL = `${userAPI}/register`;

export async function requestLogin(email, password) {
    var info = {
        email: email,
        passWord: password
    }
    var infoJSON = JSON.stringify(info);
    return new Promise((resolve, reject) => {
        fetch('https://aun-api.herokuapp.com/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: infoJSON
        })
            .then(response => response.json())
            .then((responseJson) => {
                resolve(responseJson);
            })
            .catch((error) => {
                reject(error);
            })
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