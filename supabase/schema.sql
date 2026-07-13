-- 「三花文化館盃學生導覽競賽」資料庫 Schema
-- 此檔案反映實際已在 Supabase 建立的資料表結構（共用 VC-SF-Story 專案的 city、sf_news 表）
-- 欄位命名沿用主辦方慣例（無底線）：culyear、schoolno、schoolfull、contitle、conemail、conmobile、stuno、stuname、teaname、isfinal

CREATE TABLE IF NOT EXISTS sf_cul_school (
  id         SERIAL       PRIMARY KEY,
  culyear    VARCHAR(4)   DEFAULT '2026',
  schoolno   VARCHAR(10),
  school     VARCHAR(20),
  schoolfull VARCHAR(50),
  vocational VARCHAR(20)  CHECK (vocational IN ('高級職業學校', '高級中學附設職業類科', '綜合高中開設專門學程', '高職進修學校', '五專前三年')),
  city       VARCHAR(5),
  address    VARCHAR(80),
  tel        VARCHAR(20),
  contract   VARCHAR(10),
  contitle   VARCHAR(10),
  conemail   VARCHAR(60),
  conmobile  VARCHAR(10),
  password   VARCHAR(20),
  remark     TEXT
);

CREATE TABLE IF NOT EXISTS sf_cul_student (
  id       SERIAL       PRIMARY KEY,
  culyear  VARCHAR(4),
  schoolno VARCHAR(10),
  stuno    VARCHAR(15)  UNIQUE,
  stuname  VARCHAR(10),
  teaname  VARCHAR(10),
  youtube  VARCHAR(11),
  isfinal  BOOLEAN,
  prize    VARCHAR(20)
);
