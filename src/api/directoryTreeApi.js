// const userAPI = 'http://172.29.64.131:8080/user';
const userAPI = 'https://aun-app.azurewebsites.net/user';

export async function getDataSar(token, type = '', id = 0) {
    switch (type) {
        case 'sar': return getAllSars(token)
        case 'criterion': return getAllCriterions(token, id)
        case 'subCriterion': return getAllSubCriterions(token, id)
        case 'suggestionType': 
        case 'suggestion': return getAllSuggestions(token, id)
        case 'evidence': return getAllEvidences(token, id)
        default: return Promise.resolve({});
    }
}

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

export async function downloadDataSar(token, id = 0, type = '') {
    switch (type) {
        case 'sar': return downloadSar(token, id)
        case 'criterion': return downloadCriterion(token, id)
        case 'subCriterion': return downloadSubCriterion(token, id)
        case 'suggestion': return downloadSuggestion(token, id)
        default: return new Promise();
    }
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

export async function downloadCriterion(token, criterionId) {
    return new Promise((resolve, reject) => {
        fetch(`${userAPI}/criterions/${criterionId}`, {
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

export async function downloadSubCriterion(token, subCriterionId) {
    return new Promise((resolve, reject) => {
        fetch(`${userAPI}/subcriterions/${subCriterionId}`, {
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

export async function downloadSuggestion(token, suggestionId) {
    return new Promise((resolve, reject) => {
        fetch(`${userAPI}/suggestions/${suggestionId}`, {
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