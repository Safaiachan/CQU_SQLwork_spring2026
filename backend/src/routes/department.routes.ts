import {Router} from 'express';
import {type Request, type Response} from 'express';
import {query, type QueryResult, toSqlValue} from '../db/opengauss.js';
import {failure, success} from '../types/Result.js';
import {type Department} from '../types/Entity.js';

const departmentRouter: Router = Router();

departmentRouter.get('/', async (_req: Request, res: Response): Promise<void> => {
    try {
        const result: QueryResult<Department> = await query<Department>('SELECT did, name, location FROM department ORDER BY did');
        res.json(success(result.rows, '获取部门列表成功'));
    } catch (error) {
        res.status(500).json(failure((error as Error).message, 500));
    }
});

departmentRouter.get('/:did', async (req: Request, res: Response): Promise<void> => {
    try {
        const did = Number(req.params.did);
        if (Number.isNaN(did)) {
            res.status(400).json(failure('did 必须是数字', 400));
            return;
        }

        const result: QueryResult<Department> = await query<Department>(
            `SELECT did, name, location
             FROM department
             WHERE did = ${did} LIMIT 1`
        );

        if (result.rows.length === 0) {
            res.status(404).json(failure('部门不存在', 404));
            return;
        }

        res.json(success(result.rows[0], '获取部门详情成功'));
    } catch (error) {
        res.status(500).json(failure((error as Error).message, 500));
    }
});

departmentRouter.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const {did, name, location} = req.body as Department;
        if (!name) {
            res.status(400).json(failure('did 和 name 为必填字段', 400));
            return;
        }

        await query(
            `INSERT INTO department (did, name, location)
             VALUES (${did}, ${toSqlValue(name)}, ${toSqlValue(location ?? null)})`
        );

        res.status(201).json(success({did, name, location: location ?? null}, '创建部门成功', 201));
    } catch (error) {
        res.status(500).json(failure((error as Error).message, 500));
    }
});

departmentRouter.put('/:did', async (req: Request, res: Response): Promise<void> => {
    try {
        const did = Number(req.params.did);
        const {name, location} = req.body as Partial<Department>;

        if (Number.isNaN(did)) {
            res.status(400).json(failure('did 必须是数字', 400));
            return;
        }

        if (name === undefined && location === undefined) {
            res.status(400).json(failure('至少提供一个可更新字段', 400));
            return;
        }

        const updates: string[] = [];
        if (name !== undefined) {
            updates.push(`name = ${toSqlValue(name)}`);
        }
        if (location !== undefined) {
            updates.push(`location = ${toSqlValue(location)}`);
        }

        const result: QueryResult<Department> = await query(
            `UPDATE department
             SET ${updates.join(', ')}
             WHERE did = ${did}`
        );

        if (result.affectedRows === 0) {
            res.status(404).json(failure('部门不存在', 404));
            return;
        }

        res.json(success({did, ...updates}, '更新部门成功'));
    } catch (error) {
        res.status(500).json(failure((error as Error).message, 500));
    }
});

departmentRouter.delete('/:did', async (req: Request, res: Response): Promise<void> => {
    try {
        const did = Number(req.params.did);
        if (Number.isNaN(did)) {
            res.status(400).json(failure('did 必须是数字', 400));
            return;
        }

        const result: QueryResult<Department> = await query(`DELETE
                                                             FROM department
                                                             WHERE did = ${did}`);
        if (result.affectedRows === 0) {
            res.status(404).json(failure('部门不存在', 404));
            return;
        }

        res.json(success({did}, '删除部门成功'));
    } catch (error) {
        res.status(500).json(failure((error as Error).message, 500));
    }
});

export default departmentRouter;
