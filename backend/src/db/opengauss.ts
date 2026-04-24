import OpenGauss from 'node-opengauss';

export interface QueryResult<T> {
	rows: T[];
	affectedRows: number;
}

const DB_CONFIG = {
	host:  '127.0.0.1',
	port: 5432,
	username: 'omm',
	database: 'postgres',
	password: '123456',
};

const og = new OpenGauss();
let client: any = null;
let connecting: Promise<void> | null = null;

const ensureConnected = async (): Promise<void> => {
	if (client) {
		return;
	}

	if (!connecting) {
		connecting = (async () => {
			client = new og.Client(DB_CONFIG);
			await client.connect();
		})();
	}

	await connecting;
};

export const query = async <T = unknown>(sql: string): Promise<QueryResult<T>> => {
	await ensureConnected();

	return new Promise<QueryResult<T>>((resolve, reject) => {
		client.query(sql, (err: Error | null, result: { rows?: T[]; rowCount?: number }) => {
			if (err) {
				reject(err);
				return;
			}

			resolve({
				rows: result?.rows ?? [],
				affectedRows: result?.rowCount ?? 0,
			});
		});
	});
};

export const toSqlValue = (value: unknown): string => {
	if (value === null || value === undefined) {
		return 'NULL';
	}

	if (typeof value === 'number') {
		if (Number.isNaN(value)) {
			throw new Error('数值字段不能为 NaN');
		}
		return String(value);
	}

	if (typeof value === 'boolean') {
		return value ? 'TRUE' : 'FALSE';
	}

	const escaped = String(value).replace(/'/g, "''");
	return `'${escaped}'`;
};
