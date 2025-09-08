AOS.init({
	duration: 700,
	easing: 'ease-out-cubic',
	offset: 80,
	once: true,
	disable: function() {
		return window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth < 768;
	}
});

jQuery(document).ready(function($) {

	"use strict";

	

	var siteMenuClone = function() {

		$('.js-clone-nav').each(function() {
			var $this = $(this);
			$this.clone().attr('class', 'site-nav-wrap').appendTo('.site-mobile-menu-body');
		});


		setTimeout(function() {
			
			var counter = 0;
      $('.site-mobile-menu .has-children').each(function(){
        var $this = $(this);
        
        $this.prepend('<span class="arrow-collapse collapsed">');

        $this.find('.arrow-collapse').attr({
          'data-toggle' : 'collapse',
          'data-target' : '#collapseItem' + counter,
        });

        $this.find('> ul').attr({
          'class' : 'collapse',
          'id' : 'collapseItem' + counter,
        });

        counter++;

      });

    }, 1000);

		$('body').on('click', '.arrow-collapse', function(e) {
      var $this = $(this);
      if ( $this.closest('li').find('.collapse').hasClass('show') ) {
        $this.removeClass('active');
      } else {
        $this.addClass('active');
      }
      e.preventDefault();  
      
    });

		$(window).resize(function() {
			var $this = $(this),
				w = $this.width();

			if ( w > 768 ) {
				if ( $('body').hasClass('offcanvas-menu') ) {
					$('body').removeClass('offcanvas-menu');
				}
			}
		})

		$('body').on('click', '.js-menu-toggle', function(e) {
			var $this = $(this);
			e.preventDefault();

			if ( $('body').hasClass('offcanvas-menu') ) {
				$('body').removeClass('offcanvas-menu');
				$this.removeClass('active');
			} else {
				$('body').addClass('offcanvas-menu');
				$this.addClass('active');
			}
		}) 

		// click outisde offcanvas
		$(document).mouseup(function(e) {
	    var container = $(".site-mobile-menu");
	    if (!container.is(e.target) && container.has(e.target).length === 0) {
	      if ( $('body').hasClass('offcanvas-menu') ) {
					$('body').removeClass('offcanvas-menu');
				}
	    }
		});
	}; 
	siteMenuClone();


	var sitePlusMinus = function() {
		$('.js-btn-minus').on('click', function(e){
			e.preventDefault();
			if ( $(this).closest('.input-group').find('.form-control').val() != 0  ) {
				$(this).closest('.input-group').find('.form-control').val(parseInt($(this).closest('.input-group').find('.form-control').val()) - 1);
			} else {
				$(this).closest('.input-group').find('.form-control').val(parseInt(0));
			}
		});
		$('.js-btn-plus').on('click', function(e){
			e.preventDefault();
			$(this).closest('.input-group').find('.form-control').val(parseInt($(this).closest('.input-group').find('.form-control').val()) + 1);
		});
	};
	// sitePlusMinus();


	var siteSliderRange = function() {
    $( "#slider-range" ).slider({
      range: true,
      min: 0,
      max: 100000,
      values: [ 0, 15000 ],
      slide: function( event, ui ) {
        $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
      }
    });
    $( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) +
      " - $" + $( "#slider-range" ).slider( "values", 1 ) );
	};
	siteSliderRange();


	
	var siteCarousel = function () {
		if ( $('.nonloop-block-13').length > 0 ) {
			$('.nonloop-block-13').owlCarousel({
		    center: false,
		    items: 1,
		    loop: true,
				stagePadding: 0,
		    margin: 30,
		    autoplay: true,
		    nav: false,
		    responsive:{
	        600:{
	        	margin: 30,
	        	
	          items: 2
	        },
	        1000:{
	        	margin: 30,
	        	stagePadding: 0,
	        	
	          items: 3
	        },
	        1200:{
	        	margin: 30,
	        	stagePadding: 0,
	        	
	          items: 4
	        }
		    }
			});
		}

		$('.slide-one-item, .with-dots').owlCarousel({
	    center: false,
	    items: 1,
	    loop: true,
			stagePadding: 0,
	    margin: 0,
	    autoplay: true,
	    pauseOnHover: false,
	    nav: false,
	    dots: true,
	    navText: ['<span class="icon-keyboard_arrow_left">', '<span class="icon-keyboard_arrow_right">']
	  });

	  $('.slide-one-item-alt').owlCarousel({
	    center: false,
	    items: 1,
	    loop: true,
			stagePadding: 0,
			smartSpeed: 700,
	    margin: 0,
	    autoplay: true,
	    pauseOnHover: false,

	  });

	  
	  
	  $('.custom-prev1').click(function(e) {
	  	e.preventDefault();
	  	$('.nonloop-block-13').trigger('prev.owl.carousel');
	  });
	  $('.custom-next1').click(function(e) {
	  	e.preventDefault();
	  	$('.nonloop-block-13').trigger('next.owl.carousel');
	  });


	  $('.custom-next').click(function(e) {
	  	e.preventDefault();
	  	$('.slide-one-item-alt').trigger('next.owl.carousel');
	  });
	  $('.custom-prev').click(function(e) {
	  	e.preventDefault();
	  	$('.slide-one-item-alt').trigger('prev.owl.carousel');
	  });
	  
	};
	siteCarousel();

var siteStellar = function() {
	var enableParallax = !window.matchMedia('(prefers-reduced-motion: reduce)').matches && $(window).width() >= 1024;
	if (!enableParallax) return;
	if (typeof $.fn.stellar !== 'function') return; // guard if plugin not loaded on this page
	$(window).stellar({
	    responsive: true,
	    parallaxBackgrounds: true,
	    parallaxElements: true,
	    horizontalScrolling: false,
	    hideDistantElements: true,
	    scrollProperty: 'scroll'
	  });
};
	siteStellar();

// Soft page load reveal
$(window).on('load', function(){
	$('.site-wrap').addClass('is-loaded');
});

// Stable viewport height on mobile (address bar safe)
var setVhUnit = function(){
	var vh = window.innerHeight * 0.01;
	document.documentElement.style.setProperty('--vh', vh + 'px');
};
setVhUnit();
$(window).on('resize orientationchange', function(){
	setVhUnit();
});

	var siteCountDown = function() {

		$('#date-countdown').countdown('2020/10/10', function(event) {
		  var $this = $(this).html(event.strftime(''
		    + '<span class="countdown-block"><span class="label">%w</span> weeks </span>'
		    + '<span class="countdown-block"><span class="label">%d</span> days </span>'
		    + '<span class="countdown-block"><span class="label">%H</span> hr </span>'
		    + '<span class="countdown-block"><span class="label">%M</span> min </span>'
		    + '<span class="countdown-block"><span class="label">%S</span> sec</span>'));
		});
				
	};
	siteCountDown();

	var siteDatePicker = function() {

		if ( $('.datepicker').length > 0 ) {
			$('.datepicker').datepicker();
		}

	};
	siteDatePicker();

	var siteSticky = function() {
		$(".js-sticky-header").sticky({topSpacing:0});
	};
	siteSticky();

	// navigation
  var OnePageNavigation = function() {
    var navToggler = $('.site-menu-toggle');
   	$("body").on("click", ".main-menu li a[href^='#'], .smoothscroll[href^='#'], .site-mobile-menu .site-nav-wrap li a", function(e) {
      e.preventDefault();

      var hash = this.hash;

      $('html, body').animate({
        'scrollTop': $(hash).offset().top
      }, 600, 'easeInOutCirc', function(){
        window.location.hash = hash;
      });

    });
  };
  OnePageNavigation();

  var siteScroll = function() {

  	

  	$(window).scroll(function() {

  		var st = $(this).scrollTop();

  		if (st > 100) {
  			$('.js-sticky-header').addClass('shrink');
  		} else {
  			$('.js-sticky-header').removeClass('shrink');
  		}

  	}) 

  };
  siteScroll();

  // Button ripple effect (skips if reduced motion)
  var allowMotion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  $('body').on('click', '.btn', function(e){
    if (!allowMotion) return;
    var $btn = $(this);
    var off = $btn.offset();
    var x = e.pageX - off.left; var y = e.pageY - off.top;
    var $r = $('<span class="ripple"/>').css({left:x, top:y, width:20, height:20});
    $btn.append($r);
    setTimeout(function(){ $r.remove(); }, 600);
  });

  // Randomize gallery item shapes for pleasing layout
  var sizes = ['small','tall','wide','big','small','tall'];
  $('.gallery-grid .gallery-item').each(function(i){
    var c = sizes[i % sizes.length];
    $(this).addClass(c);
  });

  // Lightbox for gallery (prefer Fancybox; fallback to Magnific)
  if ($('.gallery-grid').length && $.fancybox) {
    $.fancybox.defaults.buttons = ['zoom','close'];
    $.fancybox.defaults.animationEffect = 'zoom-in-out';
    $.fancybox.defaults.transitionEffect = 'fade';
    $.fancybox.defaults.loop = true;
    $('[data-fancybox="gallery"]').fancybox();
  } else if ($('.gallery-grid').length && $.fn.magnificPopup) {
    $('.gallery-grid').magnificPopup({
      delegate: 'a',
      type: 'image',
      closeOnContentClick: false,
      closeBtnInside: false,
      fixedContentPos: true,
      gallery: { enabled: true },
      removalDelay: 200,
      mainClass: 'mfp-fade mfp-with-zoom',
      zoom: { enabled: true, duration: 300, easing: 'ease-out' },
      image: { verticalFit: true }
    });
  }

});
