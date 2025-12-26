# Supabase 설정 가이드

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com/) 접속 및 회원가입
2. **New Project** 클릭
3. 프로젝트 정보 입력:
   - **Name**: triptrip
   - **Database Password**: 강력한 비밀번호 입력 (저장해두세요!)
   - **Region**: Northeast Asia (Seoul) 선택
4. **Create new project** 클릭

## 2. 데이터베이스 테이블 생성

1. Supabase 대시보드에서 **SQL Editor** 메뉴 선택
2. **New query** 클릭
3. `supabase-schema.sql` 파일의 내용을 복사하여 붙여넣기
4. **Run** 버튼 클릭하여 실행

## 3. API 키 가져오기

1. Supabase 대시보드에서 **Settings** > **API** 메뉴 선택
2. 다음 정보를 복사:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (긴 문자열)

## 4. 환경 변수 설정

`.env` 파일을 열고 다음 값을 업데이트하세요:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 5. 익명 접근 허용 (선택사항)

로그인 없이 사용하려면 SQL Editor에서 다음 쿼리를 실행하세요:

```sql
-- 기존 RLS 정책 삭제
DROP POLICY IF EXISTS "Users can view own places" ON places;
DROP POLICY IF EXISTS "Users can insert own places" ON places;
DROP POLICY IF EXISTS "Users can update own places" ON places;
DROP POLICY IF EXISTS "Users can delete own places" ON places;

-- 익명 사용자 허용 정책 추가
CREATE POLICY "Anyone can manage places"
  ON places
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

## 6. 개발 서버 재시작

```bash
npm run dev
```

## 주의사항

- **익명 접근 허용 시**: 모든 사용자가 모든 데이터를 볼 수 있습니다
- **프로덕션 환경**: 사용자 인증을 구현하고 RLS 정책을 적용하세요
- **API 키 보안**: `.env` 파일은 절대 Git에 커밋하지 마세요 (이미 `.gitignore`에 포함됨)

## 데이터 마이그레이션

기존 로컬 데이터를 Supabase로 이전하려면:

1. 브라우저 개발자 도구 > Application > IndexedDB
2. `localforage` > `triptrip_places` 데이터 확인
3. 수동으로 Supabase Table Editor에서 입력하거나
4. 별도의 마이그레이션 스크립트 작성

## 다음 단계

- [ ] 사용자 인증 추가 (Supabase Auth)
- [ ] 실시간 동기화 구현 (Supabase Realtime)
- [ ] 이미지 업로드 기능 (Supabase Storage)
