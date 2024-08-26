#!/bin/bash

# Firebase 서비스 계정 키를 Base64에서 디코딩하여 파일로 저장
echo $NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEY | base64 -d > /app/src/config/firebaseServiceAccountKey.json

# 마지막에 exec "$@"를 추가하여 CMD 명령어를 실행
exec "$@"