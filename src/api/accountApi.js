const loginURL = "https://food-delivery-server.herokuapp.com/login";

export async function requestLogin(email, password) {
    axios.post(loginURL, {email: email, password: password})
    .then(function(response) {
        console.log(response);
    }).catch(function(error) {
        console.log(error);
    })
}
