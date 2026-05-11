import axios from "axios";
export interface TodoRes {
	name : string;
	value : number;
	todos : string[];
}

const apiClient = axios.create({
	baseURL: "https://aws.naroah.top/sloth",
	timeout: 30000,
});

export async function getSuggest(contents : string) : Promise<string[]> {
	const res = await apiClient.post("/suggest", { contents });
	return res.data;
}

export async function getWrit(contents : string) : Promise<string[]> {
	const res = await apiClient.post("/writ", { contents });
	return res.data;
}

export async function getTodo(contents : string) : Promise<TodoRes[]> {
	const res = await apiClient.post("/todo", { contents });
	return res.data;
}