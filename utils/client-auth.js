const qs = require('querystring')
const axios = require('axios')

const client_auth = (client_id, client_secret)=>{
    return new Promise((res, rej) =>{
        const config = {
            headers: {
                'Content-Type':'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
            }
        }
    
        const authOptions = {
            grant_type: 'client_credentials'
        }

        axios.post('https://accounts.spotify.com/api/token', qs.stringify(authOptions), config)
            .then((response) => res(response.data.access_token))
            .catch((error) => rej(error))
    })
}

const authed_header = (token) => ({
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": 'Bearer ' + token
    }
})

module.exports = {client_auth, authed_header}