# Naver Maps API 설정

이 프로젝트는 네이버 지도 API를 사용합니다.

## API 키 발급

1. [네이버 클라우드 플랫폼](https://www.ncloud.com/)에 접속
2. 콘솔 로그인
3. Services > AI·NAVER API > AI·NAVER API 선택
4. Application 등록
5. Web Dynamic Map 서비스 선택
6. Client ID 발급받기

## 설정 방법

### 1. 네이버 지도 API 키

`index.html` 파일에서 `YOUR_CLIENT_ID`를 발급받은 Client ID로 교체하세요:

```html
<script
  type="text/javascript"
  src="https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=YOUR_CLIENT_ID"
></script>
```

**중요**: 파라미터 이름은 `ncpClientId`가 아닌 `ncpKeyId`입니다.

### 2. 장소 검색 API 키

`.env` 파일에 네이버 클라우드 플랫폼의 API 키를 설정하세요:

```bash
VITE_NAVER_CLIENT_ID=your_client_id
VITE_NAVER_CLIENT_SECRET=your_client_secret
```

**API 키 발급 방법:**

1. [네이버 클라우드 플랫폼](https://console.ncloud.com/) 접속
2. Services > AI·NAVER API > Application 메뉴
3. Application 등록
4. **서비스 선택**에서 다음 서비스 활성화:
   - **Web Dynamic Map** (지도용)
   - **Maps > Geocoding** (장소 검색용) ⚠️ **필수!**
5. Client ID와 Client Secret 확인

**⚠️ 중요: Geocoding 서비스 활성화 확인**

`Permission Denied (errorCode: 210)` 오류가 발생한다면:

1. Application 상세 페이지 접속
2. **서비스 선택** 또는 **서비스 관리** 메뉴 클릭
3. **Maps** 카테고리에서 **Geocoding** 체크박스가 선택되었는지 확인
4. 선택 후 저장

**Web 서비스 URL 등록:**

- `http://localhost:5173` (개발용)
- 실제 배포 도메인 (프로덕션용)

### 3. API 엔드포인트

- **지도 표시**: `https://oapi.map.naver.com/openapi/v3/maps.js`
- **장소 검색**: `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode`

**참고 문서:**

- [Geocoding API 문서](https://api.ncloud-docs.com/docs/application-maps-geocoding)

## 실행

```bash
npm run dev
```
