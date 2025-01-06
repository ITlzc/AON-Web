import { get, post } from './request'

// list
export const getModels = (data: any) => post('/admin/api/task/models', data)
export const getCategorys = () => get(`/admin/api/task/allcategorys`)

export const getApiKeys = () => get(`/admin/api/app/apikeysfront`)
export const getModelById = (data: any) => post(`/admin/api/task/modelbyid`, data)

export const collect = (type:string, data: any) => post(`/admin/api/favorite/${type}`, data)


