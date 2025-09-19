# TMS Embed Web 배포 가이드 (/embed/ 경로)

## 1. 빌드 준비

### 1.1 프로젝트 빌드
```bash
# 프로젝트 빌드 (/embed/ 경로에 맞게 설정됨)
npm run build
```

빌드된 파일들:
- 빌드 파일 위치: `./dist/`
- 접근 경로: `https://your-domain.com/embed/`

## 2. 서버 준비

### 2.1 빌드 파일 복사
```bash
# 서버에 빌드 파일 업로드
scp -r ./dist/* user@your-server:/var/www/tms-embed-web/
```

### 2.2 디렉토리 생성 (서버에서)
```bash
sudo mkdir -p /var/www/tms-embed-web
sudo chown -R www-data:www-data /var/www/tms-embed-web
```

## 3. Nginx 설정

### 3.1 Nginx 설치 (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install nginx
```

### 3.2 설정 파일 복사
```bash
# nginx.conf를 서버의 설정 디렉토리로 복사
sudo cp nginx.conf /etc/nginx/sites-available/tms-embed-web
sudo ln -s /etc/nginx/sites-available/tms-embed-web /etc/nginx/sites-enabled/
```

### 3.3 중요: /embed/ 경로 설정 확인
nginx.conf 파일에서 `/embed/` location 블록이 올바르게 설정되었는지 확인하세요:
```nginx
location /embed/ {
    alias /var/www/tms-embed-web/dist/;
    index index.html;
    try_files $uri $uri/ /embed/index.html;
    # ... 기타 설정
}
```

### 3.4 기본 설정 비활성화
```bash
sudo rm /etc/nginx/sites-enabled/default
```

### 3.5 Nginx 설정 테스트 및 재시작
```bash
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx
```

## 4. SSL 인증서 설정 (선택사항)

### 4.1 Let's Encrypt 설치
```bash
sudo apt install certbot python3-certbot-nginx
```

### 4.2 SSL 인증서 발급
```bash
sudo certbot --nginx -d your-domain.com
```

## 5. 방화벽 설정

```bash
# HTTP/HTTPS 포트 열기
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

## 6. 서비스 확인

### 6.1 상태 확인
```bash
sudo systemctl status nginx
```

### 6.2 웹사이트 접속 테스트
```bash
# /embed/ 경로로 접속 테스트
curl -I http://your-domain.com/embed/

# 또는 브라우저에서 직접 접속
# http://your-domain.com/embed/
```

## 7. 로그 모니터링

```bash
# 액세스 로그 확인
sudo tail -f /var/log/nginx/tms-embed-web.access.log

# 에러 로그 확인
sudo tail -f /var/log/nginx/tms-embed-web.error.log
```

## 8. 업데이트 배포

앱을 업데이트할 때마다:

1. 로컬에서 빌드:
```bash
npm run build
```

2. 서버에 파일 업로드:
```bash
scp -r ./dist/* user@your-server:/var/www/tms-embed-web/
```

3. Nginx 재시작 (필요시):
```bash
sudo systemctl reload nginx
```

## 9. 환경 설정

### 9.1 도메인 설정
`nginx.conf` 파일에서 `your-domain.com`을 실제 도메인으로 변경하세요.

### 9.2 포트 설정
기본적으로 80번 포트를 사용합니다. 다른 포트를 사용하려면 `nginx.conf`의 `listen` 지시어를 수정하세요.

## 10. 보안 고려사항

- 정기적으로 nginx와 시스템 업데이트
- 방화벽 설정 확인
- SSL 인증서 갱신 (Let's Encrypt는 90일마다 갱신 필요)
- 로그 모니터링

## 문제 해결

### 빌드 파일이 보이지 않는 경우
```bash
# 파일 권한 확인
ls -la /var/www/tms-embed-web/
sudo chown -R www-data:www-data /var/www/tms-embed-web/
```

### Nginx가 시작되지 않는 경우
```bash
# 설정 파일 문법 확인
sudo nginx -t

# 에러 로그 확인
sudo journalctl -u nginx
```

### 404 에러가 발생하는 경우
- `try_files $uri $uri/ /embed/index.html;` 설정이 올바른지 확인
- React Router를 사용하므로 모든 경로가 `/embed/index.html`로 리다이렉트되어야 함
- `/embed/` 경로로 접속하고 있는지 확인

### /embed/ 경로 접속이 안 되는 경우
- nginx 설정에서 `location /embed/` 블록이 올바른지 확인
- `alias /var/www/tms-embed-web/dist/;` 경로가 실제 파일 위치와 일치하는지 확인
- nginx 에러 로그 확인: `sudo tail -f /var/log/nginx/error.log`
