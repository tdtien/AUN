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
                'authorization': token
            },
        }).then(response => response.json())
            .then(responseJson => resolve(responseJson))
            .catch(error => reject(error));
    });
}

export async function getAllSubCriterions(token, criterionId) {
    return new Promise((resolve, reject) => {
        fetch(`${userAPI}/criterions/${criterionId}/subcriterions`, {
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

export async function getAllSuggestions(token, subcriterionId) {
    return new Promise((resolve, reject) => {
        fetch(`${userAPI}/subcriterions/${subcriterionId}/suggestions2`, {
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

export async function getAllEvidences(token, suggestionId) {
    return new Promise((resolve, reject) => {
        fetch(`${userAPI}/suggestions/${suggestionId}/evidences`, {
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

export async function downloadSar(token, sarId) {
    return new Promise((resolve, reject) => {
        fetch(`${userAPI}/sars/${sarId}`, {
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