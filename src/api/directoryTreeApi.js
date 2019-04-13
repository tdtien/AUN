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
