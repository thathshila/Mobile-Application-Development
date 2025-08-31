

import api from "./config/api"


export const getTasks = async () => {
    const res = await api.get("/tasks")
    return res.data
}

export const addTask = async (task:{
    title:string,
    description?:string
}) => {
    const res = await api.post("/tasks",task)
    return res.data
}