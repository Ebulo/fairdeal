AOS.init({
  duration: 700,
  easing: "ease-out-cubic",
  offset: 80,
  once: true,
  disable: function () {
    return (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.innerWidth < 768
    );
  },
});

jQuery(document).ready(function ($) {
  "use strict";

  var siteMenuClone = function () {
    $(".js-clone-nav").each(function () {
      var $this = $(this);
      $this
        .clone()
        .attr("class", "site-nav-wrap")
        .appendTo(".site-mobile-menu-body");
    });

    setTimeout(function () {
      var counter = 0;
      $(".site-mobile-menu .has-children").each(function () {
        var $this = $(this);

        $this.prepend('<span class="arrow-collapse collapsed">');

        $this.find(".arrow-collapse").attr({
          "data-toggle": "collapse",
          "data-target": "#collapseItem" + counter,
        });

        $this.find("> ul").attr({
          class: "collapse",
          id: "collapseItem" + counter,
        });

        counter++;
      });
    }, 1000);

    $("body").on("click", ".arrow-collapse", function (e) {
      var $this = $(this);
      if ($this.closest("li").find(".collapse").hasClass("show")) {
        $this.removeClass("active");
      } else {
        $this.addClass("active");
      }
      e.preventDefault();
    });

    $(window).resize(function () {
      var $this = $(this),
        w = $this.width();

      if (w > 768) {
        if ($("body").hasClass("offcanvas-menu")) {
          $("body").removeClass("offcanvas-menu");
        }
      }
    });

    $("body").on("click", ".js-menu-toggle", function (e) {
      var $this = $(this);
      e.preventDefault();

      if ($("body").hasClass("offcanvas-menu")) {
        $("body").removeClass("offcanvas-menu");
        $this.removeClass("active");
      } else {
        $("body").addClass("offcanvas-menu");
        $this.addClass("active");
      }
    });

    // click outisde offcanvas
    $(document).mouseup(function (e) {
      var container = $(".site-mobile-menu");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ($("body").hasClass("offcanvas-menu")) {
          $("body").removeClass("offcanvas-menu");
        }
      }
    });
  };
  siteMenuClone();

  var sitePlusMinus = function () {
    $(".js-btn-minus").on("click", function (e) {
      e.preventDefault();
      if ($(this).closest(".input-group").find(".form-control").val() != 0) {
        $(this)
          .closest(".input-group")
          .find(".form-control")
          .val(
            parseInt(
              $(this).closest(".input-group").find(".form-control").val()
            ) - 1
          );
      } else {
        $(this).closest(".input-group").find(".form-control").val(parseInt(0));
      }
    });
    $(".js-btn-plus").on("click", function (e) {
      e.preventDefault();
      $(this)
        .closest(".input-group")
        .find(".form-control")
        .val(
          parseInt(
            $(this).closest(".input-group").find(".form-control").val()
          ) + 1
        );
    });
  };
  // sitePlusMinus();

  var siteSliderRange = function () {
    var $slider = $("#slider-range");
    if (!$slider.length || typeof $slider.slider !== "function") return;

    var parseNumber = function (value, fallback) {
      var parsed = parseInt(value, 10);
      return isNaN(parsed) ? fallback : parsed;
    };

    var min = parseNumber($slider.data("min"), 0);
    var max = parseNumber($slider.data("max"), 100000);
    var step = parseNumber($slider.data("step"), 100);
    var valuesAttr = ($slider.data("values") || "").toString().split(",");
    var defaultValues =
      valuesAttr.length === 2
        ? [parseNumber(valuesAttr[0], min), parseNumber(valuesAttr[1], max)]
        : [min, max];

    var $amount = $("#amount");
    var currency = (
      $slider.data("currency") ||
      $amount.data("currency") ||
      "$"
    ).toString();
    var unit = ($slider.data("unit") || $amount.data("unit") || "").toString();

    var formatValue = function (val) {
      var numeric = Number(val) || 0;
      var formatted = numeric.toLocaleString("en-IN");
      if (unit) formatted += " " + unit;
      return currency + formatted;
    };

    $slider.slider({
      range: true,
      min: min,
      max: max,
      step: step,
      values: defaultValues,
      slide: function (event, ui) {
        if ($amount.length) {
          $amount.val(
            formatValue(ui.values[0]) + " - " + formatValue(ui.values[1])
          );
        }
      },
    });

    if ($amount.length) {
      var currentValues = $slider.slider("values");
      $amount.val(
        formatValue(currentValues[0]) + " - " + formatValue(currentValues[1])
      );
    }
  };
  siteSliderRange();

  var siteCarousel = function () {
    if ($(".nonloop-block-13").length > 0) {
      $(".nonloop-block-13").owlCarousel({
        center: false,
        items: 1,
        loop: true,
        stagePadding: 0,
        margin: 30,
        autoplay: true,
        nav: false,
        responsive: {
          600: {
            margin: 30,

            items: 2,
          },
          1000: {
            margin: 30,
            stagePadding: 0,

            items: 3,
          },
          1200: {
            margin: 30,
            stagePadding: 0,

            items: 4,
          },
        },
      });
    }

    $(".slide-one-item, .with-dots").owlCarousel({
      center: false,
      items: 1,
      loop: true,
      stagePadding: 0,
      margin: 0,
      autoplay: true,
      pauseOnHover: false,
      nav: false,
      dots: true,
      navText: [
        '<span class="icon-keyboard_arrow_left">',
        '<span class="icon-keyboard_arrow_right">',
      ],
    });

    $(".slide-one-item-alt").owlCarousel({
      center: false,
      items: 1,
      loop: true,
      stagePadding: 0,
      smartSpeed: 700,
      margin: 0,
      autoplay: true,
      pauseOnHover: false,
    });

    $(".custom-prev1").click(function (e) {
      e.preventDefault();
      $(".nonloop-block-13").trigger("prev.owl.carousel");
    });
    $(".custom-next1").click(function (e) {
      e.preventDefault();
      $(".nonloop-block-13").trigger("next.owl.carousel");
    });

    $(".custom-next").click(function (e) {
      e.preventDefault();
      $(".slide-one-item-alt").trigger("next.owl.carousel");
    });
    $(".custom-prev").click(function (e) {
      e.preventDefault();
      $(".slide-one-item-alt").trigger("prev.owl.carousel");
    });
  };
  siteCarousel();

  var siteStellar = function () {
    var enableParallax =
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      $(window).width() >= 1024;
    if (!enableParallax) return;
    if (typeof $.fn.stellar !== "function") return; // guard if plugin not loaded on this page
    $(window).stellar({
      responsive: true,
      parallaxBackgrounds: true,
      parallaxElements: true,
      horizontalScrolling: false,
      hideDistantElements: true,
      scrollProperty: "scroll",
    });
  };
  siteStellar();

  // Soft page load reveal
  $(window).on("load", function () {
    $(".site-wrap").addClass("is-loaded");
  });

  // Stable viewport height on mobile (address bar safe)
  var setVhUnit = function () {
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", vh + "px");
  };
  setVhUnit();
  $(window).on("resize orientationchange", function () {
    setVhUnit();
  });

  var siteCountDown = function () {
    $("#date-countdown").countdown("2020/10/10", function (event) {
      var $this = $(this).html(
        event.strftime(
          "" +
            '<span class="countdown-block"><span class="label">%w</span> weeks </span>' +
            '<span class="countdown-block"><span class="label">%d</span> days </span>' +
            '<span class="countdown-block"><span class="label">%H</span> hr </span>' +
            '<span class="countdown-block"><span class="label">%M</span> min </span>' +
            '<span class="countdown-block"><span class="label">%S</span> sec</span>'
        )
      );
    });
  };
  siteCountDown();

  var siteDatePicker = function () {
    if ($(".datepicker").length > 0) {
      $(".datepicker").datepicker();
    }
  };
  siteDatePicker();

  var siteSticky = function () {
    $(".js-sticky-header").sticky({ topSpacing: 0 });
  };
  siteSticky();

  // navigation
  var OnePageNavigation = function () {
    var navToggler = $(".site-menu-toggle");
    $("body").on(
      "click",
      ".main-menu li a[href^='#'], .smoothscroll[href^='#'], .site-mobile-menu .site-nav-wrap li a",
      function (e) {
        e.preventDefault();

        var hash = this.hash;

        $("html, body").animate(
          {
            scrollTop: $(hash).offset().top,
          },
          600,
          "easeInOutCirc",
          function () {
            window.location.hash = hash;
          }
        );
      }
    );
  };
  OnePageNavigation();

  var siteScroll = function () {
    var $win = $(window);
    var $nav = $(".js-sticky-header");

    if (!$nav.length) return;

    var getThreshold = function () {
      // return Math.max(window.innerHeight || 0, $win.height() || 0);
      return $win.height() * 0.2;
    };

    var applyNavState = function () {
      var st = $win.scrollTop();
      var isPast = st > getThreshold();
      $nav.toggleClass("is-glass", isPast);
      $nav.toggleClass("shrink", isPast);
    };

    $win.on("scroll", applyNavState);
    $win.on("resize orientationchange", applyNavState);
    applyNavState();
  };
  siteScroll();

  // Button ripple effect (skips if reduced motion)
  var allowMotion = !window.matchMedia("(prefers-reduced-motion: reduce)")
    .matches;
  $("body").on("click", ".btn", function (e) {
    if (!allowMotion) return;
    var $btn = $(this);
    var off = $btn.offset();
    var x = e.pageX - off.left;
    var y = e.pageY - off.top;
    var $r = $('<span class="ripple"/>').css({
      left: x,
      top: y,
      width: 20,
      height: 20,
    });
    $btn.append($r);
    setTimeout(function () {
      $r.remove();
    }, 600);
  });

  // Randomize gallery item shapes for pleasing layout
  var sizes = ["small", "tall", "wide", "big", "small", "tall"];
  $(".gallery-grid .gallery-item").each(function (i) {
    var c = sizes[i % sizes.length];
    $(this).addClass(c);
  });

  // Subtle 3D tilt interaction for expertise cards
  (function () {
    var allowTilt =
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      window.matchMedia("(pointer: fine)").matches;
    if (!allowTilt) return;
    var $cards = $("#services-section .unit-4");
    if (!$cards.length) return;

    $cards.each(function () {
      var $card = $(this);
      $card.on("mousemove", function (evt) {
        var rect = evt.currentTarget.getBoundingClientRect();
        var x = evt.clientX - rect.left;
        var y = evt.clientY - rect.top;
        var tiltX = (y / rect.height - 0.5) * 10; // rotateX
        var tiltY = (x / rect.width - 0.5) * -10; // rotateY
        $card.css("--tilt-x", tiltX.toFixed(2) + "deg");
        $card.css("--tilt-y", tiltY.toFixed(2) + "deg");
      });

      $card.on("mouseleave blur", function () {
        $card.css("--tilt-x", "0deg");
        $card.css("--tilt-y", "0deg");
      });
    });
  })();

  // WhatsApp button + contact popup
  (function () {
    var whatsappUrl =
      "https://wa.me/917684095344/?text=Hey+There,+I+needed+assistance+in+properties+can+we+conect";
    var phoneDisplay = "+91 7684095344";
    var phoneTel = "+917684095344";
    var whatsappDisplay = "+91 7684095344";
    var emailAddress = "fairdeal.asset@gmail.com";
    var officeHours = "Monday to Saturday, 10:00 AM - 6:00 PM IST";
    var serviceArea = "Odisha and adjoining regions";

    var $body = $("body");

    if (!$(".fd-whatsapp-fab").length) {
      var fabHtml = [
        '<a class="fd-whatsapp-fab" href="',
        whatsappUrl,
        '" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">',
        '<span class="icon-whatsapp" aria-hidden="true"></span>',
        "</a>",
      ].join("");
      $body.append(fabHtml);
    }

    var $modal = $(".fd-contact-modal");
    if (!$modal.length) {
      var modalHtml = [
        '<div class="fd-contact-modal" aria-hidden="true">',
        '<div class="fd-contact-modal__dialog fd-contact-modal__dialog--single" role="dialog" aria-modal="true" aria-labelledby="fdContactModalTitle" tabindex="-1">',
        '<button type="button" class="fd-contact-modal__close" aria-label="Close contact form" data-fd-modal-close>&times;</button>',
        '<div class="fd-contact-modal__info">',
        '<p class="fd-contact-modal__eyebrow">Get in Touch</p>',
        '<h3 id="fdContactModalTitle" class="fd-contact-modal__title">Ready to find your dream property?</h3>',
        '<p class="fd-contact-modal__subtitle">Connect with our team for trusted guidance and quick responses.</p>',
        '<div class="fd-contact-modal__details">',
        '<p style="font-size: 0.8rem;"><strong>Phone/Whatsapp</strong><br><a href="tel:',
        phoneTel,
        '">',
        phoneDisplay,
        "</a></p>",
        '<p style="font-size: 0.8rem;"><strong>Email</strong><br><a href="mailto:',
        emailAddress,
        '">',
        emailAddress,
        "</a></p>",
        '<p style="font-size: 0.8rem;"><strong>Office Hours</strong><br>',
        officeHours,
        "</p>",
        '<p style="font-size: 0.8rem;"><strong>Service Locations</strong><br>',
        serviceArea,
        "</p>",
        "</div>",
        '<div class="fd-modal-actions">',
        '<a class="btn fd-btn-whatsapp" href="',
        whatsappUrl,
        '" target="_blank" rel="noopener"><span class="icon-whatsapp" aria-hidden="true"></span> WhatsApp Us</a>',
        '<a class="btn fd-btn-call" href="tel:',
        phoneTel,
        '"><span class="icon-phone" aria-hidden="true"></span> Call Now</a>',
        '<a class="btn fd-btn-email" href="mailto:',
        emailAddress,
        '"><span class="icon-envelope" aria-hidden="true"></span> Send Email</a>',
        "</div>",
        "</div>",
        "</div>",
        "</div>",
      ].join("");
      $body.append(modalHtml);
      $modal = $(".fd-contact-modal");
    }

    if (!$modal.length) return;

    var $dialog = $modal.find(".fd-contact-modal__dialog");
    var closeModal = function () {
      $modal.removeClass("is-visible").attr("aria-hidden", "true");
      $("body").removeClass("fd-modal-open");
    };

    var openModal = function () {
      $modal.addClass("is-visible").attr("aria-hidden", "false");
      $("body").addClass("fd-modal-open");
      if ($dialog.length) {
        $dialog.trigger("focus");
      }
    };

    $(document).on("click", "[data-fd-open-modal]", function (evt) {
      evt.preventDefault();
      openModal();
    });

    $modal.on("click", "[data-fd-modal-close]", function () {
      closeModal();
    });

    $modal.on("click", function (evt) {
      if (evt.target === this) {
        closeModal();
      }
    });

    $modal.on("click", "[data-fd-scroll-contact]", function () {
      closeModal();
    });

    $(document).on("keydown", function (evt) {
      if (!$modal.hasClass("is-visible")) return;
      if (evt.key === "Escape") {
        closeModal();
      }
    });

    $(window).on("load", function () {
      setTimeout(openModal, 700);
    });
  })();

  // Contact form email handling
  (function () {
    var $forms = $("[data-fd-contact-form]");
    if (!$forms.length) {
      var $legacyForm = $("#contactForm");
      if ($legacyForm.length) {
        $legacyForm.attr("data-fd-contact-form", "legacy");
        $forms = $legacyForm;
      }
    }
    if (!$forms.length) return;

    var $toast = $("#fdToast");
    if (!$toast.length) {
      $toast = $(
        '<div id="fdToast" class="fd-toast" role="status" aria-live="polite" aria-hidden="true"></div>'
      );
      $("body").append($toast);
    }

    var showToast = function (message, isError) {
      if (!$toast.length) return;
      $toast.text(message);
      $toast.toggleClass("is-error", !!isError);
      $toast.addClass("is-visible").attr("aria-hidden", "false");
      clearTimeout($toast.data("timeoutId"));
      var timeoutId = setTimeout(function () {
        $toast.removeClass("is-visible");
        setTimeout(function () {
          $toast.attr("aria-hidden", "true");
        }, 300);
      }, 4000);
      $toast.data("timeoutId", timeoutId);
    };

    var initContactForm = function ($form) {
      var $submit = $form.find("[data-fd-submit]");
      if (!$submit.length) {
        $submit = $form.find("#contactSubmit");
      }
      if (!$submit.length) return;

      var submitText = $.trim($submit.text()) || "Send Message";

      var findField = function (name) {
        var $field = $form.find('[data-fd-field="' + name + '"]');
        if (!$field.length) {
          $field = $form.find('[name="' + name + '"]');
        }
        return $field;
      };

      var $firstName = findField("firstName");
      var $lastName = findField("lastName");
      var $email = findField("email");
      var $subject = findField("subject");
      var $message = findField("message");

      var $captchaQuestion = $form.find("[data-fd-captcha-question]");
      if (!$captchaQuestion.length) {
        $captchaQuestion = $form.find("#captchaQuestion");
      }
      var $captchaAnswer = $form.find("[data-fd-captcha-answer]");
      if (!$captchaAnswer.length) {
        $captchaAnswer = $form.find("#captchaAnswer");
      }
      var $captchaRefresh = $form.find("[data-fd-captcha-refresh]");
      if (!$captchaRefresh.length) {
        $captchaRefresh = $form.find("#captchaRefresh");
      }

      var captchaSolution = null;
      var generateCaptcha = function () {
        if (!$captchaQuestion.length) return;
        var first = Math.floor(Math.random() * 8) + 2; // 2-9 for variety
        var second = Math.floor(Math.random() * 8) + 1; // 1-8
        captchaSolution = first + second;
        $captchaQuestion.text(first + " + " + second + " = ?");
        if ($captchaAnswer.length) {
          $captchaAnswer.val("");
        }
      };

      if ($captchaQuestion.length) {
        generateCaptcha();
      }

      if ($captchaRefresh.length) {
        $captchaRefresh.on("click", function () {
          generateCaptcha();
          if ($captchaAnswer.length) {
            $captchaAnswer.trigger("focus");
          }
        });
      }

      var readVal = function ($field) {
        return $field.length ? $.trim($field.val() || "") : "";
      };

      $form.on("submit", function (evt) {
        evt.preventDefault();

        var firstName = readVal($firstName);
        var lastName = readVal($lastName);
        var email = readVal($email);
        var subject = readVal($subject) || "New Contact Inquiry";
        var message = readVal($message);
        var captchaResponse = $captchaAnswer.length
          ? $.trim($captchaAnswer.val())
          : "";

        if (!firstName || !lastName || !email || !message) {
          showToast("Please fill in all required fields.", true);
          return;
        }

        if ($captchaQuestion.length) {
          var parsedCaptcha = parseInt(captchaResponse, 10);
          if (
            !captchaResponse ||
            isNaN(parsedCaptcha) ||
            parsedCaptcha !== captchaSolution
          ) {
            showToast("Captcha answer is incorrect. Please try again.", true);
            generateCaptcha();
            return;
          }
        }

        var fullName = $.trim(firstName + " " + lastName);

        $submit.prop("disabled", true).text("Sending...");

        fetch("https://formsubmit.co/ajax/fairdeal.asset@gmail.com", {
          //   fetch("https://formsubmit.co/ajax/bishant.nayak44@gmail.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: fullName,
            email: email,
            message: message,
            _subject: "Website Enquiry: " + subject,
            _template: "table",
            _captcha: "false",
          }),
        })
          .then(function (resp) {
            if (!resp.ok) {
              throw new Error("Network response was not ok");
            }
            return resp.json();
          })
          .then(function () {
            showToast("Message sent successfully!", false);
            $form[0].reset();
            generateCaptcha();
          })
          .catch(function (err) {
            console.error("Email send failed", err);
            showToast("Unable to send message. Please try again later.", true);
            generateCaptcha();
          })
          .finally(function () {
            $submit.prop("disabled", false).text(submitText);
          });
      });
    };

    $forms.each(function () {
      initContactForm($(this));
    });
  })();

  // Lead magnet slide-in + newsletter capture
  (function () {
    var $body = $("body");

    if (!$(".fd-lead-slidein").length) {
      var slideInHtml = [
        '<div class="fd-lead-slidein" aria-live="polite">',
        '<button type="button" class="fd-lead-slidein__close" aria-label="Close lead form" data-fd-lead-close>&times;</button>',
        "<h4>Get the Bhubaneswar Market Report</h4>",
        "<p>Request pricing benchmarks and approval checklists in 60 seconds.</p>",
        '<form data-fd-lead-form data-fd-lead-name="Market Report Slide-in" data-fd-success-message="Thanks! The report is on the way.">',
        '<div class="form-group">',
        '<label class="sr-only" for="slideInEmail">Email</label>',
        '<input type="email" id="slideInEmail" name="email" class="form-control" placeholder="Email address" autocomplete="email" required>',
        "</div>",
        '<input type="hidden" name="leadSource" value="Market Report Slide-in">',
        '<button type="submit" class="btn btn-primary btn-sm" data-fd-submit>Send Me the Report</button>',
        "</form>",
        "</div>",
      ].join("");
      $body.append(slideInHtml);
    }

    var $slidein = $(".fd-lead-slidein");
    var storageKey = "fdLeadSlideinDismissed";
    var wasDismissed = false;

    try {
      wasDismissed = window.sessionStorage.getItem(storageKey) === "1";
    } catch (err) {
      wasDismissed = false;
    }

    var showSlidein = function () {
      if (!$slidein.length || wasDismissed) return;
      $slidein.addClass("is-visible");
    };

    var hideSlidein = function () {
      if (!$slidein.length) return;
      $slidein.removeClass("is-visible");
      try {
        window.sessionStorage.setItem(storageKey, "1");
        wasDismissed = true;
      } catch (err) {}
    };

    $slidein.on("click", "[data-fd-lead-close]", function () {
      hideSlidein();
    });

    if ($slidein.length && !wasDismissed) {
      setTimeout(function () {
        if ($(".fd-contact-modal").hasClass("is-visible")) return;
        showSlidein();
      }, 4200);
    }

    var getToast = function () {
      var $toast = $("#fdToast");
      if (!$toast.length) {
        $toast = $(
          '<div id="fdToast" class="fd-toast" role="status" aria-live="polite" aria-hidden="true"></div>'
        );
        $("body").append($toast);
      }
      return $toast;
    };

    var showToast = function (message, isError) {
      var $toast = getToast();
      if (!$toast.length) return;
      $toast.text(message);
      $toast.toggleClass("is-error", !!isError);
      $toast.addClass("is-visible").attr("aria-hidden", "false");
      clearTimeout($toast.data("timeoutId"));
      var timeoutId = setTimeout(function () {
        $toast.removeClass("is-visible");
        setTimeout(function () {
          $toast.attr("aria-hidden", "true");
        }, 300);
      }, 4000);
      $toast.data("timeoutId", timeoutId);
    };

    var initLeadForm = function ($form) {
      var $submit = $form.find("[data-fd-submit]");
      if (!$submit.length) {
        $submit = $form.find("button[type='submit']");
      }
      if (!$submit.length) return;

      var submitText = $.trim($submit.text()) || "Submit";
      var leadName =
        $form.data("fdLeadName") || $form.data("fd-lead-name") || "Website Lead";
      var successMessage =
        $form.data("fdSuccessMessage") ||
        "Thanks! We'll be in touch shortly.";

      var findField = function (name) {
        var $field = $form.find('[data-fd-field="' + name + '"]');
        if (!$field.length) {
          $field = $form.find('[name="' + name + '"]');
        }
        return $field;
      };

      var $name = findField("name");
      var $email = findField("email");
      var $phone = findField("phone");
      var $source = findField("leadSource");

      var readVal = function ($field) {
        return $field.length ? $.trim($field.val() || "") : "";
      };

      $form.on("submit", function (evt) {
        evt.preventDefault();

        var name = readVal($name) || "Subscriber";
        var email = readVal($email);
        var phone = readVal($phone);
        var leadSource = readVal($source) || "Website";

        if (!email) {
          showToast("Please enter a valid email address.", true);
          return;
        }

        var messageParts = [
          "Lead: " + leadName,
          "Name: " + name,
          "Email: " + email,
          "Source: " + leadSource,
        ];

        if (phone) {
          messageParts.push("Phone: " + phone);
        }

        $submit.prop("disabled", true).text("Sending...");

        fetch("https://formsubmit.co/ajax/fairdeal.asset@gmail.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: name,
            email: email,
            message: messageParts.join("\n"),
            _subject: "Website Lead: " + leadName,
            _template: "table",
            _captcha: "false",
          }),
        })
          .then(function (resp) {
            if (!resp.ok) {
              throw new Error("Network response was not ok");
            }
            return resp.json();
          })
          .then(function () {
            showToast(successMessage, false);
            $form[0].reset();
            if ($form.closest(".fd-lead-slidein").length) {
              hideSlidein();
            }
          })
          .catch(function (err) {
            console.error("Lead send failed", err);
            showToast(
              "Unable to send right now. Please try again later.",
              true
            );
          })
          .finally(function () {
            $submit.prop("disabled", false).text(submitText);
          });
      });
    };

    $("[data-fd-lead-form], [data-fd-newsletter-form]").each(function () {
      initLeadForm($(this));
    });
  })();

  // Render gallery items from generated manifest
  (function () {
    var data = window.FD_GALLERY_IMAGES || [];
    if (!data.length) return;

    var escapeAttr = function (str) {
      return String(str || "")
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    };

    var createItem = function (item) {
      var src = item && item.src ? item.src : "";
      if (!src) return "";
      var caption =
        item && item.caption ? item.caption : "Property gallery image";
      var safeCaption = escapeAttr(caption);
      var safeSrc = escapeAttr(src);
      return (
        '<div class="gallery-item">' +
        '<button type="button" class="gallery-link" data-image="' +
        safeSrc +
        '" data-caption="' +
        safeCaption +
        '">' +
        '<img src="' +
        safeSrc +
        '" alt="' +
        safeCaption +
        '" loading="lazy" decoding="async">' +
        "</button>" +
        "</div>"
      );
    };

    var sizeClasses = ["small", "tall", "wide", "big"];
    var sizePattern = [
      "big",
      "tall",
      "wide",
      "small",
      "small",
      "tall",
      "small",
      "wide",
      "small",
    ];

    $("[data-gallery-limit]").each(function () {
      var $grid = $(this);
      var limit = parseInt($grid.data("gallery-limit"), 10);
      if (isNaN(limit) || limit <= 0) limit = data.length;
      var html = data.slice(0, limit).map(createItem).join("");
      $grid.html(html);

      var offset = Math.floor(Math.random() * sizePattern.length);
      var rotated = sizePattern
        .slice(offset)
        .concat(sizePattern.slice(0, offset));
      if (!rotated.length) rotated = ["small"];
      $grid.find(".gallery-item").each(function (i) {
        var cls = rotated[i % rotated.length];
        $(this).removeClass(sizeClasses.join(" ")).addClass(cls);
      });
    });
  })();

  // Gallery modal viewer
  (function () {
    var $modal = $("#fdGalleryModal");
    if (!$modal.length) return;
    var $image = $("#fdGalleryImage");
    var $caption = $("#fdGalleryCaption");

    var openModal = function (src, caption) {
      $image.attr("src", src || "").attr("alt", caption || "Gallery image");
      $caption.text(caption || "");
      $modal.removeAttr("hidden").addClass("is-visible");
      $("body").addClass("overflow-hidden");
    };

    var closeModal = function () {
      $modal.attr("hidden", true).removeClass("is-visible");
      $image.attr("src", "");
      $caption.text("");
      $("body").removeClass("overflow-hidden");
    };

    $(document).on("click", ".gallery-link", function () {
      var $btn = $(this);
      var src = $btn.data("image");
      var caption = $btn.data("caption");
      if (src) {
        openModal(src, caption);
      }
    });

    $modal.on("click", "[data-close]", function () {
      closeModal();
    });

    $(document).on("keydown", function (evt) {
      if ($modal.is(":hidden")) return;
      if (evt.key === "Escape") {
        closeModal();
      }
    });
  })();

  // Lightbox for gallery (prefer Fancybox; fallback to Magnific)
  if ($(".gallery-grid").length && $.fancybox) {
    $.fancybox.defaults.buttons = ["zoom", "close"];
    $.fancybox.defaults.animationEffect = "zoom-in-out";
    $.fancybox.defaults.transitionEffect = "fade";
    $.fancybox.defaults.loop = true;
    $('[data-fancybox="gallery"]').fancybox();
  } else if ($(".gallery-grid").length && $.fn.magnificPopup) {
    $(".gallery-grid").magnificPopup({
      delegate: "a",
      type: "image",
      closeOnContentClick: false,
      closeBtnInside: false,
      fixedContentPos: true,
      gallery: { enabled: true },
      removalDelay: 200,
      mainClass: "mfp-fade mfp-with-zoom",
      zoom: { enabled: true, duration: 300, easing: "ease-out" },
      image: { verticalFit: true },
    });
  }
});
