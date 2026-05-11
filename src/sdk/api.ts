export interface TodoRes {
	name : string;
	value : number;
	todos : string[];
}

const baseURL = "https://aws.naroah.top/sloth";
const timeout = 30000;

function post<T>(path : string, data : Record<string, string>) : Promise<T> {
	return new Promise((resolve, reject) => {
		uni.request({
			url: `${baseURL}${path}`,
			method: "POST",
			data,
			timeout,
			header: {
				"content-type": "application/json",
			},
			success: (res) => {
				const statusCode = res.statusCode ?? 0;
				statusCode >= 200 && statusCode < 300
					? resolve(res.data as T)
					: reject(new Error(`Request failed with status ${statusCode}`));
			},
			fail: reject,
		});
	});
}

export async function getSuggest(contents : string) : Promise<string[]> {
	return await post<string[]>("/suggest", { contents });
}

export async function getWrit(contents : string) : Promise<string[]> {
	return await post<string[]>("/writ", { contents });
}

export async function getTodo(contents : string) : Promise<TodoRes[]> {
	return await post<TodoRes[]>("/todo", { contents });
}
