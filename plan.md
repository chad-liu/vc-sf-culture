## 製作「三花文化館盃學生導覽競賽」網站
參考 D:\VC-SF-Story 網站的功能 
### 技術棧
1. 前端：Next.js (React)
2. 後端：Next.js API Routes（內建，不需另外寫後端）
3. 資料庫：Supabase (PostgreSQL)，table sf_cul_school、sf_cul_student
4. 版本控制：GitHub
5. 部署：Vercel（前端）+ Supabase（後端/DB）
### 功能
1. 帳號申請
  1.1 學校代碼和密碼符合，即完成登入
  1.2 學校承辦人申請: placeholder都是必填，全部齊全才可存檔
      輸入學校代碼(schoolno) ，旁邊有"代碼查詢"，連結到新視窗https://iss.ntus.edu.tw/open/school
      學校全稱(schoolfull)
      學校簡稱(school)
      職業類科(Vocational)，下拉表(高級職業學校/高級中學附設職業類科/綜合高中開設專門學程/高職進修學校/五專前三年)
      縣市(city) : 下拉 city.city
      學校地址(address)：
      承辦人姓名(contract)
      承辦人職稱(contitle)
      承辦人手機(conmobile) placeholder 必填，為預設密碼
      承辦人Email(conemil)
      密碼不必輸入，存檔時同conmobile
  
2. 帳號登入後有三個tag 注意事項/資料編輯/參賽學生
  2.1 注意事項，比照D:\VC-SF-Story ，但 sf_news(news_for='文化館盃')
  2.2  資料編輯，比照D:\VC-SF-Story ，table 為 sf_cul_school
  3.3 參賽學生，table 為 sf_cul_student
      新增時將culyear、schoolno 由sf_cul_school帶入，grid不必顯示
               學生編號 stuno為{schoolno}-01(流水號)、學生姓名stuname、指導老師 teaname、youtube
      grid ->  學生編號 stuno為{schoolno}-01(流水號)、學生姓名stuname、指導老師 teaname、youtube、入決賽 isfinal 
      

   

 


   
   

