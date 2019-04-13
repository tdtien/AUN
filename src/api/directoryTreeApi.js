const userAPI = 'https://aun-api.herokuapp.com/user';

export async function getAllSars(token) {
    return new Promise((resolve, reject) => {
        fetch(`${userAPI}/sars`, {
            method: 'GET',
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

export async function getAllCriterions(token, sarId) {
    return new Promise((resolve, reject) => {
        fetch(`${userAPI}/sars/${sarId}/criterions`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Charset': 'utf-8',
                'authorization': token
            },
        }).then(response => response.json())
            .then(responseJson => resolve(responseJson))
            .catch(error => reject(error));
    });
}
