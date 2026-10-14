# UREV website: setup guide

Your site is a free GitHub Pages site. Photos you drop into the `portfolio` folder show up on the site automatically, with no code editing.

---

## 1. Buy the domain

**Recommended: `utahrealestatevisuals.com`** (was unregistered when I checked on Oct 12, 2026).

- It matches your full brand name and has the keywords "Utah real estate" in it.
- Optional: also buy **`utahrev.com`** (also unregistered) to match your email, and forward it to the main domain.
- `urev.com` is taken (listed for sale on a domain marketplace, usually at a premium price).

Buy it at Cloudflare Registrar, Porkbun, or Namecheap. Expect roughly $10–15 per year. Skip add-ons like hosting, email, or "SEO packages"; you don't need them.

> If you pick a different domain, open the `CNAME` file and `_config.yml` and replace `utahrealestatevisuals.com` with the new one.

---

## 2. Put the site on GitHub

1. Sign in at **github.com** (create a free account if you don't have one).
2. Click **+** in the top right, then **New repository**.
   - Name: `urev-website`
   - Visibility: **Public** (free GitHub Pages needs a public repo)
   - Don't add a README. Click **Create repository**.
3. On the empty repo page, click **uploading an existing file**.
4. Unzip `urev-website.zip`, open the folder, select **everything inside it**, and drag it into the browser.
5. Click **Commit changes**.

---

## 3. Turn on GitHub Pages

1. In the repo, go to **Settings** > **Pages**.
2. Under **Build and deployment**, set Source to **Deploy from a branch**, branch **main**, folder **/ (root)**. Click **Save**.
3. The **Custom domain** box should already say `utahrealestatevisuals.com` (it reads the `CNAME` file). If not, type it and save.

---

## 4. Point the domain at GitHub

At your domain registrar, open the DNS settings and add these records. Delete any existing "parking" A records for `@` first.

| Type  | Name  | Value                    |
|-------|-------|--------------------------|
| A     | @     | 185.199.108.153          |
| A     | @     | 185.199.109.153          |
| A     | @     | 185.199.110.153          |
| A     | @     | 185.199.111.153          |
| CNAME | www   | utah-rev.github.io       |

On Cloudflare, set these records to **DNS only** (grey cloud), not proxied.

DNS can take from a few minutes up to 24 hours. Once GitHub shows the domain check as successful, go back to **Settings** > **Pages** and tick **Enforce HTTPS**.

---

## 5. Upload your portfolio photos

The `portfolio` folder has four subfolders:

| Folder | What it does |
|---|---|
| `featured` | The big photo at the top of the homepage. Put **one** great shot here (your best twilight or exterior). |
| `exteriors` | Shows under the **Exteriors** filter button |
| `interiors` | Shows under the **Interiors** filter button |
| `aerial` | Shows under the **Aerial** filter button |

Any new subfolder you create (like `twilight` or `commercial`) automatically becomes a new filter button.

**To upload on github.com:** open `portfolio` > a folder > **Add file** > **Upload files**, drag photos in, click **Commit changes**. The site updates in about a minute.

**For big batches,** install **GitHub Desktop** (free). Clone the repo to your computer, drag photos into the folders in Finder or File Explorer, then click **Commit** and **Push**.

### Photo rules that matter

- **Resize before uploading:** export JPGs at **2400 px on the long edge, quality about 80**. That keeps each photo under 1 MB so the site loads fast (speed is a Google ranking factor).
- **Name files descriptively, with the city:** `kitchen-island-alpine.jpg`, `front-exterior-lehi.jpg`. The file name becomes the photo's description for Google, so this is free SEO. Use dashes, not spaces.
- Photos show in alphabetical order by file name. Start names with `01-`, `02-` if you want a specific order.
- GitHub's web upload takes up to 100 files at a time, 25 MB each. Keep the whole repo under about 1 GB.

---

## 6. Update your contact info

Open `_config.yml` on GitHub, click the pencil icon, and fill in:

- `phone:` your business number (leave blank to hide it)
- `instagram:` your handle without the @
- `facebook:` your page URL

Commit, and the whole site updates.

---

## 7. After launch: get found on Google

1. **Google Search Console:** add `utahrealestatevisuals.com`, verify it, and submit `https://utahrealestatevisuals.com/sitemap.xml`.
2. **Google Business Profile:** create one for "Utah Real Estate Visuals" (the name must match your registered DBA), category **Real estate photographer**, service area Utah. Link the website. This is the biggest local SEO lever.
3. Add the website link to your Instagram bio, Facebook page, and the 801 Aerial site footer.
