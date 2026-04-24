export interface Department {
	did: number;
	name: string;
	location: string | null;
}

export interface Worker {
	wid: number;
	name: string;
	age: number | null;
	gender: string | null;
	address: string | null;
	email: string | null;
	salary: number | null;
	did: number | null;
}

export interface Project {
	pid: number;
	name: string;
	status: string;
	did: number | null;
}

export interface Participate {
	wid: number;
	pid: number;
	role: string | null;
	work_hour: number | null;
}
