export interface Result<T = unknown> {
	code: number;
	message: string;
	data: T | null;
}

export const success = <T>(data: T, message: string = 'success', code: number = 200): Result<T> => {
	return {
		code,
		message,
		data,
	};
};

export const failure = (message: string = 'error', code: number = 500): Result<null> => {
	return {
		code,
		message,
		data: null,
	};
};
