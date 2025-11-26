# Datinum Whitepaper

React + Vite 싱글 페이지 앱으로 Datinum whitepaper를 시각화한다.

## 개발

```bash
npm install
npm run dev
```

## 빌드

```bash
npm run build
npm run preview
```

## GitHub Pages 배포

1. `main`에 push 하면 `.github/workflows/deploy.yml`이 자동으로 실행돼 Pages용 빌드를 만든다.
2. 처음 한 번은 GitHub > Settings > Pages에서 **Build and deployment**를 “GitHub Actions”로 바꿔준다.
3. 워크플로가 끝나면 `https://mondbarde.github.io/datinum/`에서 결과를 볼 수 있다.

필요하면 수동으로도 실행 가능:

```bash
gh workflow run Deploy_to_GitHub_Pages
```

> fetch 경로는 `import.meta.env.BASE_URL`을 기준으로 동작하므로 로컬/배포 모두 동일하게 whitepaper를 불러온다.
