import cors from 'cors';
import express, {type Express, type Request, type Response} from 'express';
import apiRouter from './routes/index.js';
import {failure, success} from './types/Result.js';

const app: Express = express();
const PORT: number = 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api', apiRouter);

app.get('/health', (_req: Request, res: Response): void => {
    res.json(success({timestamp: new Date().toISOString()}, '服务健康'));
});

app.use((_req: Request, res: Response): void => {
    res.status(404).json(failure('路由不存在', 404));
});

app.use((err: Error, _req: Request, res: Response): void => {
    console.error(err);
    res.status(500).json(failure('服务器内部错误', 500));
});

app.listen(PORT, (): void => {
    console.log(`后端服务已启动在 http://localhost:${PORT}`);
});
