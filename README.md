# Todoサーバー

このリポジトリは Todo アプリのバックエンドです。API リクエストの処理、ユーザー認証、データベース管理を担当します。


## 技術スタック

・フレームワーク: Express (Node.js)\
・データベース: Prisma (SQLite)\
・認証: AWS Cognito + JWT\
・環境変数管理: dotenv\
・デプロイ: AWS EC2 / Railway / Vercel\


## ディレクトリ構造


```bash
.
├── prisma/  # Prismaの設定
├── src/     # メインのアプリケーションコード
│   ├── config/  # 設定ファイル
│   ├── middleware/  # 認証ミドルウェア
│   ├── routes/  # ルーティング
│   ├── index.ts  # エントリーポイント
├── .env.example  # 環境変数のサンプル
└── README.md
```


## 環境構築手順

## リポジトリのクローン
```bash
git clone https://github.com/ogawatakahisa/server1.git
```


## 依存感関係のインストール

```bash
npm install
```

## 環境変数を設定
.env ファイルを作成し、以下の内容を追加:

```bash
DATABASE_URL="file:./dev.db"
AWS_COGNITO_USER_POOL_ID=your_cognito_user_pool_id
AWS_COGNITO_CLIENT_ID=your_cognito_client_id
```
.env.example を用意し、環境変数のテンプレートを提供しておくと親切。



## データベースのセットアップ


```bash
npx prisma migrate dev --name init
npx prisma generate
```


## サーバーを起動

```bash
npm run dev
```
http://localhost:8080で動作します。


## APIエンドポイント一覧
| メソッド |エンドポイント | 説明 |
| --- | --- | --- |
| GET | /allTodos/:date | 指定した日付のTodoを作成 |
| POST | /createTodo | 新しいTodoを作成 |
| PUT | /editTodo/:id | Todoを更新 |
| DELETE | /deeteTodo/:id | Todoを削除 |


## 認証（AWS Cognito）
このアプリではAWS CognitoによるJWT認証を利用しています。
apiを利用する際は、リクエストのAuthorizationヘッダーにBearer {token}を付与してください。


## 関連リポジトリ

・フロントエンドリポジトリ：[todo-client)](https://github.com/ogawatakahisa/todo-client.git)
