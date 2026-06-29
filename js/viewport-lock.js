(function () {
  "use strict";

  if (window.fdViewportLockApplied) return;
  window.fdViewportLockApplied = true;

  var docEl = document.documentElement;
  var nav = window.navigator || {};
  var screenObj = window.screen || {};

  var getScreenMetrics = function () {
    var screenWidth = screenObj.width || window.innerWidth || 0;
    var screenHeight = screenObj.height || window.innerHeight || 0;

    return {
      min: Math.min(screenWidth, screenHeight),
      max: Math.max(screenWidth, screenHeight),
    };
  };

  var metrics = getScreenMetrics();
  var touchPoints = nav.maxTouchPoints || nav.msMaxTouchPoints || 0;
  var userAgent = nav.userAgent || "";
  var isMobileUserAgent = /Android|iPhone|iPod|IEMobile|Opera Mini|Mobile/i.test(
    userAgent,
  );
  var isTabletUserAgent =
    /iPad|Tablet/i.test(userAgent) ||
    (nav.platform === "MacIntel" && touchPoints > 1);
  var isPhoneLikeScreen =
    touchPoints > 0 && metrics.min > 0 && metrics.min <= 900 && metrics.max <= 1200;
  var isTabletLikeScreen =
    touchPoints > 0 && metrics.min > 0 && metrics.min <= 1024 && metrics.max <= 1400;
  var shouldForceMobileUi =
    isMobileUserAgent ||
    isTabletUserAgent ||
    isPhoneLikeScreen ||
    isTabletLikeScreen;

  var getViewportMeta = function () {
    var viewport = document.querySelector("meta[name='viewport']");

    if (!viewport) {
      viewport = document.createElement("meta");
      viewport.setAttribute("name", "viewport");
      document.head.insertBefore(viewport, document.head.firstChild);
    }

    return viewport;
  };

  var setLockedViewport = function () {
    if (!shouldForceMobileUi) return;

    var currentMetrics = getScreenMetrics();
    var viewportWidth = "device-width";
    var likelyDesktopMode =
      currentMetrics.min > 0 && window.innerWidth > currentMetrics.min + 80;

    if (likelyDesktopMode) {
      viewportWidth = Math.max(320, Math.round(currentMetrics.min));
      docEl.classList.add("fd-force-physical-viewport");
    }

    getViewportMeta().setAttribute(
      "content",
      "width=" +
        viewportWidth +
        ", initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, shrink-to-fit=no, viewport-fit=cover",
    );
  };

  if (shouldForceMobileUi) {
    docEl.classList.add("fd-force-mobile-ui", "fd-viewport-locked");
    setLockedViewport();

    window.addEventListener("orientationchange", function () {
      setTimeout(setLockedViewport, 250);
    });
    window.addEventListener("resize", setLockedViewport);
    window.addEventListener("pageshow", setLockedViewport);
  }

  if (isTabletUserAgent || isTabletLikeScreen) {
    docEl.classList.add("fd-force-tablet-ui");
  }

  var preventGestureZoom = function (event) {
    event.preventDefault();
  };

  var preventMultiTouchZoom = function (event) {
    if (event.touches && event.touches.length > 1) {
      event.preventDefault();
    }
  };

  if (shouldForceMobileUi) {
    document.addEventListener("touchmove", preventMultiTouchZoom, {
      passive: false,
    });
    document.addEventListener("gesturestart", preventGestureZoom);
    document.addEventListener("gesturechange", preventGestureZoom);
    document.addEventListener("gestureend", preventGestureZoom);
  }
})();
