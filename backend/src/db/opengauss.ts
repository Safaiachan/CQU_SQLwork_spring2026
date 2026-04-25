import OpenGauss from 'node-opengauss';

export interface QueryResult<T> {
    rows: T[];
    affectedRows: number;
}

const DB_CONFIG = {
    host: '127.0.0.1',
    port: 5432,
    username: 'omm',
    database: 'postgres',
    password: '123456',
};

const CONNECT_TIMEOUT_MS = Number(10000);

const og = new OpenGauss();
let client: any = null;
let connecting: Promise<void> | null = null;

const ensureConnected = async (): Promise<void> => {
    if (client) {
        return;
    }

    if (!connecting) {
        connecting = (async (): Promise<void> => {
            client = new og.Client(DB_CONFIG);
            await Promise.race([
                client.connect(),
                new Promise((_, reject): void => {
                    setTimeout((): void => reject(new Error(`数据库连接超时（${CONNECT_TIMEOUT_MS}ms）`)), CONNECT_TIMEOUT_MS);
                }),
            ]);
        })();
    }

    try {
        await connecting;
    } catch (error) {
        client = null;
        connecting = null;
        throw error;
    }
};

export const query = async <T = unknown>(sql: string): Promise<QueryResult<T>> => {
    await ensureConnected();

    return new Promise<QueryResult<T>>((resolve, reject): void => {
        client.query(sql, (err: Error | null, result: { rows?: T[]; rowCount?: number }): void => {
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
