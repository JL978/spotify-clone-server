import axios from 'axios';

const requestWithToken = async (endpoint, access_token, source) => {
    const cancelToken = source ? source.token : null;
    const options = {
        url: endpoint,
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + access_token,
        },
        cancelToken,
    };

    try {
        const result = await axios(options);
        return result;

    } catch (error) {
        if (axios.isCancel(error)) {
            console.log('Request cancelled:', endpoint);

        } else {
            console.error('Error fetching data:', error);
            throw error;
            
        }
    }
};

export default requestWithToken;