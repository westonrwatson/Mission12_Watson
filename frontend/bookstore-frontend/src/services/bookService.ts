// Weston Watson, Team 3, Section

import axios from "axios";
import { Book } from "../models/Book";

const API_URL = "http://localhost:5085/api/books";

export const getBooks = async (page: number, pageSize: number, sortBy: string) => {
    const response = await axios.get(`${API_URL}?page=${page}&pageSize=${pageSize}&sortBy=${sortBy}`);
    return response.data;
};
