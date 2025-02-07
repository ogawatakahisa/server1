import express from "express";
import type { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import { authenticate } from "./middleware/auth.js"; // 認証ミドルウェアを適用

const app: Express = express();
const PORT = 8080;

// ミドルウェアの設定
app.use(express.json()); // リクエストのボディを JSON 形式でパース
app.use(cors({
    // origin: "http://localhost:3000", // フロントエンドのURLを指定（CORS設定）
    // origin: true, // フロントエンドのURLを指定（CORS設定）
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // クッキー・認証情報を含める場合は true に設定
}));

const prisma = new PrismaClient();// DBとの接続を管理（インスタンス作成）
app.use(authenticate);// 認証ミドルウェアを適用（すべてのエンドポイントで認証をチェック）

/**
 * GET /allTodos
 * ユーザーの全ての Todo アイテムを取得する
 */
app.get("/allTodos", async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.body.user.sub; // ユーザーIDを取得
        const allTodos = await prisma.todo.findMany({
            where: { userId }, // ユーザーごとのTodoを取得
        });
        res.json(allTodos);
    } catch (error) {
        res.status(500).json({ error: "Error fetching Todos" });
    }
});

/**
 * POST /createTodo
 * 新しい Todo アイテムを作成する
 */
app.post("/createTodo", async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, isCompleted } = req.body;
        const userId = req.body.user.sub; // ユーザーIDを取得

        const createTodos = await prisma.todo.create({
            data: {
                title,
                isCompleted,
                userId,
            },
        });
        res.json(createTodos);
    } catch (error) {
        res.status(500).json(error);
    }
});

/**
 * PUT /editTodo/:id
 * 指定されたIDの Todo アイテムを更新する
 */
app.put("/editTodo/:id", async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id); // URLパラメータからTodoのIDを取得
        const { title, isCompleted } = req.body;
        const userId = req.body.user.sub; // ユーザーIDを取得

        // Todoアイテムを更新
        const editTodo = await prisma.todo.update({
            where: { id, userId }, // ユーザーごとのデータを更新
            data: {
                title,
                isCompleted,
            },
        });
        res.json(editTodo); // 更新後のTodoを返す
    } catch (error) {
        res.status(400).json(error);
    }
});

/**
 * DELETE /deleteTodo/:id
 * 指定されたIDの Todo アイテムを削除する
 */
app.delete("/deleteTodo/:id", async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id); // URLパラメータからIDを取得
        const userId = req.body.user.sub; // ユーザーIDを取得

        // Todoアイテムを削除
        const deleteTodos = await prisma.todo.delete({
            where: { id, userId }, // ユーザーごとのデータを削除
        });
        res.json(deleteTodos);
    } catch (error) {
        res.status(400).json(error);
    }
});

/**
 * サーバーを指定したポートで起動
 */
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
