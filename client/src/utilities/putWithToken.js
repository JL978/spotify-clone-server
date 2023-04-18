import axios from 'axios';

const putWithToken = async (endpoint, access_token, source, data, method = 'PUT') => {
    const cancelToken = source ? source.token : null;
    const options = {
        url: endpoint,
        method,
        headers: {
            'Authorization': 'Bearer ' + access_token,
            'Content-Type': 'application/json',
        },
        data,
        cancelToken,
    };
  
    try {
        const result = await axios(options);
        return result;

    } catch (error) {
        if (axios.isCancel(error)) return;
        throw error;

    }
  };
  
export default putWithToken;