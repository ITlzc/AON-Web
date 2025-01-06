// 在http.js中引入axios
import axios from 'axios';

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url: string, params?: any) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params,
            headers: {
                Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjU1LCJ1c2VybmVtZSI6ImFpXzkxYzBjODBiIiwicm9sZSI6MSwiZXhwIjoxNzIyNjk3MjQ4LCJpYXQiOjE3MjIwOTI0NDgsImlzcyI6ImFpXzkxYzBjODBiIn0.K9pslLQvwiCQQSREIn7o8nPuwFgTJL5-uLOcYdcTptg'
            }
        }).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(err.data)
        })
    });
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url: string, params?: any, headerParams?: any) {
    return new Promise((resolve, reject) => {
        axios.post(url, JSON.stringify(params), {
            headers: {
                'Content-Type': 'application/json',
                ...headerParams
            }
        })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data)
            })
    });
}

export function postJson(url: string, params: any) {
    return new Promise((resolve, reject) => {
        axios.post(url, params)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data)
            })
    });
}
