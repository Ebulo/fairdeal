(function ($) {
  "use strict";

  $(function () {
    var $detail = $("[data-fd-property-detail]").first();
    if (!$detail.length) return;

    var apiUrl = $.trim(window.FD_PROPERTY_LISTINGS_API_URL || "");
    var basePath = window.FD_PROPERTY_DETAIL_BASE_PATH || "/properties/";
    var defaultSlug = "sampark-heights-patia";
    var requestedSlug = getRequestedSlug() || defaultSlug;
    var requestedId = getQueryParam("id");
    var isDefaultProperty =
      requestedSlug === defaultSlug || requestedSlug === "sampark-heights";

    function escapeHtml(value) {
      return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }

    function slugify(value) {
      return $.trim(value || "")
        .toLowerCase()
        .replace(/&/g, " and ")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    function protectHeroText(value) {
      return String(value || "").replace(/([A-Za-z])-([A-Za-z])/g, "$1\u2011$2");
    }

    function getQueryParam(name) {
      var match = new RegExp("[?&]" + name + "=([^&]+)").exec(
        window.location.search,
      );
      return match ? decodeURIComponent(match[1].replace(/\+/g, " ")) : "";
    }

    function getRequestedSlug() {
      var slug = getQueryParam("slug");
      if (slug) return slugify(slug);

      var pathMatch = window.location.pathname.match(
        /\/properties\/([^/?#]+)\/?/i,
      );
      if (pathMatch) return slugify(pathMatch[1]);

      var hash = window.location.hash.replace(/^#/, "");
      if (hash && hash !== "contact-section" && hash !== "next-steps") {
        return slugify(hash);
      }

      return "";
    }

    function addParams(url, params) {
      var separator = url.indexOf("?") === -1 ? "?" : "&";
      return url + separator + $.param(params);
    }

    function loadJsonp(url, params) {
      return new Promise(function (resolve, reject) {
        var callbackName =
          "__fdPropertyDetail_" +
          Date.now() +
          "_" +
          Math.floor(Math.random() * 100000);
        var script = document.createElement("script");
        var timeoutId = window.setTimeout(function () {
          cleanup();
          reject(new Error("Property detail API timed out."));
        }, 12000);

        function cleanup() {
          window.clearTimeout(timeoutId);
          try {
            delete window[callbackName];
          } catch (err) {
            window[callbackName] = undefined;
          }
          if (script.parentNode) script.parentNode.removeChild(script);
        }

        window[callbackName] = function (payload) {
          cleanup();
          resolve(payload);
        };

        params.callback = callbackName;
        script.async = true;
        script.src = addParams(url, params);
        script.onerror = function () {
          cleanup();
          reject(new Error("Property detail API could not be loaded."));
        };
        document.head.appendChild(script);
      });
    }

    function splitList(value) {
      if (Array.isArray(value)) return value.filter(Boolean);
      return String(value || "")
        .split(/\n|\s*\|\s*/g)
        .map(function (item) {
          return $.trim(item);
        })
        .filter(Boolean);
    }

    function getSlug(item) {
      return slugify(item.slug || item.id || item.title || item.name);
    }

    function getDetailPath(item) {
      var slug = getSlug(item);
      return slug ? basePath.replace(/\/?$/, "/") + slug + "/" : "/property.html";
    }

    function applyImageOverride(item) {
      var slug = getSlug(item);
      var override = (window.FD_PROPERTY_IMAGE_OVERRIDES || {})[slug];
      if (!override) return item;

      var merged = $.extend({}, item);
      if (override.imageUrl) merged.imageUrl = override.imageUrl;
      if (override.galleryUrls) merged.galleryUrls = override.galleryUrls;
      return merged;
    }

    function toPublicAssetUrl(url, fallback) {
      var raw = $.trim(url || fallback || "");
      if (!raw) return "";
      if (/^(https?:)?\/\//i.test(raw) || raw.indexOf("data:") === 0) return raw;
      if (raw.charAt(0) === "#") return raw;
      if (raw.charAt(0) === "/") return raw;
      return "/" + raw.replace(/^\.?\//, "");
    }

    function toAbsoluteUrl(url) {
      try {
        return new URL(toPublicAssetUrl(url), window.location.origin).href;
      } catch (err) {
        return url;
      }
    }

    function setMeta(selector, attr, value) {
      if (!value) return;
      var node = document.head.querySelector(selector);
      if (!node) {
        node = document.createElement("meta");
        var nameMatch = selector.match(/\[name=['"]([^'"]+)/);
        var propMatch = selector.match(/\[property=['"]([^'"]+)/);
        if (nameMatch) node.setAttribute("name", nameMatch[1]);
        if (propMatch) node.setAttribute("property", propMatch[1]);
        document.head.appendChild(node);
      }
      node.setAttribute(attr, value);
    }

    function setLink(selector, value) {
      if (!value) return;
      var node = document.head.querySelector(selector);
      if (node) node.setAttribute("href", value);
    }

    function renderList($target, items, fallbackItems) {
      var list = items.length ? items : fallbackItems || [];
      if (!$target.length || !list.length) return;

      $target.html(
        list
          .map(function (item) {
            var labelMatch = String(item).match(/^([^:]{2,42}):\s*(.+)$/);
            if (labelMatch) {
              return (
                "<li><strong>" +
                escapeHtml(labelMatch[1]) +
                ":</strong> " +
                escapeHtml(labelMatch[2]) +
                "</li>"
              );
            }
            return "<li>" + escapeHtml(item) + "</li>";
          })
          .join(""),
      );
    }

    function setStatus(title, message, isError) {
      var $status = $("[data-fd-property-status]");
      if (!$status.length) return;
      $status.prop("hidden", false).toggleClass("is-error", Boolean(isError));
      $status.find("[data-fd-property-status-title]").text(title);
      $status.find("[data-fd-property-status-message]").text(message);
    }

    function hideStatus() {
      $("[data-fd-property-status]").prop("hidden", true);
    }

    function getRows(payload) {
      if (Array.isArray(payload)) return payload;
      if (payload && Array.isArray(payload.data)) return payload.data;
      if (payload && Array.isArray(payload.properties)) return payload.properties;
      return [];
    }

    function findProperty(payload) {
      var rows = getRows(payload);
      var targetSlug = slugify(requestedSlug);
      var targetId = slugify(requestedId);

      return (
        rows.filter(function (item) {
          var itemSlug = getSlug(item);
          var itemId = slugify(item.id);
          return (
            (targetSlug && itemSlug === targetSlug) ||
            (targetId && itemId === targetId)
          );
        })[0] ||
        rows[0] ||
        null
      );
    }

    function renderGallery(item, title) {
      var $gallery = $("[data-fd-property-gallery]");
      if (!$gallery.length) return;

      var urls = splitList(item.galleryUrls);
      if (item.imageUrl) urls.unshift(item.imageUrl);
      urls = urls
        .map(function (url) {
          return toPublicAssetUrl(url);
        })
        .filter(function (url, index, arr) {
          return url && arr.indexOf(url) === index;
        });

      if (!urls.length) urls = ["/images/property/chatgpt/aerial-plotted-development.png"];

      if ($gallery.hasClass("owl-loaded")) {
        $gallery.trigger("destroy.owl.carousel");
        $gallery.removeClass("owl-loaded owl-hidden");
        $gallery.find(".owl-stage-outer").children().unwrap();
      }

      $gallery.html(
        urls
          .map(function (url, index) {
            return (
              "<div><img src=\"" +
              escapeHtml(url) +
              "\" alt=\"" +
              escapeHtml(title + " property image " + (index + 1)) +
              "\" class=\"img-fluid\" loading=\"lazy\" decoding=\"async\"></div>"
            );
          })
          .join(""),
      );

      if ($.fn.owlCarousel) {
        $gallery.owlCarousel({
          center: false,
          items: 1,
          loop: urls.length > 1,
          stagePadding: 0,
          margin: 0,
          autoplay: urls.length > 1,
          pauseOnHover: false,
          nav: false,
          dots: urls.length > 1,
        });
      }
    }

    function buildSchema(item, canonicalUrl, title, description, imageUrl) {
      var itemType = "Place";
      var typeText = String(item.propertyType || item.category || "").toLowerCase();
      if (/apartment|residential/.test(typeText)) itemType = "ApartmentComplex";
      else if (/villa|house/.test(typeText)) itemType = "House";
      else if (/office|commercial|it|retail/.test(typeText)) itemType = "OfficeBuilding";

      var graph = [
        {
          "@type": "Offer",
          "@id": canonicalUrl + "#offer",
          priceCurrency: "INR",
          price: item.priceValue || undefined,
          availability: "https://schema.org/InStock",
          url: canonicalUrl,
          seller: { "@id": "https://fairdealassets.com/#organization" },
          itemOffered: {
            "@type": itemType,
            "@id": canonicalUrl + "#property",
            name: title,
            description: description,
            image: imageUrl,
            address: {
              "@type": "PostalAddress",
              streetAddress: item.location || undefined,
              addressLocality: item.city || undefined,
              addressRegion: item.state || "Odisha",
              postalCode: item.postalCode || undefined,
              addressCountry: "IN",
            },
          },
        },
        {
          "@type": "BreadcrumbList",
          "@id": canonicalUrl + "#breadcrumb",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://fairdealassets.com/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Properties",
              item: "https://fairdealassets.com/#gallery-section",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: title,
              item: canonicalUrl,
            },
          ],
        },
      ];

      return removeEmpty({
        "@context": "https://schema.org",
        "@graph": graph,
      });
    }

    function removeEmpty(value) {
      if (Array.isArray(value)) {
        return value
          .map(removeEmpty)
          .filter(function (item) {
            return item !== undefined && item !== "";
          });
      }
      if (value && typeof value === "object") {
        Object.keys(value).forEach(function (key) {
          var cleaned = removeEmpty(value[key]);
          if (
            cleaned === undefined ||
            cleaned === "" ||
            (Array.isArray(cleaned) && !cleaned.length)
          ) {
            delete value[key];
          } else {
            value[key] = cleaned;
          }
        });
      }
      return value;
    }

    function updateSeo(item, canonicalPath, title, description, imageUrl) {
      var canonicalUrl = toAbsoluteUrl(canonicalPath);
      var seoTitle =
        item.seoTitle || title + " | Fairdeal Assets Verified Property Mandate";
      var seoDescription =
        item.seoDescription ||
        description ||
        "View verified property details, approval status, pricing, and site visit options with Fairdeal Assets.";
      var keywords =
        item.seoKeywords ||
        [title, item.location, item.city, item.state, "Fairdeal Assets property"]
          .filter(Boolean)
          .join(", ");
      var absoluteImage = toAbsoluteUrl(imageUrl);

      document.title = seoTitle;
      setMeta("meta[name='description']", "content", seoDescription);
      setMeta("meta[name='keywords']", "content", keywords);
      setLink("link[rel='canonical']", canonicalUrl);
      setLink("link[hreflang='en-IN']", canonicalUrl);
      setLink("link[hreflang='en']", canonicalUrl);
      setLink("link[hreflang='x-default']", canonicalUrl);
      setMeta("meta[property='og:title']", "content", seoTitle);
      setMeta("meta[property='og:description']", "content", seoDescription);
      setMeta("meta[property='og:url']", "content", canonicalUrl);
      setMeta("meta[property='og:image']", "content", absoluteImage);
      setMeta("meta[property='og:image:secure_url']", "content", absoluteImage);
      setMeta("meta[property='og:image:alt']", "content", title);
      setMeta("meta[name='twitter:title']", "content", seoTitle);
      setMeta("meta[name='twitter:description']", "content", seoDescription);
      setMeta("meta[name='twitter:image']", "content", absoluteImage);
      setMeta("meta[name='twitter:image:alt']", "content", title);
      setMeta("meta[name='twitter:url']", "content", canonicalUrl);
      setMeta("meta[property='product:price:amount']", "content", item.priceValue);

      var schema = document.getElementById("fd-property-schema");
      if (!schema) {
        schema = document.createElement("script");
        schema.type = "application/ld+json";
        schema.id = "fd-property-schema";
        document.head.appendChild(schema);
      }
      schema.textContent = JSON.stringify(
        buildSchema(item, canonicalUrl, title, seoDescription, absoluteImage),
      );
    }

    function renderProperty(item) {
      item = applyImageOverride(item);
      var title = item.title || item.name || "Verified property mandate";
      var slug = getSlug(item) || requestedSlug;
      var explicitDetailUrl = $.trim(item.detailUrl || "");
      var canonicalPath =
        explicitDetailUrl && explicitDetailUrl.charAt(0) !== "#"
          ? explicitDetailUrl
          : getDetailPath(item);
      var imageUrl = toPublicAssetUrl(item.imageUrl, "/images/property/chatgpt/aerial-plotted-development.png");
      var description =
        item.longDescription ||
        item.shortDescription ||
        [
          item.location,
          item.approvalStatus,
          item.possessionTimeline,
          item.areaLabel,
        ]
          .filter(Boolean)
          .join(" | ");
      var subtitle = [item.priceLabel, item.areaLabel, item.location]
        .filter(Boolean)
        .join(" | ");
      var heroMetrics = [
        item.possessionTimeline && "Possession " + item.possessionTimeline,
        item.approvalStatus,
        item.availabilityLabel,
      ].filter(Boolean);

      if (!heroMetrics.length) {
        heroMetrics = [item.category, item.propertyType, item.transactionType]
          .filter(Boolean)
          .slice(0, 3);
      }

      $("[data-fd-property-hero]").css(
        "background-image",
        "url(" + imageUrl.replace(/["\\]/g, "") + ")",
      );
      $("[data-fd-property-kicker]").text(
        [item.category || item.propertyType || "Verified", "mandate"].join(" "),
      );
      $("[data-fd-property-title]").text(title);
      $("[data-fd-property-subtitle]").text(
        protectHeroText(
          subtitle || "Verified property details curated by Fairdeal Assets",
        ),
      );
      $("[data-fd-property-hero-metrics]").html(
        heroMetrics
          .map(function (metric) {
            return '<li class="list-inline-item">' + escapeHtml(metric) + "</li>";
          })
          .join(""),
      );

      $detail.attr("id", slug || "property-details");
      $("[data-fd-property-detail-link]").attr(
        "href",
        "#" + (slug || "property-details"),
      );

      renderGallery(item, title);
      $("[data-fd-property-gallery-note]").text(
        item.galleryNote ||
          "Visuals are indicative; final specifications will follow the executed agreement and sanctioned drawings.",
      );

      renderList($("[data-fd-property-key-metrics]"), splitList(item.keyMetrics), [
        "Typology: " + (item.propertyType || item.category || "Verified property"),
        item.areaLabel && "Area: " + item.areaLabel,
        item.location && "Location: " + item.location,
      ].filter(Boolean));

      renderList($("[data-fd-property-approvals]"), splitList(item.approvals), [
        item.approvalStatus || "Approval status available on request",
        item.possessionTimeline && "Possession: " + item.possessionTimeline,
      ].filter(Boolean));

      renderList(
        $("[data-fd-property-commitments]"),
        splitList(item.commitments),
        [
          "Diligence packet shared after buyer qualification.",
          "Site visit and commercial discussion coordinated by Fairdeal Assets.",
          "Documentation, pricing, and approval status verified before closure.",
        ],
      );

      renderList($("[data-fd-property-summary]"), [], [
        item.location && "Location: " + item.location,
        item.priceLabel && "Ticket size: " + item.priceLabel,
        item.areaLabel && "Configuration: " + item.areaLabel,
        item.approvalStatus && "Status: " + item.approvalStatus,
      ].filter(Boolean));

      renderList(
        $("[data-fd-property-authority-list]"),
        splitList(item.authorityCoordination),
        [
          "Document review and buyer coordination handled by Fairdeal Assets.",
          "Approval and possession milestones shared during the mandate process.",
          "Commercial closure support available after site inspection.",
        ],
      );

      renderList(
        $("[data-fd-property-location-advantages]"),
        splitList(item.locationAdvantages),
        [
          item.location && "Located at " + item.location + ".",
          item.city && "Access to key demand corridors in " + item.city + ".",
          "Micro-market details shared during the property briefing.",
        ].filter(Boolean),
      );

      renderList(
        $("[data-fd-property-investment-rationale]"),
        splitList(item.investmentRationale),
        [
          "Verified mandate with pricing and documentation reviewed upfront.",
          "Fairdeal Assets assists through diligence, negotiation, and closure.",
          "Suitable for buyers who need clarity before committing site-visit time.",
        ],
      );

      var subject = encodeURIComponent(title + " Mandate Request");
      var visitSubject = encodeURIComponent(title + " Site Visit");
      $("[data-fd-property-dossier-cta]").attr(
        "href",
        item.contactUrl || "mailto:hello@fairdealassets.com?subject=" + subject,
      );
      $("[data-fd-property-site-visit-cta]").attr(
        "href",
        item.contactUrl || "mailto:hello@fairdealassets.com?subject=" + visitSubject,
      );

      updateSeo(item, canonicalPath, title, description, imageUrl);
      hideStatus();

      if (
        window.history &&
        window.location.protocol.indexOf("http") === 0 &&
        canonicalPath.charAt(0) === "/" &&
        window.location.pathname !== canonicalPath
      ) {
        window.history.replaceState(null, document.title, canonicalPath);
      }
    }

    if (!apiUrl) {
      if (!isDefaultProperty) {
        setStatus(
          "Listings API not connected",
          "This slug needs the Google Apps Script property API URL before details can be loaded.",
          true,
        );
      }
      return;
    }

    setStatus(
      "Loading verified details",
      "Fetching the latest property details from the connected inventory sheet.",
      false,
    );

    loadJsonp(apiUrl, {
      slug: requestedSlug,
      id: requestedId,
      status: "active",
      limit: 100,
    })
      .then(function (payload) {
        if (payload && payload.status === "error") {
          throw new Error(payload.message || "Property detail API returned an error.");
        }

        var item = findProperty(payload);
        if (!item) {
          setStatus(
            "Property not found",
            "This property slug is not active in the connected Google Sheet.",
            true,
          );
          return;
        }

        renderProperty(item);
      })
      .catch(function (err) {
        console.error("Property detail API failed", err);
        setStatus(
          "Live details unavailable",
          isDefaultProperty
            ? "Showing the default property page. Please contact Fairdeal Assets for the latest details."
            : "This property could not be loaded from the connected Google Sheet.",
          true,
        );
      });
  });
})(jQuery);
