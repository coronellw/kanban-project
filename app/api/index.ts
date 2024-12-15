import axios from "axios"

export const kanbanApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})
