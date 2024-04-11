import axios from "axios";
import {QueryClient} from "@tanstack/react-query";

export const apiClient = axios.create({
    baseURL: "http://192.168.1.136:8080",
    withCredentials: true
})

export const queryClient = new QueryClient()