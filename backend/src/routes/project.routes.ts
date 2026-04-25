import {Router} from 'express';
import {type Request, type Response} from 'express';
import {query, type QueryResult, toSqlValue} from '../db/opengauss.js';
import {failure, success} from '../types/Result.js';
import {type Project} from '../types/Entity.js';

const projectRouter: Router = Router();

projectRouter.get('/', async (_req: Request, res: Response): Promise<void> => {
    try {
        const result: QueryResult<Project> = await query<Project>('SELECT pid, name, status, did FROM project ORDER BY pid');
        res.json(success(result.rows, '获取项目列表成功'));
    } catch (error) {
        res.status(500).json(failure((error as Error).message, 500));
    }
});

projectRouter.get('/:pid', async (req: Request, res: Response): Promise<void> => {
    try {
        const pid = Number(req.params.pid);
        if (Number.isNaN(pid)) {
            res.status(400).json(failure('pid 必须是数字', 400));
            return;
        }

        const result: QueryResult<Project> = await query<Project>(
            `SELECT pid, name, status, did
             FROM project
             WHERE pid = ${pid} LIMIT 1`
        );

        if (result.rows.length === 0) {
            res.status(404).json(failure('项目不存在', 404));
            return;
        }

        res.json(success(result.rows[0], '获取项目详情成功'));
    } catch (error) {
        res.status(500).json(failure((error as Error).message, 500));
    }
});

projectRouter.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const body = req.body as Project;
        if (!body.pid || !body.name || !body.status) {
            res.status(400).json(failure('pid、name、status 为必填字段', 400));
            return;
        }

        await query(
            `INSERT INTO project (pid, name, status, did)
             VALUES (${body.pid}, ${toSqlValue(body.name)}, ${toSqlValue(body.status)}, ${toSqlValue(body.did)})`
        );

        res.status(201).json(success(body, '创建项目成功', 201));
    } catch (error) {
        res.status(500).json(failure((error as Error).message, 500));
    }
});

projectRouter.put('/:pid', async (req: Request, res: Response): Promise<void> => {
    try {
        const pid = Number(req.params.pid);
        if (Number.isNaN(pid)) {
            res.status(400).json(failure('pid 必须是数字', 400));
            return;
        }

        const {name, status, did} = req.body as Partial<Project>;
        const updates: string[] = [];
        if (name !== undefined) updates.push(`name = ${toSqlValue(name)}`);
        if (status !== undefined) updates.push(`status = ${toSqlValue(status)}`);
        if (did !== undefined) updates.push(`did = ${toSqlValue(did)}`);

        if (updates.length === 0) {
            res.status(400).json(failure('至少提供一个可更新字段', 400));
            return;
        }

        const result: QueryResult<Project> = await query(`UPDATE project
                                                          SET ${updates.join(', ')}
                                                          WHERE pid = ${pid}`);
        if (result.affectedRows === 0) {
            res.status(404).json(failure('项目不存在', 404));
            return;
        }

        res.json(success({pid, ...updates}, '更新项目成功'));
    } catch (error) {
        res.status(500).json(failure((error as Error).message, 500));
    }
});

projectRouter.delete('/:pid', async (req: Request, res: Response): Promise<void> => {
    try {
        const pid = Number(req.params.pid);
        if (Number.isNaN(pid)) {
            res.status(400).json(failure('pid 必须是数字', 400));
            return;
        }

        const result: QueryResult<Project> = await query(`DELETE
                                                          FROM project
                                                          WHERE pid = ${pid}`);
        if (result.affectedRows === 0) {
            res.status(404).json(failure('项目不存在', 404));
            return;
        }

        res.json(success({pid}, '删除项目成功'));
    } catch (error) {
        res.status(500).json(failure((error as Error).message, 500));
    }
});

export default projectRouter;
