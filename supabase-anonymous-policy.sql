-- 익명 사용자 허용 설정
-- Supabase 대시보드 > SQL Editor에서 실행

-- 1. 기존 RLS 정책 삭제
DROP POLICY IF EXISTS "Users can view own places" ON places;
DROP POLICY IF EXISTS "Users can insert own places" ON places;
DROP POLICY IF EXISTS "Users can update own places" ON places;
DROP POLICY IF EXISTS "Users can delete own places" ON places;

-- 2. user_id 컬럼을 nullable로 변경
ALTER TABLE places ALTER COLUMN user_id DROP NOT NULL;

-- 3. 익명 사용자 허용 정책 추가
CREATE POLICY "Anyone can view places"
  ON places
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert places"
  ON places
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update places"
  ON places
  FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete places"
  ON places
  FOR DELETE
  USING (true);

-- 확인: RLS가 활성화되어 있는지 확인
-- (결과가 true여야 함)
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'places';
