# RWB Snow Removal LLC

A one page marketing site for RWB Snow Removal LLC, built as plain HTML, CSS,
and JavaScript. There is no build step, no framework, and no server. The whole
thing runs from static files, and it also works if you open `index.html`
straight from disk.

The design is modern American workwear: a bright, rounded, high contrast layout
that alternates white, warm white, pale blue, photographic, and navy sections,
with red and blue used as accents rather than as wallpaper.

**Primary conversion is a phone call.** Every screen keeps `347-517-9920` one
tap away: in the header, in the hero, on each service, in the closing section,
in the footer, and on a fixed bar at the bottom of every phone screen.

## Deploying to GitHub Pages

1. Push this repository to GitHub.
2. Go to **Settings -> Pages**.
3. Under **Build and deployment**, set **Source** to *Deploy from a branch*.
4. Choose branch **main** and folder **/ (root)**. Save.

That is the whole deployment. GitHub Pages serves `index.html` from the
repository root within a minute or two. Nothing needs to be compiled and no
Actions workflow is required. `.nojekyll` is included so Pages copies the files
across untouched instead of running them through Jekyll.

Every asset reference in the site is relative, so the same files work from a
repository subpath (`username.github.io/RWB_SnowRemoval/`), from a custom
domain, and from a local folder.

## Changing the public address

The site address appears in exactly four places. If a custom domain is added
later, update these and nothing else:

| File | What to change |
| --- | --- |
| `index.html` | `<link rel="canonical">`, `og:url`, `og:image`, `twitter:image`, and the three URLs in the JSON-LD block near the bottom |
| `sitemap.xml` | the single `<loc>` |
| `robots.txt` | the `Sitemap:` line |
| `CNAME` | create this file containing only the domain, if using a custom domain |

The default is the GitHub Pages address for this repository:
`https://bellmorewebdesign.github.io/RWB_SnowRemoval/`

## Files

```
index.html                  the entire site
404.html                    self contained, so it renders from any bad path
robots.txt, sitemap.xml     search engine basics
favicon.ico                 16, 32, and 48 pixel icons cut from the logo
apple-touch-icon.png        180 pixel home screen icon
.nojekyll                   tells GitHub Pages to skip Jekyll
assets/css/style.css        the one stylesheet
assets/js/main.js           the one script, progressive enhancement only
assets/fonts/               Barlow Condensed and Inter, self hosted
assets/images/              photographs, logo files, social share image
assets/video/               the project reel and its still
originals/                  untouched source files, kept for future edits
docs/                       the original build brief and asset map
```

Nothing in `originals/` or `docs/` is loaded by the site. They are there so the
next person to edit the images has the full resolution files.

## Editing the content

Everything visitors read lives in `index.html`. The details that repeat are:

- **Phone:** `347-517-9920`, linked as `tel:+13475179920`
- **Email:** `vasiliostk@gmail.com`, linked as `mailto:vasiliostk@gmail.com`
- **Hours:** open 24 hours
- **Services:** snow removal, towing, junk removal, power washing, soft washing
- **Service area:** Brooklyn, Queens, Manhattan, The Bronx, Staten Island,
  Nassau County, Suffolk County

If the phone number ever changes, search `index.html` and `404.html` for
`3475179920` and `347-517-9920` and replace both forms, then update the
`telephone` value in the JSON-LD block.

The copy deliberately claims nothing that has not been confirmed by the owner.
There are no invented reviews, ratings, prices, guarantees, response times,
licences, or addresses anywhere in the markup or the structured data.

## How the moving parts work

Three effects carry the personality of the site. All three are additions on top
of a page that already reads correctly without them.

**Patriotic ribbon.** A thin red, white, and blue ribbon appears three times as
you scroll: as a divider above the services, as an arc that sweeps around the
project photograph, and as a divider entering the service area. Each segment
draws itself in as its section passes through the viewport, using nothing but a
stroked SVG path and `stroke-dashoffset`. The mid section arc is desktop only,
and with reduced motion every segment simply renders complete.

**RWB service truck.** An original inline SVG truck that changes setup as you
read each service, or when you tap a service name. The plow drops for snow, a
boom and hook come out for towing, the bed tips for junk removal, and a wand
sweeps the ground or a wall for the two washing services. Both washing states
leave part of the surface dirty so the before and after stays readable when the
animation is at rest. It is not a trace of the logo, and it needs no library.

**Seasonal transformation.** A pinned rounded panel wipes the winter photograph
away along a curved plow blade edge to reveal the warm weather photograph,
while the colour environment shifts from icy navy to clean white and American
blue and the copy steps through three lines. The blade is a CSS mask image that
slides across, so it stays on one layer. Below 760 pixels wide, and whenever
reduced motion is requested, the panel becomes a plain stack: winter photo, all
three lines, warm photo.

Ordinary sections use small fade and rise reveals, staggered service cards, and
a rounded mask wipe on photographs.

## The annotated project photograph

The power washing photograph carries two annotation pills with leader lines:

- **Not yet**, a navy pill on the left, pointing into the lower left section
  that has not been washed
- **Washed**, a blue pill with a checkmark on the right, pointing into the
  upper right brick that has been washed

Both are `aria-hidden`, because the same information is in the image alt text
and in the caption underneath. Positions live in `assets/css/style.css` under
`.pin-todo` and `.pin-done`; each pill has a `left`/`top` and its line has a
length and a rotation, with the target dot placed at the far end of that line.
If the crop ever changes, those are the six numbers to adjust.

## Accessibility

- One `h1`, headings in order, and real landmarks
- Skip link, visible focus rings, and a mobile menu that traps focus and closes
  on Escape
- Every tap target is at least 44 by 44 pixels
- Body text never drops below 16 pixels
- Alt text describes only what is actually visible in each photograph
- The project reel is muted, never autoplays under reduced motion or a data
  saver, and has a labelled play and pause control
- Every animation is skipped when `prefers-reduced-motion: reduce` is set

## Performance notes

- First load is roughly 380 KB on a phone across nine requests
- Photographs ship at three widths each and are chosen with `srcset`
- Only the hero image is preloaded, along with the two render critical fonts
- The fonts are self hosted and subset to the characters the site uses, which
  brings four faces down to about 57 KB in total
- The video is not fetched at all until it is near the viewport
- Every image carries `width` and `height`, so there is no layout shift

If the copy ever needs a character outside basic Latin, regenerate the fonts
from Google Fonts rather than editing the subset files in place.

## Browser support

Current versions of Chrome, Edge, Firefox, and Safari, on desktop and mobile.
Older browsers without CSS masks or `IntersectionObserver` still get the full
content, the full navigation, and every phone link. They just do not get the
motion.

---

Website by Bellmore Web Design.
