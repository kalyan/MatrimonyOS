# Deploying Matrimony OS on Cloudflare Pages (Free Tier)

Matrimony OS is fully optimized for zero-cost deployment on **Cloudflare Pages**.

---

## Automated Deployment via Git (Zero-Config)

1. **Push to GitHub**:
   The repository is already configured to automatically output to `out/`.
2. In the [Cloudflare Dashboard](https://dash.cloudflare.com/) > **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**:
   - **Framework preset**: `Next.js` (or `None`)
   - **Build command**: `npx next build`
   - **Build output directory**: `out` (automatically read from `wrangler.toml`)
3. Click **Save and Deploy**.
   Cloudflare will run `npx next build`, generate the optimized static application in `out/`, and deploy across Cloudflare's global edge network in seconds.

---

## Included Cloudflare Optimizations

- **`wrangler.toml`**: Points to `pages_build_output_dir = "out"`.
- **`public/_headers`**: Copied into `out/_headers` on build; automatically enforces strict `X-Robots-Tag: noindex, nofollow` on all profile/family routes across Cloudflare's global edge network, plus security headers.
- **`public/_routes.json`**: Optimizes Cloudflare Pages edge routing.
