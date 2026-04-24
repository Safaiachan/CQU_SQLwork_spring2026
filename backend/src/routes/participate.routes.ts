import {Router} from 'express';
import {type Request, type Response} from 'express';
import {query, type QueryResult, toSqlValue} from '../db/opengauss.js';
import {failure, success} from '../types/Result.js';
import {type Participate} from '../types/Entity.js';

const participateRouter: Router = Router();

participateRouter.get('/', async (_req: Request, res: Response): Promise<void> => {
    try {
        const result: QueryResult<Participate> = await query<Participate>('SELECT wid, pid, role, work_hour FROM participate ORDER BY wid, pid');
        res.json(success(result.rows, '获取参与关系列表成功'));
    } catch (error) {
        res.status(500).json(failure((error as Error).message, 500));
    }
});

participateRouter.get('/:wid/:pid', async (req: Request, res: Response): Promise<void> => {
    try {
        const wid = Number(req.params.wid);
        const pid = Number(req.params.pid);
        if (Number.isNaN(wid) || Number.isNaN(pid)) {
            res.status(400).json(failure('wid 和 pid 必须是数字', 400));
            return;
        }

        const result: QueryResult<Participate> = await query<Participate>(
            `SELECT wid, pid, role, work_hour
             FROM participate
             WHERE wid = ${wid}
               AND pid = ${pid} LIMIT 1`
        );

        if (result.rows.length === 0) {
            res.status(404).json(failure('参与关系不存在', 404));
            return;
        }

        res.json(success(result.rows[0], '获取参与关系详情成功'));
    } catch (error) {
        res.status(500).json(failure((error as Error).message, 500));
    }
});

participateRouter.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const body = req.body as Participate;

        await query(
            `INSERT INTO participate (wid, pid, role, work_hour)
             VALUES (${body.wid}, ${body.pid}, ${toSqlValue(body.role)}, ${toSqlValue(body.work_hour)})`
        );

        res.status(201).json(success(body, '创建参与关系成功', 201));
    } catch (error) {
        res.status(500).json(failure((error as Error).message, 500));
    }
});

participateRouter.put('/:wid/:pid', async (req: Request, res: Response): Promise<void> => {
    try {
        const wid = Number(req.params.wid);
        const pid = Number(req.params.pid);
        if (Number.isNaN(wid) || Number.isNaN(pid)) {
            res.status(400).json(failure('wid 和 pid 必须是数字', 400));
            return;
        }

        const {role, work_hour} = req.body as Partial<Participate>;
        const updates: string[] = [];
        if (role !== undefined) updates.push(`role = ${toSqlValue(role)}`);
        if (work_hour !== undefined) updates.push(`work_hour = ${toSqlValue(work_hour)}`);

        if (updates.length === 0) {
            res.status(400).json(failure('至少提供一个可更新字段', 400));
            return;
        }

        const result: QueryResult<Participate> = await query(
            `UPDATE participate
             SET ${updates.join(', ')}
             WHERE wid = ${wid}
               AND pid = ${pid}`
        );

        if (result.affectedRows === 0) {
            res.status(404).json(failure('参与关系不存在', 404));
            return;
        }

        res.json(success({wid, pid, ...updates}, '更新参与关系成功'));
    } catch (error) {
        res.status(500).json(failure((error as Error).message, 500));
    }
});

participateRouter.delete('/:wid/:pid', async (req: Request, res: Response): Promise<void> => {
    try {
        const wid = Number(req.params.wid);
        const pid = Number(req.params.pid);
        if (Number.isNaN(wid) || Number.isNaN(pid)) {
            res.status(400).json(failure('wid 和 pid 必须是数字', 400));
            return;
        }

        const result: QueryResult<Participate> = await query(`DELETE
                                                              FROM participate
                                                              WHERE wid = ${wid}
                                                                AND pid = ${pid}`);
        if (result.affectedRows === 0) {
            res.status(404).json(failure('参与关系不存在', 404));
            return;
        }

        res.json(success({wid, pid}, '删除参与关系成功'));
    } catch (error) {
        res.status(500).json(failure((error as Error).message, 500));
    }
});

export default participateRouter;
