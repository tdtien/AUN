// const userAPI = 'http://172.29.64.131:8080/user';
const userAPI = 'http://13.71.85.20:8080/user';

export async function requestLogin(email, password) {
    var info = {
        email: email,
        passWord: password
    }
    return new Promise((resolve, reject) => {
        fetch(`${userAPI}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(info)
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

export async function checkToken(token) {
    return new Promise((resolve, reject) => {
        fetch(`${userAPI}/validatetoken`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': token
            },
        }).then(response => response.json())
            .then(responseJson => resolve(responseJson))
            .catch(error => reject(error));
    });
}

// export function requestRegister(email, password) {
//     return new Promise((resolve, reject) => {
//         axios.post(registerURL, {
//             email: email,
//             password: password
//         }).then(response => {
//             resolve(response.data);
//         }).catch(error => {
//             reject(error);
//         });
//     })
// }

export async function uploadEvidence(token, data) {
    return new Promise((resolve, reject) => {
        fetch(`${userAPI}/evidences`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': token
            },
            body: JSON.stringify(data)
        }).then(response => response.json())
            .then(responseJson => resolve(responseJson))
            .catch(error => reject(error));
    });
}

export async function convert2Pdf(token, data) {
    return new Promise((resolve, reject) => {
        fetch(`${userAPI}/convert2Pdf3`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': token
            },
            body: JSON.stringify(data)
        }).then(response => response.json())
            .then(responseJson => resolve(responseJson))
            .catch(error => reject(error));
    });
}


export async function getAllComments(token, subCriterionId) {
    return new Promise((resolve, reject) => {
        fetch(`${userAPI}/comments/subcriterions/${subCriterionId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': token
            },
        }).then(response => response.json())
            .then(responseJson => resolve(responseJson))
            .catch(error => reject(error));
    });
}

export async function getAllNotes(token, subCriterionId) {
    return new Promise((resolve, reject) => {
        fetch(`${userAPI}/notes/subcriterions/${subCriterionId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': token
            },
        }).then(response => response.json())
            .then(responseJson => resolve(responseJson))
            .catch(error => reject(error));
    });
}

export async function addComment(token, data) {
    return new Promise((resolve, reject) => {
        fetch(`${userAPI}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': token
            },
            body: JSON.stringify(data)
        }).then(response => response.json())
            .then(responseJson => resolve(responseJson))
            .catch(error => reject(error));
    });
}

