import {Router} from 'express';
import {type Request, type Response} from 'express';
import {query, type QueryResult, toSqlValue} from '../db/opengauss.js';
import {failure, success} from '../types/Result.js';
import {type Worker} from '../types/Entity.js';

const workerRouter: Router = Router();

workerRouter.get('/', async (_req: Request, res: Response): Promise<void> => {
    try {
        const result: QueryResult<Worker> = await query<Worker>(
            'SELECT wid, name, age, gender, address, email, salary, did FROM worker ORDER BY wid'
        );
        res.json(success(result.rows, '获取员工列表成功'));
    } catch (error) {
        res.status(500).json(failure((error as Error).message, 500));
    }
});

workerRouter.get('/:wid', async (req: Request, res: Response): Promise<void> => {
    try {
        const wid = Number(req.params.wid);
        if (Number.isNaN(wid)) {
            res.status(400).json(failure('wid 必须是数字', 400));
            return;
        }

        const result = await query<Worker>(
            `SELECT wid,
                    name,
                    age,
                    gender,
                    address,
                    email,
                    salary,
                    did
             FROM worker
             WHERE wid = ${wid} LIMIT 1`
        );

        if (result.rows.length === 0) {
            res.status(404).json(failure('员工不存在', 404));
            return;
        }

        res.json(success(result.rows[0], '获取员工详情成功'));
    } catch (error) {
        res.status(500).json(failure((error as Error).message, 500));
    }
});

workerRouter.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const body = req.body as Worker;
        if (!body.name) {
            res.status(400).json(failure('wid 和 name 为必填字段', 400));
            return;
        }

        await query(
            `INSERT INTO worker (wid, name, age, gender, address, email, salary, did)
             VALUES (${body.wid}, ${toSqlValue(body.name)}, ${toSqlValue(body.age)}, ${toSqlValue(body.gender)},
                     ${toSqlValue(body.address)}, ${toSqlValue(body.email)}, ${toSqlValue(body.salary)},
                     ${toSqlValue(body.did)})`
        );

        res.status(201).json(success(body, '创建员工成功', 201));
    } catch (error) {
        res.status(500).json(failure((error as Error).message, 500));
    }
});

workerRouter.put('/:wid', async (req: Request, res: Response): Promise<void> => {
    try {
        const wid = Number(req.params.wid);
        if (Number.isNaN(wid)) {
            res.status(400).json(failure('wid 必须是数字', 400));
            return;
        }

        const {name, age, gender, address, email, salary, did} = req.body as Partial<Worker>;
        const updates: string[] = [];
        if (name !== undefined) updates.push(`name = ${toSqlValue(name)}`);
        if (age !== undefined) updates.push(`age = ${toSqlValue(age)}`);
        if (gender !== undefined) updates.push(`gender = ${toSqlValue(gender)}`);
        if (address !== undefined) updates.push(`address = ${toSqlValue(address)}`);
        if (email !== undefined) updates.push(`email = ${toSqlValue(email)}`);
        if (salary !== undefined) updates.push(`salary = ${toSqlValue(salary)}`);
        if (did !== undefined) updates.push(`did = ${toSqlValue(did)}`);

        if (updates.length === 0) {
            res.status(400).json(failure('至少提供一个可更新字段', 400));
            return;
        }

        const result: QueryResult<Worker> = await query(`UPDATE worker
                                                         SET ${updates.join(', ')}
                                                         WHERE wid = ${wid}`);
        if (result.affectedRows === 0) {
            res.status(404).json(failure('员工不存在', 404));
            return;
        }

        res.json(success({wid, ...updates}, '更新员工成功'));
    } catch (error) {
        res.status(500).json(failure((error as Error).message, 500));
    }
});

workerRouter.delete('/:wid', async (req: Request, res: Response): Promise<void> => {
    try {
        const wid = Number(req.params.wid);
        if (Number.isNaN(wid)) {
            res.status(400).json(failure('wid 必须是数字', 400));
            return;
        }

        const result: QueryResult<Worker> = await query(`DELETE
                                                         FROM worker
                                                         WHERE wid = ${wid}`);
        if (result.affectedRows === 0) {
            res.status(404).json(failure('员工不存在', 404));
            return;
        }

        res.json(success({wid}, '删除员工成功'));
    } catch (error) {
        res.status(500).json(failure((error as Error).message, 500));
    }
});

export default workerRouter;
