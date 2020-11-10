import md5 from "md5";

const attempts = {};
const numAttempts = 2;

const retry = function (axios, error) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const key = md5(JSON.stringify(error.config));
            attempts[key] = attempts[key] || 0;
            attempts[key]++;
            if (attempts[key] <= numAttempts) {
                resolve(axios.request(error.config));
            } else {
                reject(error);
            }
        }, 10000);
    });
}

export default function(axios) {
    axios.interceptors.response.use(null, (error) => {
        if (error.config) {
            return retry(axios, error);
        }
        return Promise.reject(error);
    });
}