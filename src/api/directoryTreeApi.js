// const userAPI = 'http://172.29.64.131:8080/user';
const userAPI = 'http://13.71.85.20:8080/user';

export async function getDataSar(token, type = '', id = 0) {
    switch (type) {
        case 'sars': return getAllSars(token)
        case 'sarVersions': return getAllSarVersions(token, id)
        case 'criterions': return getAllCriterions(token, id)
        case 'subCriterions': return getAllSubCriterions(token, id)
        case 'suggestionTypes':
        case 'suggestions': return getAllSuggestions(token, id)
        case 'evidences': return getAllEvidences(token, id)
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

export async function getAllSarVersions(token, id) {
    return new Promise((resolve, reject) => {
        fetch(`${userAPI}/sars/${id}/versions`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': token
            },
        }).then(response => response.json())
            .then(responseJson => resolve(responseJson))
            .catch(error => reject(error));
    })
}

export async function getAllAvailableSar(token) {
    return new Promise((resolve, reject) => {
        fetch(`${userAPI}/reviewer/sars`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': token
            },
        }).then(response => response.json())
            .then(responseJson => resolve(responseJson))
            .catch(error => reject(error));
    })
}

export async function getAllVersionSar(token, id) {
    return new Promise((resolve, reject) => {
        fetch(`${userAPI}/reviewer/sars/${id}/versions`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': token
            },
        }).then(response => response.json())
            .then(responseJson => resolve(responseJson))
            .catch(error => reject(error));
    })
}

export async function getContentSar(token, id, ver) {
    return new Promise((resolve, reject) => {
        fetch(`${userAPI}/reviewer/sars/${id}/versions/${ver}/content`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': token
            },
        }).then(response => response.json())
            .then(responseJson => resolve(responseJson))
            .catch(error => reject(error));
    })
}

export async function getAllCriterions(token, reversionId) {
    return new Promise((resolve, reject) => {
        fetch(`${userAPI}/sars/versions/${reversionId}/criterions`, {
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
        fetch(`${userAPI}/criterions/${subcriterionId}/suggestions`, {
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
        case 'sarVersion': return downloadSarVersion(token, id)
        case 'criterion': return downloadCriterion(token, id)
        case 'subCriterion': return downloadSubCriterion(token, id)
        case 'suggestion': return downloadSuggestion(token, id)
        default: return new Promise();
    }
}

export async function downloadSarVersion(token, sarId, versionId) {
    return new Promise((resolve, reject) => {
        fetch(`${userAPI}/sars/${sarId}/versions/${versionId}`, {
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