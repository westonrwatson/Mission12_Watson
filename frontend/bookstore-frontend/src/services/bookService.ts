// Weston Watson, Team 3, Section

import axios from "axios";

const API_URL = "http://localhost:5085/api/books";

export const getBooks = async (
    page: number,
    pageSize: number,
    sortBy: string,
    categories: string[] = []
  ) => {
    const categoryParam = categories.length ? `&categories=${categories.join(',')}` : '';
    const response = await axios.get(`${API_URL}?page=${page}&pageSize=${pageSize}&sortBy=${sortBy}${categoryParam}`);
    return response.data;
  };