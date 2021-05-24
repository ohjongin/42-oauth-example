# 42 OAuth example

본 문서는 node.js 기반 Passport를 사용하여 42 intra OAuth를 사용하는 예제코드입니다.

| 버전  | 배포일   | 주요 변경사항                     |
| ------- | ------ | ---------------------------- |
| 1.00.00 | 2021.5.24 | 초도 버전 배포  |



### 사용 모듈
- [passport](http://www.passportjs.org/)
- [passport-42 Strategy](http://www.passportjs.org/packages/passport-42/)


### 사용 전 설정
- [42 intra Application](https://profile.intra.42.fr/oauth/applications) 화면에서 APP 생성
- APP 생성시 `REDIRECT URI`는 OAuth 서비스를 사용할 도메인과 OAuth 인증 데이터를 받는 URI path를 지정합니다.
  - 예를들면 `http://localhost:3000/auth/42/callback` 
- `ENV_NAME` 환경변수 설정
- .env.sample 파일을 `.env.${ENV_NAME}` 으로 복사
- APP 설정 화면에서 `UID`, `SECRET`값을 `.env.${ENV_NAME}` 의 `CLIENT_ID`, `CLIENT_SECRET` 값으로 각각 설정

```bash
CLIENT_ID=xxxxxxebdabbd8849d73d8f541780d0946620fccxxxxxxxx 
CLIENT_SECRET=xxxxxxxcd6e42d7a37a305d98b068441d96cb5edf8e2d4247c5xxxxxxx
```

- APP 설정 화면에서 `REDIRECT URI` 값을 `.env.${ENV_NAME}` 의 `CALLBACK_URL` 값으로 설정
  - `REDIRECT URI` 값과 `CALLBACK_URL` 값이 정확하게 일치하지 않으면 OAuth 인증 과정에서 Invalid URI 오류가 발생
```bash
CALLBACK_URL=http://localhost:3000/auth/42/callback
```
