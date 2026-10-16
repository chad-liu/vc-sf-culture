# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## 專案簡介

「三花文化館盃學生導覽競賽」報名管理網站。單一登入角色：
- **學校承辦人**：以學校代碼登入，管理該校參賽學生

架構比照 D:\VC-SF-Story（同一套 Next.js + Supabase 技術棧），共用該專案的 Supabase 後端（`city`、`sf_news`、`sf_reference` 為共用表），新增 `sf_cul_school`、`sf_cul_student` 兩張表。專案已連結 GitHub（`chad-liu/vc-sf-culture`）與 Vercel，push 到 `main` 會自動觸發 production 部署。

## 常用指令

```bash
npm run dev      # 開發伺服器（預設 http://localhost:3000，若被佔用會改用 3001）
npm run build    # 正式建置（同時會跑 TypeScript 檢查）
npm run lint     # ESLint 檢查
npx tsc --noEmit # TypeScript 型別檢查（無測試框架，用這個 + build 驗證）
```

無測試框架；每次修改後至少跑 `npx tsc --noEmit` 和 `npm run build` 確認無誤。

## 環境變數（.env.local，不進版控）

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # API routes 用此繞過 RLS
SESSION_SECRET=              # iron-session 加密金鑰（32+ 字元，與 VC-SF-Story 分開）
```

**API routes 一律透過 `src/lib/supabase.ts` 的 `supabase` client（service role key）存取**，不要另建 anon key client。同一組變數也已設定在 Vercel 專案的 Production / Preview / Development 三個環境（`vercel env ls` 可查）。

## 架構

### 認證流程
`src/lib/session.ts` 定義 `SessionData` 介面與 `getSession()` helper（iron-session v8，async cookie API，cookie 名稱 `culture-session`）。所有需要登入的 API routes 開頭都呼叫 `getSession()`，`isLoggedIn` 為 false 時回傳 401。`src/app/dashboard/page.tsx`（Server Component）用同一個 helper 做頁面層級的登入檢查，未登入導回 `/`。

### 資料庫欄位命名 — 重要陷阱
`sf_cul_school`、`sf_cul_student` 兩張表是使用者手動在 Supabase 建立的，**欄位命名沒有底線**（例如 `schoolno`、`schoolfull`、`contitle`、`conemail`、`conmobile`、`stuno`、`stuname`、`teaname`、`culyear`、`isfinal`），這點跟參考專案 VC-SF-Story（用 `school_no`、`con_email` 這種底線命名）不一樣。新增/修改任何 Supabase 查詢時，直接看 `supabase/schema.sql`（已同步反映實際線上結構）確認欄位名稱，不要憑 VC-SF-Story 的習慣去猜。

- `city`：縣市代碼（共用表，唯讀，依 `no` 排序）
- `sf_news`：注意事項（共用表，`news_for = '文化館盃'` 且 `valid = true` 過濾，依 `sort` 升冪排序）
- `sf_reference`：共用參數設定（共用表，`name` / `value` / `remark`），本專案只讀 `name = '文化館盃-承辦人輸入'` 這筆，見下方「學生資料編修開關」
- `sf_cul_school`：學校承辦人申請帳號，另有 `tel`（學校電話）、`remark` 欄位目前未用於畫面
- `sf_cul_student`：參賽學生，`stuno` 格式為 `{schoolno}-{02序號}`；另有 `isfinal`、`prize` 兩欄由後台/其他流程管理，不在本站的新增/編輯表單中出現

### 學校代碼查詢
不同於 VC-SF-Story，本專案沒有內部學校參考表可查詢。註冊頁（`src/app/register/school/page.tsx`）的「代碼查詢」只是開新視窗連到 https://iss.ntus.edu.tw/open/school 供人工查詢，所有學校欄位皆為手動輸入，送出時只在 `sf_cul_school` 內做同年度同代碼是否已申請過的檢查（`src/app/api/register/school/route.ts`）。

### 學生編號邏輯
`src/app/api/students/route.ts` POST：查出同 `schoolno` 前綴中最大序號後 +1，格式如 `074658-01`。新增/編輯學生表單只有 stuname、teaname、youtube 三個欄位（`src/components/StudentFormModal.tsx`）；`culyear`、`schoolno` 由 session 帶入寫入，畫面不顯示也不可編輯。`src/components/StudentTable.tsx` 的 grid 只顯示 stuno / stuname / teaname / youtube 與影片測試連結，不顯示 isfinal。

### 學生資料編修開關
`src/lib/supabase.ts` 的 `canEditStudents()` 讀 `sf_reference` 中 `name = '文化館盃-承辦人輸入'` 的 `value`，**嚴格等於「是」才回傳 true**（查無資料或其他值一律視為關閉）。用途是初選截止後由主辦方在 Supabase 直接改成「否」，不需重新部署。
- **後端**：`POST /api/students`、`PUT`/`DELETE /api/students/[id]` 開頭檢查，關閉時回 403。GET 不受影響，承辦人仍可查看清單。
- **畫面**：`src/app/dashboard/page.tsx`（Server Component，每次請求動態渲染）讀取後以 `canEdit` prop 經 `DashboardClient` 傳給 `StudentTable`，關閉時隱藏「新增參賽學生」按鈕與整個「操作」欄。畫面值只在頁面載入時讀取，切換設定後需重新整理才會反映，但後端會即時擋下。

### 登入識別
`sf_cul_school.schoolno` + `password`（密碼預設為承辦人手機號碼，登入後可在「資料編輯」修改）。

### Dashboard
`src/app/dashboard/page.tsx` 讀取 session 後傳 props 給 `DashboardClient.tsx`（Client Component），內含三個 Tab：注意事項、學校資料、參賽學生。

### 學校資料編輯的唯讀/編輯切換
`src/components/SchoolEditForm.tsx` 預設唯讀顯示（灰底、select disabled），按「修改」才切換成可編輯狀態；編輯模式下同時顯示綠底「儲存」與橘底「取消」——儲存成功或取消都會切回唯讀模式，取消會把表單還原成 `savedForm`（上次載入/儲存時的資料），不送出任何變更。`schoolNo` 欄位永遠唯讀。

## 資料庫 Schema

見 `supabase/schema.sql`（反映實際已在 Supabase 建立的結構，非自動套用的 migration；異動資料表需自行到 Supabase SQL Editor 執行）。
