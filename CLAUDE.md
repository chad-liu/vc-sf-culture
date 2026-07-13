# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## 專案簡介

「三花文化館盃學生導覽競賽」報名管理網站。單一登入角色：
- **學校承辦人**：以學校代碼登入，管理該校參賽學生

架構比照 D:\VC-SF-Story（同一套 Next.js + Supabase 技術棧），共用該專案的 Supabase 後端（`sf_news`、`city` 為共用表），新增 `sf_cul_school`、`sf_cul_student` 兩張表。

## 常用指令

```bash
npm run dev      # 開發伺服器（http://localhost:3000）
npm run build    # 正式建置
npm run lint     # ESLint 檢查
npx tsc --noEmit # TypeScript 型別檢查（無測試框架，用這個驗證）
```

## 環境變數（.env.local）

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # API routes 用此繞過 RLS
SESSION_SECRET=              # iron-session 加密金鑰（32+ 字元，與 VC-SF-Story 分開）
```

**API routes 一律透過 `supabase` client（service role key）存取**，不要另建 anon key client。

## 架構

### 認證流程
`src/lib/session.ts` 定義 `SessionData` 介面與 `getSession()` helper（iron-session v8，async cookie API，cookie 名稱 `culture-session`）。所有 API routes 呼叫 `getSession()` 驗證登入狀態。

### 資料庫
- `city`：縣市代碼（共用表，唯讀）
- `sf_news`：注意事項（共用表，`news_for = '文化館盃'` 過濾）
- `sf_cul_school`：學校承辦人申請帳號
- `sf_cul_student`：參賽學生，`stu_no` 格式為 `{school_no}-{02序號}`

### 學校代碼查詢
不同於 VC-SF-Story，本專案沒有內部學校參考表可查詢。註冊頁的「代碼查詢」只是開啟新視窗連結到 https://iss.ntus.edu.tw/open/school 供人工查詢，所有學校欄位皆為手動輸入。

### 學生編號邏輯
`src/app/api/students/route.ts` POST：查出同 `school_no` 前綴最大序號後 +1，格式 `074658-01`。新增學生表單僅有 stuname、teaname、youtube 三個欄位；`cul_year`、`school_no` 由 session 帶入，不於畫面顯示。`is_final`（入決賽）由後台另行設定，畫面僅唯讀顯示。

### 登入識別
`sf_cul_school.school_no` + `password`（密碼預設為承辦人手機號碼，可於資料編輯修改）。

### Dashboard
`src/app/dashboard/page.tsx`（Server Component）讀取 session 後傳 props 給 `DashboardClient.tsx`（Client Component），內含三個 Tab：注意事項、資料編輯、參賽學生。

## 資料庫 Schema

見 `supabase/schema.sql`。
