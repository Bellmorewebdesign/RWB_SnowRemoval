# RWB Snow Removal LLC

The marketing site for RWB Snow Removal LLC, built as plain HTML, CSS, and
JavaScript. There is no build step, no framework, and no server. The whole
thing runs from static files.

The site is a homepage plus ten interior pages, one per service and one per
service area, so each thing the company does has a real crawlable page of its
own rather than a section anchor. Links between pages use directory URLs, for
example `snow-removal/`, which resolve on GitHub Pages and on any static
server. Opening `index.html` from disk still renders the homepage, but the
directory links only resolve when the files are served rather than opened as
local files.

**Public address: <https://rwbsnowremoval.com/>.** Every canonical URL, Open
Graph URL, sitemap entry and structured data ID points there. The old GitHub
Pages project address is not used anywhere.

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
custom domain and from a repository subpath such as
`username.github.io/RWB_SnowRemoval/`. Pages sit in directories with an
`index.html` inside, which any static server resolves, GitHub Pages included.

## Pages

| URL | Page | What it is for |
| --- | --- | --- |
| `/` | `index.html` | The company overall: all five services, NYC and Long Island |
| `/snow-removal/` | Snow removal | Plowing, clearing, salting, residential and commercial |
| `/towing/` | Towing | Cars, trucks, equipment, vehicles stuck in snow |
| `/junk-removal/` | Junk removal | Hauling and cleanouts |
| `/power-washing/` | Power washing | High pressure work on concrete, pavers, brick, steps |
| `/soft-washing/` | Soft washing | Low pressure work on siding, roofs, fences, painted wood |
| `/service-areas/` | Service areas | The whole coverage area in one place |
| `/service-areas/new-york-city/` | New York City | The five boroughs |
| `/service-areas/nassau-county/` | Nassau County | Near Long Island |
| `/service-areas/suffolk-county/` | Suffolk County | Eastern Long Island |
| `/contact/` | Contact | Phone, email, hours, what to have ready when calling |

`404.html` is deliberately `noindex` and is not in the sitemap.

## Changing the public address

The site address appears in five places. If the domain ever changes, update
these and nothing else:

| File | What to change |
| --- | --- |
| every `index.html` | `<link rel="canonical">`, `og:url`, `og:image`, `twitter:image`, and the URLs inside the JSON-LD block at the bottom |
| `sitemap.xml` | every `<loc>` |
| `robots.txt` | the `Sitemap:` line |
| `CNAME` | the single line naming the domain |
| `README.md` | this table and the address at the top |

Nothing else in the markup is absolute. Assets, stylesheets, scripts and links
between pages are all relative, so the same files work from a custom domain,
from a repository subpath, and from a local static server.

## Files

```
index.html                  the homepage
snow-removal/               one directory per service, each with an index.html
towing/
junk-removal/
power-washing/
soft-washing/
service-areas/              the coverage hub, plus one directory per region
service-areas/new-york-city/
service-areas/nassau-county/
service-areas/suffolk-county/
contact/                    phone, email, hours, service area
404.html                    self contained, so it renders from any bad path
robots.txt, sitemap.xml     search engine basics
favicon.ico                 16, 32, and 48 pixel icons cut from the logo
apple-touch-icon.png        180 pixel home screen icon
.nojekyll                   tells GitHub Pages to skip Jekyll
assets/css/style.css        the one stylesheet, shared by every page
assets/js/main.js           the one script, progressive enhancement only
assets/fonts/               Barlow Condensed and Inter, self hosted
assets/images/              photographs, logo files, social share image
assets/video/               the project reel and its still
originals/                  untouched source files, kept for future edits
docs/                       the original build brief and asset map
```

The header, the footer and the closing call section are duplicated across the
interior pages rather than pulled in at runtime. That is the price of keeping
the site build free and JavaScript free. If one of them changes, change it in
every `index.html`.

Nothing in `originals/` or `docs/` is loaded by the site. They are there so the
next person to edit the images has the full resolution files.

## Editing the content

The homepage copy lives in `index.html`, and each interior page owns its own
copy. The details that repeat everywhere are:

- **Phone:** `347-517-9920`, linked as `tel:+13475179920`
- **Email:** `vasiliostk@gmail.com`, linked as `mailto:vasiliostk@gmail.com`
- **Hours:** open 24 hours
- **Services:** snow removal, towing, junk removal, power washing, soft washing
- **Service area:** Brooklyn, Queens, Manhattan, The Bronx, Staten Island,
  Nassau County, Suffolk County

If the phone number ever changes, search every `.html` file for `3475179920`
and `347-517-9920`, replace both forms, and update the `telephone` value in
each JSON-LD block.

The copy deliberately claims nothing that has not been confirmed by the owner.
There are no invented reviews, ratings, prices, guarantees, response times,
licences, or addresses anywhere in the markup or the structured data.

## How the site talks about hours

RWB does more than snow, so the site never pairs "24 hour" directly with "snow
removal". Availability is stated on its own, as **24-Hour Emergency Services**
or **Open 24 hours**, and the services are listed separately. The title, the
meta description, the Open Graph tags and the visible copy all follow that
split. Please keep it when editing.

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

- One `h1` per page, headings in order, and real landmarks
- Breadcrumbs on every interior page, in markup and in structured data
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
- Interior pages preload the two render critical fonts and nothing else,
  because their largest paint is text rather than a photograph
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

## Structured data

Every page carries one JSON-LD `@graph` describing the same entity:

- `LocalBusiness` at `https://rwbsnowremoval.com/#business`, with the phone
  number, the email, the opening hours, the areas served, and an offer catalog
  linking to the five service pages
- `WebSite`, and a `WebPage` for the page itself
- `BreadcrumbList` on every page below the homepage
- `Service` on each service page and each service area page, pointing back at
  the same business

There is no address beyond the state, no latitude or longitude, no rating, no
review and no `sameAs`, because none of those are known or public. Do not add
them to the markup unless they become true and visible on the page.

---

Website by Bellmore Web Design.
