/**
 * Fairdeal property listings API for Google Apps Script.
 *
 * Deploy as:
 * 1. Extensions -> Apps Script
 * 2. Paste this file
 * 3. Run setupSheet once to create headers and sample rows
 * 4. Deploy -> New deployment -> Web app
 * 5. Execute as: Me
 * 6. Who has access: Anyone
 * 7. Copy the Web app URL into js/fairdeal-config.js
 */

const SHEET_NAME = "Properties";
const DEFAULT_LIMIT = 12;
const HEADERS = [
  "id",
  "slug",
  "title",
  "category",
  "propertyType",
  "transactionType",
  "location",
  "city",
  "state",
  "postalCode",
  "priceLabel",
  "priceValue",
  "areaLabel",
  "approvalStatus",
  "possessionTimeline",
  "shortDescription",
  "longDescription",
  "imageUrl",
  "galleryUrls",
  "detailUrl",
  "contactUrl",
  "contactLabel",
  "status",
  "featured",
  "sortOrder",
  "updatedAt",
  "seoTitle",
  "seoDescription",
  "seoKeywords",
  "keyMetrics",
  "approvals",
  "commitments",
  "locationAdvantages",
  "investmentRationale",
  "authorityCoordination",
  "availabilityLabel",
  "galleryNote"
];

