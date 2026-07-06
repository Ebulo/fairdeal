const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "127.0.0.1";
const SITE_ORIGIN = process.env.SITE_ORIGIN || "https://fairdealassets.com";
const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf"
};

const DEFAULT_PROPERTY_IMAGE = "images/property/chatgpt/aerial-plotted-development.png";
const PROPERTY_IMAGE_BASE = "images/property/chatgpt/";
const PROPERTY_IMAGE_OVERRIDES = {
  "sampark-heights-patia": {
    imageUrl: `${PROPERTY_IMAGE_BASE}aerial-plotted-development.png`,
    galleryUrls: [
      `${PROPERTY_IMAGE_BASE}aerial-plotted-development.png`,
      `${PROPERTY_IMAGE_BASE}revenue-road-development.png`,
      `${PROPERTY_IMAGE_BASE}morning-suburban-plot.png`,
      `${PROPERTY_IMAGE_BASE}legal-land-deed.png`
    ]
  },
  "utkal-corporate-center": {
    imageUrl: `${PROPERTY_IMAGE_BASE}patia-infocity-commercial-plot.png`,
    galleryUrls: [
      `${PROPERTY_IMAGE_BASE}patia-infocity-commercial-plot.png`,
      `${PROPERTY_IMAGE_BASE}zoning-plan-layout.png`,
      `${PROPERTY_IMAGE_BASE}industrial-landscape-survey.png`,
      `${PROPERTY_IMAGE_BASE}legal-land-deed.png`
    ]
  },
  "coastal-vista-villas": {
    imageUrl: `${PROPERTY_IMAGE_BASE}development-site-data.png`,
    galleryUrls: [
      `${PROPERTY_IMAGE_BASE}development-site-data.png`,
      `${PROPERTY_IMAGE_BASE}revenue-road-development.png`,
      `${PROPERTY_IMAGE_BASE}morning-suburban-plot.png`,
      `${PROPERTY_IMAGE_BASE}aerial-plotted-development.png`
    ]
  }
};

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function protectHeroText(value) {
  return String(value || "").replace(/([A-Za-z])-([A-Za-z])/g, "$1\u2011$2");
}

function toAbsoluteUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) return `${SITE_ORIGIN}/${DEFAULT_PROPERTY_IMAGE}`;
  if (/^https?:\/\//i.test(raw)) return raw;
  return new URL(raw.replace(/^\.\//, ""), SITE_ORIGIN + "/").href;
}

async function getConfiguredApiUrl() {
  if (process.env.FD_PROPERTY_LISTINGS_API_URL) {
    return process.env.FD_PROPERTY_LISTINGS_API_URL;
  }

  try {
    const config = await fs.readFile(path.join(ROOT, "js/fairdeal-config.js"), "utf8");
    const match = config.match(/https:\/\/script\.google\.com\/macros\/s\/[^"']+\/exec/);
    return match ? match[0] : "";
  } catch (err) {
    return "";
  }
}

async function fetchProperty(slug) {
  const apiUrl = await getConfiguredApiUrl();
  if (!apiUrl || typeof fetch !== "function") return null;

  const url = new URL(apiUrl);
  url.searchParams.set("status", "active");
  url.searchParams.set("slug", slug);
  url.searchParams.set("limit", "1");

  const response = await fetch(url, {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(8000)
  });
  if (!response.ok) throw new Error(`Property API returned ${response.status}`);

  const payload = await response.json();
  const rows = Array.isArray(payload)
    ? payload
    : Array.isArray(payload.data)
      ? payload.data
      : [];
  return rows[0] || null;
}

function replaceMeta(html, key, keyValue, value) {
  if (!value) return html;
  const pattern = new RegExp(
    `<meta\\s+[^>]*\\b${key}=["']${escapeRegExp(keyValue)}["'][^>]*>`,
    "i"
  );
  const replacement = match => {
    if (/\scontent=/i.test(match)) {
      return match.replace(
        /\scontent=(["'])([\s\S]*?)\1/i,
        ` content="${escapeHtml(value)}"`
      );
    }
    return match.replace(/>$/, ` content="${escapeHtml(value)}">`);
  };
  return html.replace(pattern, replacement);
}

function replaceMetaName(html, name, value) {
  return replaceMeta(html, "name", name, value);
}

function replaceMetaProperty(html, property, value) {
  return replaceMeta(html, "property", property, value);
}

function replaceLink(html, attrs, value) {
  if (!value) return html;
  const pattern = new RegExp(
    `<link\\s+${attrs}[^>]*>`,
    "i"
  );
  return html.replace(pattern, match =>
    match.replace(/\shref=(["'])([\s\S]*?)\1/i, ` href="${escapeHtml(value)}"`)
  );
}

function replaceTextByAttr(html, attrName, value) {
  if (!value) return html;
  const pattern = new RegExp(
    `(<[^>]+${escapeRegExp(attrName)}[^>]*>)([\\s\\S]*?)(</[^>]+>)`,
    "i"
  );
  return html.replace(pattern, `$1${escapeHtml(value)}$3`);
}

function buildSchema(item, canonicalUrl, title, description, imageUrl) {
  const typeText = String(item.propertyType || item.category || "").toLowerCase();
  let itemType = "Place";
  if (/apartment|residential/.test(typeText)) itemType = "ApartmentComplex";
  else if (/villa|house/.test(typeText)) itemType = "House";
  else if (/office|commercial|it|retail/.test(typeText)) itemType = "OfficeBuilding";

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Offer",
        "@id": `${canonicalUrl}#offer`,
        priceCurrency: "INR",
        price: item.priceValue || undefined,
        availability: "https://schema.org/InStock",
        url: canonicalUrl,
        seller: { "@id": "https://fairdealassets.com/#organization" },
        itemOffered: {
          "@type": itemType,
          "@id": `${canonicalUrl}#property`,
          name: title,
          description,
          image: imageUrl,
          address: {
            "@type": "PostalAddress",
            streetAddress: item.location || undefined,
            addressLocality: item.city || undefined,
            addressRegion: item.state || "Odisha",
            postalCode: item.postalCode || undefined,
            addressCountry: "IN"
          }
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_ORIGIN}/` },
          {
            "@type": "ListItem",
            position: 2,
            name: "Properties",
            item: `${SITE_ORIGIN}/#gallery-section`
          },
          { "@type": "ListItem", position: 3, name: title, item: canonicalUrl }
        ]
      }
    ]
  };
}

function applyImageOverride(item, fallbackSlug) {
  const slug = slugify(item.slug || item.id || item.title || fallbackSlug);
  const override = PROPERTY_IMAGE_OVERRIDES[slug];
  if (!override) return item;
  return {
    ...item,
    imageUrl: override.imageUrl || item.imageUrl,
    galleryUrls: override.galleryUrls || item.galleryUrls
  };
}

function splitGalleryUrls(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  return String(value || "")
    .split(/\n|\s*\|\s*/g)
    .map(item => item.trim())
    .filter(Boolean);
}

function renderGalleryHtml(item, title) {
  const urls = [];
  if (item.imageUrl) urls.push(item.imageUrl);
  splitGalleryUrls(item.galleryUrls).forEach(url => urls.push(url));
  const uniqueUrls = urls.filter((url, index, array) => url && array.indexOf(url) === index);
  const finalUrls = uniqueUrls.length ? uniqueUrls : [DEFAULT_PROPERTY_IMAGE];

  return finalUrls
    .map((url, index) => {
      const src = toAbsoluteUrl(url).replace(SITE_ORIGIN, "");
      return `<div><img src="${escapeHtml(src)}" alt="${escapeHtml(
        `${title} property image ${index + 1}`
      )}" class="img-fluid" loading="lazy" decoding="async"></div>`;
    })
    .join("");
}

function withoutUndefined(value) {
  if (Array.isArray(value)) return value.map(withoutUndefined);
  if (value && typeof value === "object") {
    Object.keys(value).forEach(key => {
      if (value[key] === undefined || value[key] === "") delete value[key];
      else value[key] = withoutUndefined(value[key]);
    });
  }
  return value;
}

async function renderPropertyPage(slug) {
  let html = await fs.readFile(path.join(ROOT, "property.html"), "utf8");
  let item = await fetchProperty(slug);
  if (!item) return html;
  item = applyImageOverride(item, slug);

  const itemSlug = slugify(item.slug || item.id || item.title || slug);
  const canonicalPath =
    item.detailUrl && String(item.detailUrl).charAt(0) !== "#"
      ? item.detailUrl
      : `/properties/${itemSlug}/`;
  const canonicalUrl = toAbsoluteUrl(canonicalPath);
  const title = item.title || "Verified property mandate";
  const description =
    item.seoDescription ||
    item.longDescription ||
    item.shortDescription ||
    [item.location, item.approvalStatus, item.possessionTimeline].filter(Boolean).join(" | ");
  const seoTitle =
    item.seoTitle || `${title} | Fairdeal Assets Verified Property Mandate`;
  const imageUrl = toAbsoluteUrl(item.imageUrl || DEFAULT_PROPERTY_IMAGE);
  const subtitle = [item.priceLabel, item.areaLabel, item.location].filter(Boolean).join(" | ");
  const schema = JSON.stringify(
    withoutUndefined(buildSchema(item, canonicalUrl, title, description, imageUrl))
  );

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(seoTitle)}</title>`);
  html = replaceMetaName(html, "description", description);
  html = replaceMetaName(
    html,
    "keywords",
    item.seoKeywords ||
      [title, item.location, item.city, item.state, "Fairdeal Assets property"]
        .filter(Boolean)
        .join(", ")
  );
  html = replaceLink(html, "rel=[\"']canonical[\"']", canonicalUrl);
  html = replaceLink(html, "rel=[\"']alternate[\"'][^>]*hreflang=[\"']en-IN[\"']", canonicalUrl);
  html = replaceLink(html, "rel=[\"']alternate[\"'][^>]*hreflang=[\"']en[\"']", canonicalUrl);
  html = replaceLink(html, "rel=[\"']alternate[\"'][^>]*hreflang=[\"']x-default[\"']", canonicalUrl);
  html = replaceMetaProperty(html, "og:title", seoTitle);
  html = replaceMetaProperty(html, "og:description", description);
  html = replaceMetaProperty(html, "og:url", canonicalUrl);
  html = replaceMetaProperty(html, "og:image", imageUrl);
  html = replaceMetaProperty(html, "og:image:secure_url", imageUrl);
  html = replaceMetaProperty(html, "og:image:alt", title);
  html = replaceMetaName(html, "twitter:title", seoTitle);
  html = replaceMetaName(html, "twitter:description", description);
  html = replaceMetaName(html, "twitter:image", imageUrl);
  html = replaceMetaName(html, "twitter:image:alt", title);
  html = replaceMetaName(html, "twitter:url", canonicalUrl);
  html = replaceMetaProperty(html, "product:price:amount", item.priceValue);
  html = html.replace(
    /<script type="application\/ld\+json" id="fd-property-schema">[\s\S]*?<\/script>/i,
    `<script type="application/ld+json" id="fd-property-schema">${schema}</script>`
  );
  html = replaceTextByAttr(html, "data-fd-property-title", title);
  html = replaceTextByAttr(html, "data-fd-property-subtitle", protectHeroText(subtitle));
  html = html.replace(
    /style="background-image:\s*url\([^)]*\);"/i,
    `style="background-image: url(${escapeHtml(imageUrl)});"`
  );
  html = html.replace(
    /(<!-- FD_PROPERTY_GALLERY_START -->)([\s\S]*?)(<!-- FD_PROPERTY_GALLERY_END -->)/i,
    `$1${renderGalleryHtml(item, title)}$3`
  );

  return html;
}

async function serveStatic(pathname, res) {
  const publicPath = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.normalize(path.join(ROOT, decodeURIComponent(publicPath)));

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  try {
    const body = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME_TYPES[ext] || "application/octet-stream" });
    res.end(body);
  } catch (err) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    const propertyMatch = url.pathname.match(/^\/properties\/([a-z0-9-]+)\/?$/i);

    if (propertyMatch) {
      const html = await renderPropertyPage(slugify(propertyMatch[1]));
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
      return;
    }

    await serveStatic(url.pathname, res);
  } catch (err) {
    console.error(err);
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Internal server error");
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Fairdeal server running at http://${HOST}:${PORT}`);
});
