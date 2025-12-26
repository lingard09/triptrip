-- Supabase 테이블 생성 스크립트
-- Supabase 대시보드의 SQL Editor에서 실행하세요

-- places 테이블 생성
CREATE TABLE IF NOT EXISTS places (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  memo TEXT NOT NULL DEFAULT '',
  category TEXT,
  "createdAt" BIGINT NOT NULL,
  "updatedAt" BIGINT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 인덱스 생성 (검색 성능 향상)
CREATE INDEX IF NOT EXISTS idx_places_user_id ON places(user_id);
CREATE INDEX IF NOT EXISTS idx_places_name ON places(name);
CREATE INDEX IF NOT EXISTS idx_places_category ON places(category);

-- Row Level Security (RLS) 활성화
ALTER TABLE places ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 사용자는 자신의 장소만 조회 가능
CREATE POLICY "Users can view own places"
  ON places
  FOR SELECT
  USING (auth.uid() = user_id);

-- RLS 정책: 사용자는 자신의 장소만 추가 가능
CREATE POLICY "Users can insert own places"
  ON places
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS 정책: 사용자는 자신의 장소만 수정 가능
CREATE POLICY "Users can update own places"
  ON places
  FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS 정책: 사용자는 자신의 장소만 삭제 가능
CREATE POLICY "Users can delete own places"
  ON places
  FOR DELETE
  USING (auth.uid() = user_id);

-- 익명 사용자를 위한 정책 (선택사항)
-- 로그인 없이도 사용하려면 아래 정책을 추가하세요
-- CREATE POLICY "Anonymous users can manage places"
--   ON places
--   FOR ALL
--   USING (true)
--   WITH CHECK (true);