const SAMPLE_PROPERTIES = [
  {
    id: "sampark-heights-patia",
    slug: "sampark-heights-patia",
    title: "Sampark Heights, Patia",
    category: "Residential",
    propertyType: "Apartment",
    transactionType: "Sale",
    location: "Patia, Bhubaneswar",
    city: "Bhubaneswar",
    state: "Odisha",
    postalCode: "751024",
    priceLabel: "₹1.85 Cr onwards",
    priceValue: 18500000,
    areaLabel: "3 & 4 BHK premium residences",
    approvalStatus: "RERA filing submitted",
    possessionTimeline: "Q4 2025",
    shortDescription: "Premium residences with approval status and possession timeline available upfront.",
    longDescription: "Sampark Heights is a curated residential mandate in Patia, Bhubaneswar with pricing, approval status, and possession milestones reviewed by Fairdeal Assets.",
    imageUrl: "images/property/chatgpt/aerial-plotted-development.png",
    galleryUrls: "images/property/chatgpt/aerial-plotted-development.png|images/property/chatgpt/revenue-road-development.png|images/property/chatgpt/morning-suburban-plot.png|images/property/chatgpt/legal-land-deed.png",
    detailUrl: "/properties/sampark-heights-patia/",
    contactUrl: "mailto:hello@fairdealassets.com?subject=Sampark%20Heights%20Mandate%20Request",
    contactLabel: "Request Detailed Dossier",
    status: "active",
    featured: true,
    sortOrder: 10,
    updatedAt: new Date(),
    seoTitle: "Sampark Heights Patia | Bhubaneswar Residential Property | Fairdeal Assets",
    seoDescription: "View Sampark Heights in Patia, Bhubaneswar with pricing, configuration, approval status, possession timeline, and Fairdeal Assets site visit support.",
    seoKeywords: "Sampark Heights Patia, Bhubaneswar apartment, Fairdeal Assets property, Odisha residential property",
    keyMetrics: "Typology: 3 & 4 BHK premium apartments|Area: 2,150 - 2,450 sq.ft|Land parcel: 1.8 acres freehold|Towers: 2 residential towers",
    approvals: "RERA filing submitted|BDA building plan clearance in progress|Fire NOC application under review",
    commitments: "Site visit coordinated by Fairdeal Assets|Diligence packet shared after buyer qualification|Commercial closure support available",
    locationAdvantages: "5 minutes from KIIT University and Infocity campuses|Access to Nandankanan Road and key city corridors|Near schools, healthcare, and lifestyle hubs",
    investmentRationale: "High-absorption residential micro-market|Limited premium inventory in the Patia corridor|Documentation and approval status reviewed before closure",
    authorityCoordination: "Approval tracker maintained by mandate team|Legal and technical documentation coordinated|Buyer support through agreement and possession stages",
    availabilityLabel: "Limited inventory",
    galleryNote: "Visuals are indicative; final specifications will follow the executed agreement and sanctioned drawings."
  },
  {
    id: "utkal-corporate-center",
    slug: "utkal-corporate-center",
    title: "Utkal Corporate Center",
    category: "Commercial",
    propertyType: "Office",
    transactionType: "Sale",
    location: "Bhubaneswar",
    city: "Bhubaneswar",
    state: "Odisha",
    priceLabel: "₹3.75 Cr onwards",
    priceValue: 37500000,
    areaLabel: "Grade-A office floors",
    approvalStatus: "Fire and occupancy NOCs coordinated",
    possessionTimeline: "Fit-out ready after documentation",
    shortDescription: "Office floors with compliance documentation coordinated for a faster fit-out path.",
    longDescription: "Utkal Corporate Center is a commercial mandate curated for buyers who need clarity on approvals, fit-out readiness, and transaction documentation.",
    imageUrl: "images/property/chatgpt/patia-infocity-commercial-plot.png",
    galleryUrls: "images/property/chatgpt/patia-infocity-commercial-plot.png|images/property/chatgpt/zoning-plan-layout.png|images/property/chatgpt/industrial-landscape-survey.png|images/property/chatgpt/legal-land-deed.png",
    detailUrl: "/properties/utkal-corporate-center/",
    contactUrl: "mailto:hello@fairdealassets.com?subject=Utkal%20Corporate%20Center%20Mandate%20Request",
    contactLabel: "Request Commercial Dossier",
    status: "active",
    featured: true,
    sortOrder: 20,
    updatedAt: new Date(),
    seoTitle: "Utkal Corporate Center | Commercial Property in Odisha | Fairdeal Assets",
    seoDescription: "Review Utkal Corporate Center commercial office floors with pricing, approval status, fit-out readiness, and Fairdeal Assets documentation support.",
    keyMetrics: "Typology: Grade-A office floors|Transaction: Sale|Fit-out: Documentation-led handover path",
    approvals: "Fire NOC coordination in progress|Occupancy documentation tracker available|Fit-out compliance reviewed",
    commitments: "Commercial brief shared after buyer qualification|Site inspection coordinated by Fairdeal Assets|Closure support through documentation and negotiation",
    locationAdvantages: "Connected commercial corridor|Access to business services and transport nodes|Suitable for owner-users and investors",
    investmentRationale: "Documented commercial mandate|Compliance-led fit-out path|Fairdeal Assets coordinates diligence before closure",
    authorityCoordination: "NOC and fit-out tracker coordinated|Document review before commercial discussion",
    availabilityLabel: "Selected floors available"
  },
  {
    id: "coastal-vista-villas",
    slug: "coastal-vista-villas",
    title: "Coastal Vista Villas",
    category: "Villa plots",
    propertyType: "Villa",
    transactionType: "Sale",
    location: "Near Puri",
    city: "Puri",
    state: "Odisha",
    priceLabel: "₹2.40 Cr onwards",
    priceValue: 24000000,
    areaLabel: "4 BHK villas",
    approvalStatus: "Tourism-zone permissions in progress",
    possessionTimeline: "Q2 2026",
    shortDescription: "Villas near Puri with permissions and possession milestones tracked clearly.",
    longDescription: "Coastal Vista Villas is a curated villa mandate near Puri for buyers looking for a premium second-home style asset with documented permission milestones.",
    imageUrl: "images/property/chatgpt/development-site-data.png",
    galleryUrls: "images/property/chatgpt/development-site-data.png|images/property/chatgpt/revenue-road-development.png|images/property/chatgpt/morning-suburban-plot.png|images/property/chatgpt/aerial-plotted-development.png",
    detailUrl: "/properties/coastal-vista-villas/",
    contactUrl: "mailto:hello@fairdealassets.com?subject=Coastal%20Vista%20Villas%20Mandate%20Request",
    contactLabel: "Request Villa Dossier",
    status: "active",
    featured: true,
    sortOrder: 30,
    updatedAt: new Date(),
    seoTitle: "Coastal Vista Villas Puri | Villa Property Mandate | Fairdeal Assets",
    seoDescription: "Explore Coastal Vista Villas near Puri with pricing, approval status, possession timeline, and Fairdeal Assets site visit coordination.",
    keyMetrics: "Typology: 4 BHK villas|Location: Near Puri|Transaction: Sale",
    approvals: "Tourism-zone permissions in progress|Possession milestone tracker available|Legal file shared after qualification",
    commitments: "Site visit coordinated by Fairdeal Assets|Commercials shared after buyer briefing|Diligence support through closure",
    locationAdvantages: "Near Puri coastal corridor|Suited for premium second-home demand|Access to tourism and leisure catchments",
    investmentRationale: "Premium villa inventory with documented milestone path|Fairdeal Assets coordinates buyer diligence|Suitable for lifestyle-led long-term holdings",
    authorityCoordination: "Permission tracker maintained|Documentation reviewed before closure",
    availabilityLabel: "Limited villas"
  }
];

