# UREV: Utah Real Estate Visuals

Website for utahrealestatevisuals.com, hosted on GitHub Pages.

## Edit the site without touching code

| To change… | Edit this file |
|---|---|
| Phone, email, socials, Formspree ID, Google codes | `_config.yml` |
| Pricing packages | `_data/pricing.yml` |
| FAQ questions (also shown in Google results) | `_data/faq.yml` |
| Cities and counties served | `_data/areas.yml` |

## Add photos and videos

- **Photos:** drop JPGs into `portfolio/<folder>/` (exteriors, interiors, aerial, land). Each folder with photos becomes a filter button. Export at 2400px long edge, quality ~80.
- **Name files by what and where:** `01-kitchen-island-alpine-utah.jpg`. The leading number sets the order and is hidden; the rest becomes the photo's description for Google.
- **Video tours:** `.mp4` files in `videos/tours/`. **Reels:** `.mp4` in `videos/reels/`. Put a `.jpg` with the same name next to each video as its thumbnail.
- `portfolio/featured/` holds the image used when the site is shared on social media or in texts.

Full setup steps are in `SETUP-GUIDE.md`.
