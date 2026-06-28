(function () {
  "use strict";

  var DATA_URL = "data/articles.json";
  var SITE_URL = "https://fairdealassets.com/";

  var state = {
    articles: [],
  };

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/`/g, "&#096;");
  }

  function absoluteUrl(path) {
    if (!path) return SITE_URL;
    if (/^https?:\/\//i.test(path)) return path;
    return SITE_URL + path.replace(/^\/+/, "");
  }

  function articleUrl(article) {
    return "article.html?article=" + encodeURIComponent(article.slug);
  }

  function formatDate(dateText) {
    var date = new Date(dateText + "T09:00:00+05:30");
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  function sortArticles(articles) {
    return articles.slice().sort(function (a, b) {
      return String(b.date || "").localeCompare(String(a.date || ""));
    });
  }

  function getMeta(selector) {
    return document.head.querySelector(selector);
  }

  function setMetaName(name, content) {
    var meta = getMeta('meta[name="' + name + '"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", name);
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", content || "");
  }

  function setMetaProperty(property, content) {
    var meta = getMeta('meta[property="' + property + '"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("property", property);
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", content || "");
  }

  function setCanonical(url) {
    var link = getMeta('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", url);
  }

  function setText(selector, value) {
    var element = document.querySelector(selector);
    if (element) element.textContent = value || "";
  }

  function setHref(selector, value) {
    var element = document.querySelector(selector);
    if (element) element.setAttribute("href", value || "#");
  }

  function cardTemplate(article, index) {
    var delay = Math.min(index * 80, 240);
    var tags = (article.tags || [])
      .slice(0, 2)
      .map(function (tag) {
        return '<span>' + escapeHtml(tag) + "</span>";
      })
      .join("");

    return [
      '<div class="col-md-6 col-lg-4 mb-4 fd-blog-card-wrap" data-aos="fade-up" data-aos-delay="' +
        delay +
        '">',
      '<article class="fd-blog-card h-entry h-100">',
      '<a class="fd-blog-card__media" href="' +
        escapeAttr(articleUrl(article)) +
        '" aria-label="Read ' +
        escapeAttr(article.title) +
        '">',
      '<img src="' +
        escapeAttr(article.image) +
        '" alt="' +
        escapeAttr(article.imageAlt) +
        '" loading="lazy" decoding="async">',
      "</a>",
      '<div class="fd-blog-card__body">',
      '<div class="fd-blog-card__meta">',
      '<span>' + escapeHtml(article.category) + "</span>",
      '<span>' + escapeHtml(formatDate(article.date)) + "</span>",
      "</div>",
      '<h3><a href="' +
        escapeAttr(articleUrl(article)) +
        '">' +
        escapeHtml(article.title) +
        "</a></h3>",
      "<p>" + escapeHtml(article.excerpt) + "</p>",
      '<div class="fd-blog-card__footer">',
      '<div class="fd-blog-card__tags">' + tags + "</div>",
      '<a class="fd-blog-card__link" href="' +
        escapeAttr(articleUrl(article)) +
        '">Read insight</a>',
      "</div>",
      "</div>",
      "</article>",
      "</div>",
    ].join("");
  }

  function renderPreview(articles) {
    document.querySelectorAll("[data-fd-blog-preview]").forEach(function (mount) {
      var limit = parseInt(mount.getAttribute("data-limit") || "3", 10);
      var selected = sortArticles(articles).slice(0, limit);
      mount.innerHTML = selected
        .map(function (article, index) {
          return cardTemplate(article, index);
        })
        .join("");
    });
  }

  function categoryCounts(articles) {
    return articles.reduce(function (acc, article) {
      acc[article.category] = (acc[article.category] || 0) + 1;
      return acc;
    }, {});
  }

  function filterArticles(articles) {
    var params = new URLSearchParams(window.location.search);
    var category = (params.get("category") || "").trim().toLowerCase();
    var query = (params.get("q") || "").trim().toLowerCase();

    return articles.filter(function (article) {
      var matchesCategory =
        !category || String(article.category || "").toLowerCase() === category;
      var searchable = [
        article.title,
        article.excerpt,
        article.category,
        article.targetSegment,
        (article.tags || []).join(" "),
        (article.keywords || []).join(" "),
      ]
        .join(" ")
        .toLowerCase();
      var matchesQuery = !query || searchable.indexOf(query) !== -1;
      return matchesCategory && matchesQuery;
    });
  }

  function renderBlogList(articles) {
    var mount = document.querySelector("[data-fd-blog-list]");
    if (!mount) return;

    var params = new URLSearchParams(window.location.search);
    var query = params.get("q") || "";
    var activeCategory = params.get("category") || "";
    var counts = categoryCounts(articles);
    var filtered = sortArticles(filterArticles(articles));

    setText("[data-fd-blog-count]", String(filtered.length));
    var searchInput = document.querySelector("[data-fd-blog-list-search]");
    if (searchInput) searchInput.value = query;

    var categoryMount = document.querySelector("[data-fd-blog-categories]");
    if (categoryMount) {
      var allActive = activeCategory ? "" : " is-active";
      var categoryLinks = [
        '<a class="fd-blog-filter' +
          allActive +
          '" href="blog.html">All insights <span>' +
          articles.length +
          "</span></a>",
      ];

      Object.keys(counts)
        .sort()
        .forEach(function (category) {
          var active =
            category.toLowerCase() === activeCategory.toLowerCase()
              ? " is-active"
              : "";
          categoryLinks.push(
            '<a class="fd-blog-filter' +
              active +
              '" href="blog.html?category=' +
              encodeURIComponent(category) +
              '">' +
              escapeHtml(category) +
              " <span>" +
              counts[category] +
              "</span></a>"
          );
        });
      categoryMount.innerHTML = categoryLinks.join("");
    }

    if (!filtered.length) {
      mount.innerHTML =
        '<div class="col-12"><div class="fd-empty-state"><h3>No matching insights</h3><p>Try a broader topic or clear the selected filter.</p><a class="btn btn-primary" href="blog.html">View all insights</a></div></div>';
      return;
    }

    mount.innerHTML = filtered
      .map(function (article, index) {
        return cardTemplate(article, index);
      })
      .join("");
  }

  function bindBlogListSearch() {
    var form = document.querySelector("[data-fd-blog-list-form]");
    if (!form) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var input = form.querySelector("[data-fd-blog-list-search]");
      var params = new URLSearchParams(window.location.search);
      var query = input ? input.value.trim() : "";

      if (query) {
        params.set("q", query);
      } else {
        params.delete("q");
      }

      var next = params.toString();
      window.location.href = "blog.html" + (next ? "?" + next : "");
    });
  }

  function sectionTemplate(section) {
    var body = (section.body || [])
      .map(function (paragraph) {
        return "<p>" + escapeHtml(paragraph) + "</p>";
      })
      .join("");
    var list = (section.list || [])
      .map(function (item) {
        return "<li>" + escapeHtml(item) + "</li>";
      })
      .join("");

    return [
      "<section>",
      "<h3>" + escapeHtml(section.heading) + "</h3>",
      body,
      list ? '<ul class="fd-article-list">' + list + "</ul>" : "",
      "</section>",
    ].join("");
  }

  function articleDetailTemplate(article) {
    var stats = (article.stats || [])
      .map(function (stat) {
        return (
          '<div><span>' +
          escapeHtml(stat.label) +
          "</span><strong>" +
          escapeHtml(stat.value) +
          "</strong></div>"
        );
      })
      .join("");
    var sections = (article.sections || []).map(sectionTemplate).join("");
    var checklist = (article.checklist || [])
      .map(function (item) {
        return "<li>" + escapeHtml(item) + "</li>";
      })
      .join("");
    var tags = (article.tags || [])
      .map(function (tag) {
        return '<a href="blog.html?q=' + encodeURIComponent(tag) + '">#' + escapeHtml(tag) + "</a>";
      })
      .join("");

    return [
      '<span class="fd-eyebrow">' + escapeHtml(article.category) + "</span>",
      '<p class="lead">' + escapeHtml(article.lead) + "</p>",
      '<figure class="fd-article-figure">',
      '<img src="' +
        escapeAttr(article.image) +
        '" alt="' +
        escapeAttr(article.imageAlt) +
        '" loading="eager" decoding="async">',
      "<figcaption>" + escapeHtml(article.imageAlt) + "</figcaption>",
      "</figure>",
      '<div class="fd-article-stats">' + stats + "</div>",
      "<blockquote><p>" + escapeHtml(article.pullQuote) + "</p></blockquote>",
      sections,
      '<div class="fd-article-checklist">',
      "<h3>" + escapeHtml(article.checklistTitle) + "</h3>",
      "<ul>" + checklist + "</ul>",
      "</div>",
      '<div class="fd-article-cta">',
      "<h3>" + escapeHtml(article.ctaTitle) + "</h3>",
      "<p>" + escapeHtml(article.ctaText) + "</p>",
      '<a href="index.html#contact-section" class="btn btn-primary">Discuss this with Fairdeal</a>',
      "</div>",
      '<div class="pt-5 fd-article-taxonomy">',
      "<p>Categories: <a href=\"blog.html?category=" +
        encodeURIComponent(article.category) +
        '">' +
        escapeHtml(article.category) +
        "</a></p>",
      "<p>Tags: " + tags + "</p>",
      "</div>",
    ].join("");
  }

  function renderArticleSidebar(articles, currentArticle) {
    var categoryMount = document.querySelector("[data-fd-sidebar-categories]");
    var recentMount = document.querySelector("[data-fd-sidebar-recent]");
    var counts = categoryCounts(articles);

    if (categoryMount) {
      categoryMount.innerHTML = Object.keys(counts)
        .sort()
        .map(function (category) {
          return (
            '<li><a href="blog.html?category=' +
            encodeURIComponent(category) +
            '">' +
            escapeHtml(category) +
            " <span>(" +
            counts[category] +
            ")</span></a></li>"
          );
        })
        .join("");
    }

    if (recentMount) {
      recentMount.innerHTML = sortArticles(articles)
        .filter(function (article) {
          return article.slug !== currentArticle.slug;
        })
        .slice(0, 4)
        .map(function (article) {
          return [
            '<a class="fd-recent-post" href="' + escapeAttr(articleUrl(article)) + '">',
            '<img src="' +
              escapeAttr(article.image) +
              '" alt="" loading="lazy" decoding="async">',
            "<span>",
            "<strong>" + escapeHtml(article.title) + "</strong>",
            "<small>" + escapeHtml(article.category) + "</small>",
            "</span>",
            "</a>",
          ].join("");
        })
        .join("");
    }
  }

  function bindArticleSearch(articles) {
    var form = document.querySelector("[data-fd-article-search-form]");
    if (!form) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var input = form.querySelector("[data-fd-article-search]");
      var query = input ? input.value.trim() : "";
      window.location.href = "blog.html" + (query ? "?q=" + encodeURIComponent(query) : "");
    });
  }

  function renderArticleSchema(article) {
    var pageUrl = absoluteUrl(articleUrl(article));
    var schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Article",
          "@id": pageUrl + "#article",
          headline: article.title,
          description: article.description,
          image: [absoluteUrl(article.image)],
          datePublished: article.date + "T09:00:00+05:30",
          dateModified: article.date + "T09:00:00+05:30",
          articleSection: article.category,
          keywords: article.keywords || [],
          author: {
            "@type": "Organization",
            name: "Fairdeal Assets",
          },
          publisher: {
            "@type": "Organization",
            name: "Fairdeal Assets",
            logo: {
              "@type": "ImageObject",
              url: absoluteUrl("images/icons/android-chrome-512x512.png"),
            },
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": pageUrl,
          },
          inLanguage: "en-IN",
        },
        {
          "@type": "BreadcrumbList",
          "@id": pageUrl + "#breadcrumb",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: SITE_URL,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Insights",
              item: absoluteUrl("blog.html"),
            },
            {
              "@type": "ListItem",
              position: 3,
              name: article.title,
              item: pageUrl,
            },
          ],
        },
      ],
    };

    var script = document.getElementById("fd-article-schema");
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = "fd-article-schema";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);
  }

  function updateArticleMeta(article) {
    var pageUrl = absoluteUrl(articleUrl(article));
    var imageUrl = absoluteUrl(article.image);

    document.title = article.seoTitle || article.title;
    setMetaName("description", article.description);
    setMetaName("keywords", (article.keywords || []).join(", "));
    setCanonical(pageUrl);

    setMetaProperty("og:type", "article");
    setMetaProperty("og:title", article.seoTitle || article.title);
    setMetaProperty("og:description", article.description);
    setMetaProperty("og:url", pageUrl);
    setMetaProperty("og:image", imageUrl);
    setMetaProperty("og:image:secure_url", imageUrl);
    setMetaProperty("og:image:alt", article.imageAlt);
    setMetaProperty("article:published_time", article.date + "T09:00:00+05:30");
    setMetaProperty("article:modified_time", article.date + "T09:00:00+05:30");
    setMetaProperty("article:section", article.category);

    setMetaName("twitter:card", "summary_large_image");
    setMetaName("twitter:title", article.seoTitle || article.title);
    setMetaName("twitter:description", article.description);
    setMetaName("twitter:image", imageUrl);
    setMetaName("twitter:image:alt", article.imageAlt);
    setMetaName("twitter:url", pageUrl);

    renderArticleSchema(article);
  }

  function renderArticlePage(articles) {
    var mount = document.querySelector("[data-fd-blog-detail]");
    if (!mount) return;

    var params = new URLSearchParams(window.location.search);
    var slug = params.get("article") || params.get("slug") || "";
    var sorted = sortArticles(articles);
    var article =
      sorted.find(function (item) {
        return item.slug === slug || item.id === slug;
      }) || sorted[0];

    if (!article) {
      mount.innerHTML = '<div class="fd-empty-state"><h3>No insights available yet</h3></div>';
      return;
    }

    var hero = document.querySelector("[data-fd-article-hero]");
    if (hero) hero.style.backgroundImage = 'url("' + article.image + '")';

    setText("[data-fd-article-eyebrow]", "Fairdeal insight");
    setText("[data-fd-article-title]", article.title);
    setText(
      "[data-fd-article-meta]",
      formatDate(article.date) + " | " + article.readTime + " | " + article.author
    );
    setHref("[data-fd-article-primary-link]", "#article-section");

    mount.innerHTML = articleDetailTemplate(article);
    updateArticleMeta(article);
    renderArticleSidebar(articles, article);
    bindArticleSearch(articles);
  }

  function refreshAnimations() {
    if (window.AOS && typeof window.AOS.refreshHard === "function") {
      window.AOS.refreshHard();
    }
  }

  function init() {
    fetch(DATA_URL, { cache: "no-store" })
      .then(function (response) {
        if (!response.ok) throw new Error("Unable to load blog data");
        return response.json();
      })
      .then(function (data) {
        state.articles = Array.isArray(data.articles) ? data.articles : [];
        renderPreview(state.articles);
        renderBlogList(state.articles);
        renderArticlePage(state.articles);
        bindBlogListSearch();
        refreshAnimations();
      })
      .catch(function () {
        document.querySelectorAll("[data-fd-blog-preview], [data-fd-blog-list], [data-fd-blog-detail]").forEach(function (mount) {
          mount.innerHTML =
            '<div class="col-12"><div class="fd-empty-state"><h3>Insights are loading</h3><p>Please refresh this page from the website server if the articles do not appear.</p></div></div>';
        });
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
