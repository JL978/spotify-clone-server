import axios from 'axios'

export default function makeAxiosRequest(endpoint){
    let source = axios.CancelToken.source()
    
    const makeRequest = async () => {
        const cancelToken = source.token
        const config = {
            method: 'POST',
            url: process.env.REACT_APP_BACK_URI,
            data: {endpoint},
            withCredentials: true,
            cancelToken
        }
        try{
            var result = await axios(config)
            return result.data;

        }catch (error){
            if (axios.isCancel(error)) return
            throw error
        }
        
        // return result.data
    }
    
    return [source, makeRequest]
}

    
    
