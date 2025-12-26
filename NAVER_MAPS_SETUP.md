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

`index.html` 파일에서 `YOUR_CLIENT_ID`를 발급받은 Client ID로 교체하세요:

```html
<script
  type="text/javascript"
  src="https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=YOUR_CLIENT_ID"
></script>
```

예시:

```html
<script
  type="text/javascript"
  src="https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=abc123def456"
></script>
```

**중요**: 파라미터 이름은 `ncpClientId`가 아닌 `ncpKeyId`입니다.

## 실행

```bash
npm run dev
```