function doGet(e) {
  const params = (e && e.parameter) || {};
  const callback = String(params.callback || "").trim();

  let payload;
  try {
    payload = {
      status: "ok",
      updatedAt: new Date().toISOString(),
      data: getProperties_(params)
    };
    payload.count = payload.data.length;
  } catch (err) {
    payload = {
      status: "error",
      message: err && err.message ? err.message : "Unable to load properties.",
      data: []
    };
  }

  if (callback) {
    const safeCallback = sanitizeCallback_(callback);
    return ContentService
      .createTextOutput(`${safeCallback}(${JSON.stringify(payload)});`)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  sheet.clear();
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sheet.setFrozenRows(1);
  sheet.getRange(2, 1, SAMPLE_PROPERTIES.length, HEADERS.length)
    .setValues(SAMPLE_PROPERTIES.map(item => HEADERS.map(header => item[header] || "")));
  sheet.autoResizeColumns(1, HEADERS.length);
}

function getProperties_(params) {
  const sheet = getSheet_();
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];

  const headers = values[0].map(value => String(value || "").trim());
  const requestedStatus = String(params.status || "active").toLowerCase();
  const requestedSlug = slugify_(params.slug || "");
  const requestedId = slugify_(params.id || "");
  const limit = clampNumber_(Number(params.limit || DEFAULT_LIMIT), 1, 100);

  return values
    .slice(1)
    .map(row => rowToObject_(headers, row))
    .filter(item => {
      const status = String(item.status || "active").toLowerCase();
      return status === requestedStatus || (requestedStatus === "active" && status === "published");
    })
    .map(prepareProperty_)
    .filter(item => {
      if (!requestedSlug && !requestedId) return true;
      return item.slug === requestedSlug || slugify_(item.id) === requestedId;
    })
    .sort((a, b) => {
      const orderA = Number(a.sortOrder || 9999);
      const orderB = Number(b.sortOrder || 9999);
      if (orderA !== orderB) return orderA - orderB;
      return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
    })
    .slice(0, limit)
    .map(toPublicProperty_);
}

function getSheet_() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error(`Sheet "${SHEET_NAME}" was not found. Run setupSheet first.`);
  return sheet;
}

function rowToObject_(headers, row) {
  return headers.reduce((object, header, index) => {
    if (!header) return object;
    object[header] = normalizeCell_(row[index]);
    return object;
  }, {});
}

function prepareProperty_(item) {
  item.slug = slugify_(item.slug || item.id || item.title);
  if (!item.detailUrl && item.slug) item.detailUrl = `/properties/${item.slug}/`;
  if (!item.contactLabel) item.contactLabel = "Contact Fairdeal";
  return item;
}

function toPublicProperty_(item) {
  const output = {};
  HEADERS.forEach(header => {
    if (header === "featured") output[header] = toBoolean_(item[header]);
    else output[header] = item[header] || "";
  });
  output.slug = item.slug;
  output.detailUrl = item.detailUrl;
  return output;
}

function normalizeCell_(value) {
  if (value instanceof Date) return value.toISOString();
  return value === null || value === undefined ? "" : value;
}

function toBoolean_(value) {
  if (typeof value === "boolean") return value;
  return ["true", "yes", "1", "y"].indexOf(String(value || "").toLowerCase()) !== -1;
}

function clampNumber_(value, min, max) {
  if (!Number.isFinite(value)) return DEFAULT_LIMIT;
  return Math.max(min, Math.min(max, Math.floor(value)));
}

function slugify_(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sanitizeCallback_(callback) {
  const valid = /^[A-Za-z_$][0-9A-Za-z_$]*(\.[A-Za-z_$][0-9A-Za-z_$]*)*$/.test(callback);
  return valid ? callback : "callback";
}
