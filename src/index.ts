import express from "express";
import type { Express, Request, Response } from "express";
import {PrismaClient} from "@prisma/client"
import cors from "cors"

const app: Express = express();
const PORT = 8080;

// ミドルウェアの設定
app.use(express.json()) // json形式でデータを扱う 
app.use(cors()); // corsを許可

const prisma = new PrismaClient();

// GET /allTodos: 全てのtodoアイテムを取得
app.get("/allTodos", async (req: Request, res: Response): Promise<void> => {
    try {
        // Prismaを使用してDBからtodoリストを取得
        const allTodos = await prisma.todo.findMany();
        res.json(allTodos)
    } catch (error) {
        res.status(500).json({ error: "Error fetching Todos" }); // エラー処理
    }
});

// POST /createTodo: 新しいTodo項目を作成
app.post("/createTodo", async(req: Request, res: Response): Promise<void> => {
    try {
        const { title, isCompleted } = req.body;
        
        // 新しいtodo項目を作成
        const createTodos = await prisma.todo.create({
            data: {
                title,
                isCompleted,
            }
        });
        res.json(createTodos)
    } catch (error) {
        res.status(500).json(error);
    }
});
// put /editTodo/:id: 指定されたIDのTodo項目を更新
app.put("/editTodo/:id", async(req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);// URLパラメータからIDを取得
        const { title, isCompleted } = req.body;
        // Todoアイテムを更新
        const editTodo = await prisma.todo.update({
            where: {id},
            data: {
                title,
                isCompleted,
            }
        });
        res.json(editTodo); // 更新したtodoアイテムを返す
    } catch (error) {
        res.status(400).json(error);
    }
});

// DELETE /deleteTodo/:id: 指定されたIDのTodo項目を削除
app.delete("/deleteTodo/:id", async(req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);
        // Todoアイテムを削除
        const deleteTodos = await prisma.todo.delete({
            where: {id},
        });
        res.json(deleteTodos)
    } catch (error) {
        res.status(400).json(error);
    }
});

// サーバを指定したポートで起動
app.listen(PORT, () => console.log("server is runnning"))
