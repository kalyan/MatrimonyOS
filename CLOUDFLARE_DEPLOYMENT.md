# Deploying Matrimony OS on Cloudflare Pages (Free Tier)

Matrimony OS is fully prepared for zero-cost deployment on **Cloudflare Pages**.

---

## Method 1: Git-Connected Automated Deployment (Recommended)

1. **Push your repository to GitHub or GitLab**.
2. Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/) > **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Select your repository: `whatsapp-matrimony-os`.
4. Configure Build Settings:
   - **Framework preset**: `Next.js`
   - **Build command**: `npx @cloudflare/next-on-pages` (or `npm run build`)
   - **Build output directory**: `.vercel/output/static`
   - **Root directory**: `/` (Leave default)
5. Add Environment Variables under **Settings > Environment variables**:
   - `NODE_VERSION`: `20`
   - `NEXT_PUBLIC_APP_URL`: `https://your-project.pages.dev`
   - (Optional) `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Under **Settings > Functions > Compatibility flags**:
   - Add flag: `nodejs_compat`
7. Click **Save and Deploy**.

---

## Method 2: Command-Line Deployment with Wrangler

1. Install Wrangler globally or use `npx`:
   ```bash
   npm install -g wrangler
   ```
2. Log in to your Cloudflare account:
   ```bash
   wrangler login
   ```
3. Build the project for Cloudflare Pages:
   ```bash
   npx @cloudflare/next-on-pages
   ```
4. Deploy the output to Cloudflare Pages:
   ```bash
   wrangler pages deploy .vercel/output/static --project-name=matrimony-os
   ```

---

## Included Cloudflare Optimizations

- **`wrangler.toml`**: Configured with `nodejs_compat` compatibility flag and project settings.
- **`public/_headers`**: Enforces strict `X-Robots-Tag: noindex, nofollow` headers on all matrimonial profile and match routes across the Cloudflare edge network, plus strict security headers (`X-Frame-Options`, `nosniff`).
- **`public/_routes.json`**: Optimizes Cloudflare edge worker routing by excluding static icons, manifest, and CSS bundles from invocation costs.
