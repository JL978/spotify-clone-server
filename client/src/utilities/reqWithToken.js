import axios from 'axios';

const reqWithToken = (endpoint, access_token, cancelSource) =>{
    const request = async () => {
        const cancelToken = cancelSource ? cancelSource.token : null;
        const options = {
            url: endpoint,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + access_token 
            },
            cancelToken
        };
        let result
        try {
            result = await axios(options)
            console.log(result)
            return result.data; // maybe we wanna do result.data

        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Request cancelled:', endpoint);

              } else {
                console.error('Error fetching data:', error); // log a more specific error message
                throw error; // re-throw the error to be caught by Promise.catch()

              }
        }
    }
    
    return request;
}

export default reqWithToken;