# LifeMap GitHub Publishing Checklist

## 1. Create Accounts

- GitHub: https://github.com/signup
- Vercel: https://vercel.com/signup
- Supabase, later for login: https://supabase.com/dashboard/sign-up

Do not share your account password. Log in directly in your own browser.

## 2. Create GitHub Repository

Recommended repository name:

```text
lifemap-city-relationship-map
```

Recommended visibility:

```text
Public
```

Do not initialize the repository with a README, because this project already has one.

## 3. Publish From Local Terminal

Run these commands inside this folder:

```bash
git init
git add index.html app.js styles.css README.md LICENSE .gitignore preview.svg GITHUB_PUBLISHING.md
git commit -m "Initial LifeMap public demo"
git branch -M main
git remote add origin https://github.com/sansiyu931-art/lifemap-city-relationship-map.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## 4. Deploy With Vercel

1. Open https://vercel.com/new
2. Import the GitHub repository.
3. Use default static settings.
4. Deploy.
5. Copy the Vercel URL.
6. Replace placeholder links in `README.md` and the GitHub Star links in the app.

## 5. After Deployment

Update these placeholders:

- `https://your-vercel-demo-url.vercel.app`
- `https://github.com/sansiyu931-art/lifemap-city-relationship-map`

Then commit and push again:

```bash
git add README.md index.html app.js styles.css
git commit -m "Update public demo and repository links"
git push
```

## 6. Next Product Phase

After the public demo is online:

- Add Supabase Auth.
- Save each user's LifeMap data in Supabase.
- Add multi-device sync.
- Add anonymized read-only sharing links.
- Add AI city decision assistant.
