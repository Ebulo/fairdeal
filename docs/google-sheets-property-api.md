# Google Sheets Property Listings API

Google Apps Script can power this section. Use it as a simple public read API for non-sensitive property inventory and property detail pages.

## Sheet Setup

Create a Google Sheet with a tab named `Properties`, then add these headers in row 1:

```csv
id,slug,title,category,propertyType,transactionType,location,city,state,postalCode,priceLabel,priceValue,areaLabel,approvalStatus,possessionTimeline,shortDescription,longDescription,imageUrl,galleryUrls,detailUrl,contactUrl,contactLabel,status,featured,sortOrder,updatedAt,seoTitle,seoDescription,seoKeywords,keyMetrics,approvals,commitments,locationAdvantages,investmentRationale,authorityCoordination,availabilityLabel,galleryNote
```

You can also import `docs/property-listings-sheet-template.csv` to get the same headers with sample rows.

Only rows where `status` is `active` or `published` are shown on the website. Use `draft` or `archived` to keep a row hidden.

For slug detail pages, the important columns are:

`slug`: URL-safe property slug, for example `sampark-heights-patia`.

`detailUrl`: preferred public URL, for example `/properties/sampark-heights-patia/`. If blank, the Apps Script generates it from `slug`.

`seoTitle`, `seoDescription`, `seoKeywords`: used on the property detail page.

`galleryUrls`, `keyMetrics`, `approvals`, `commitments`, `locationAdvantages`, `investmentRationale`, and `authorityCoordination`: use `|` between items.

## Apps Script Deployment

1. Open the Google Sheet.
2. Go to `Extensions > Apps Script`.
3. Paste the full contents of `docs/google-apps-script-property-api.js`.
4. Save the script.
5. Optional: run `setupSheet` once to create headers and sample rows automatically.
6. Go to `Deploy > New deployment`.
7. Select `Web app`.
8. Set `Execute as` to `Me`.
9. Set `Who has access` to `Anyone`.
10. Deploy and copy the Web app URL.

When you update the Apps Script code later, use `Deploy > Manage deployments > Edit > New version`, then deploy again. The live URL can stay the same.

## Website Connection

Paste the deployed Web App URL in `js/fairdeal-config.js`:

```js
window.FD_PROPERTY_LISTINGS_API_URL =
  "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";
```

If this value is empty, the website keeps the listings section locked and shows the API setup message. If the API fails, times out, returns an error, or has no active rows, the section also stays locked with a matching fallback message.

The listing cards link to slug URLs like:

```text
https://fairdealassets.com/properties/sampark-heights-patia/
```

The repo includes routing files for common deployments:

`server.js` for the recommended Node deployment. This gives dynamic slug routing and server-rendered SEO meta/schema by fetching the Sheet row before returning HTML.

`_redirects` for Netlify-style hosting.

`.htaccess` for Apache hosting.

`vercel.json` for Vercel static rewrites.

`firebase.json` for Firebase Hosting rewrites.

If the server shows `Cannot GET /properties/sampark-heights-patia/`, that means the current host is not applying a rewrite and is not using `server.js`. Do not create one folder per slug; that is not dynamic. Configure the host rewrite or run/deploy the Node server.

For local development, run:

```bash
npm start
```

Then open:

```text
http://localhost:3000/properties/sampark-heights-patia/
```

For production Node hosts that require a public bind address, run with `HOST=0.0.0.0 npm start` or set `HOST=0.0.0.0` in the host environment.

For full per-property SEO and social previews, use the Node server or another server-side/edge renderer. A static rewrite can load the page and then update it with JavaScript, but the first HTML response is still the shared template.

## Test URLs

Raw JSON test:

```text
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?status=active&limit=6
```

Single property test:

```text
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?status=active&slug=sampark-heights-patia
```

JSONP browser test:

```text
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?status=active&limit=6&callback=FairdealTest
```

The JSONP response should look like:

```js
FairdealTest({"status":"ok","data":[...]});
```

## Field Notes

`imageUrl` can be a full image URL or a site-relative path like `images/property/chatgpt/aerial-plotted-development.png`.

`galleryUrls` should use `|` between images: `images/property/chatgpt/aerial-plotted-development.png|images/property/chatgpt/legal-land-deed.png`.

`detailUrl` and `contactUrl` can be full URLs or in-page anchors like `#contact-section`.

Do not store private owner details, internal notes, or unpublished commercial terms in this public API sheet.
