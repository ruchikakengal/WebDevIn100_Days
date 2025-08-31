! function(e) {
    "use strict";
    e.fn.exists = function() {
        return this.length > 0
    };
    var s = function() {
            document.querySelectorAll("use").forEach(function(e) {
                return e.replaceWith(e.cloneNode())
            })
        },
        t = e(window).width();
    e(window).on("resize", function() {
        t = e(window).width()
    });
    var a = e(".mp_iframe"),
        l = {
            initialize: function() {
                this.stickyHeader(), this.SvgPolyfill(), this.headerNav(), this.dlNav(), this.mobileNav(), this.headerMenuPanel(), this.headerCart(), this.headerSearch(), this.headerTopBar(), this.headerBlogFilter(), this.checkoutRedeemPopup(), this.countDown(), this.isotope(), this.slickCarousel(), this.googleMap(), this.progressBar(), this.magnificPopupInit(), this.horizontalScroll(), this.socialGlitchEffect(), this.miscScripts()
            },
            onload: function() {
                this.preloader(), this.customCursor()
            },
            stickyHeader: function() {
                e(".site-header:not(.site-header--landing)").jPinning({
                    offset: 100
                })
            },
            SvgPolyfill: function() {
                svg4everybody()
            },
            preloader: function() {
                var s = e(".preloader-overlay"),
                    t = e("body");
                s.exists() && t.hasClass("preloader-is--active") && (t.removeClass("preloader-is--active"), setTimeout(function() {
                    t.addClass("scroll-is--active")
                }, 1300))
            },
            headerNav: function() {
                if (e(".main-nav").exists()) {
                    var s = e(".main-nav__list"),
                        t = e(".main-nav__list > li");
                    e(".main-nav__megamenu", s);
                    t.has(".main-nav__sub").addClass("has-children").append('<span class="main-nav__toggle">&nbsp;</span>'), t.has(".main-nav__megamenu").addClass("has-children").append('<span class="main-nav__toggle">&nbsp;</span>'), e(".main-nav__list > li > ul > li").has(".main-nav__sub").addClass("has-children").prepend('<span class="main-nav__toggle">&nbsp;</span>'), e(".main-nav__list > li > ul > li > ul > li").has(".main-nav__sub").addClass("has-children").prepend('<span class="main-nav__toggle">&nbsp;</span>')
                }
            },
            dlNav: function() {
                if (e(".dl-menuwrapper").exists()) {
                    var s = e(".dl-menu"),
                        t = e(".dl-menu > li");
                    e(".dl-megamenu", s);
                    t.has(".dl-submenu").addClass("has-children").append('<span class="dl-toggle">&nbsp;</span>'), e(".dl-menu > li > ul > li").has(".dl-submenu").addClass("has-children").append('<span class="dl-toggle">&nbsp;</span>'), e(".main-nav__list > li > ul > li > ul > li").has(".dl-submenu").addClass("has-children").append('<span class="dl-toggle">&nbsp;</span>')
                }
            },
            mobileNav: function() {
                if (e(".mobile-nav").exists()) {
                    e(".mobile-nav__list");
                    var s = e(".mobile-nav__list > li");
                    s.has(".mobile-nav__sub").addClass("has-children").prepend('<span class="mobile-nav__toggle">&nbsp;</span>'), s.has(".mobile-nav__megamenu").addClass("has-children").prepend('<span class="mobile-nav__toggle">&nbsp;</span>'), e(".mobile-nav__toggle").on("click", function() {
                        e(this).toggleClass("active").parent().siblings().children().removeClass("active"), e(".mobile-nav__sub, .mobile-nav__megamenu").not(e(this).siblings(".mobile-nav__sub, .mobile-nav__megamenu")).slideUp("normal"), e(this).siblings(".mobile-nav__sub").slideToggle("normal"), e(this).siblings(".mobile-nav__megamenu").slideToggle("normal")
                    }), e(".mobile-nav__list > li > ul > li").has(".mobile-nav__sub-2").addClass("has-children").prepend('<span class="mobile-nav__toggle-2">&nbsp;</span>'), e(".mobile-nav__list > li > ul > li > ul > li").has(".mobile-nav__sub-3").addClass("has-children").prepend('<span class="mobile-nav__toggle-2">&nbsp;</span>'), e(".mobile-nav__toggle-2").on("click", function() {
                        e(this).toggleClass("active"), e(this).siblings(".mobile-nav__sub-2").slideToggle("normal"), e(this).siblings(".mobile-nav__sub-3").slideToggle("normal")
                    })
                }
            },
            headerMenuPanel: function() {
                var s = e(".header-menu-toggle"),
                    a = e(".site-wrapper"),
                    l = e(".header-cart-toggle"),
                    o = e(".header-search-toggle"),
                    i = e(".header-social-toggle"),
                    r = e(".header-account"),
                    n = e(".header-pagination"),
                    c = e(".header-player-info-navigation"),
                    d = e(".header-filter-toggle"),
                    g = (e(".header-filter-toggle"), e(".header-top-bar-toggle")),
                    p = e(".menu-panel__top-bar"),
                    u = e(".dl-menuwrapper ul.dl-menu"),
                    m = e(".dl-menuwrapper ul.dl-menu li:not(.dl-back)");
                if (s.exists()) {
                    var f = function() {
                        var f, h = e(".site-layout--horizontal");
                        s.hasClass("toggled") && h.exists() ? a.mousewheel(function(e, s) {
                            t > 991 && (f = s, -1 != navigator.appVersion.indexOf("Win") && ("Windows", f = 40 * s), this.scrollLeft -= f, e.preventDefault())
                        }) : a.unmousewheel();
                        s.toggleClass("toggled"), a.hasClass("site-wrapper--has-search-overlay") && (o.toggleClass("toggled"), a.toggleClass("site-wrapper--has-search-overlay")), a.hasClass("site-wrapper--has-overlay") && (l.toggleClass("toggled"), a.toggleClass("site-wrapper--has-overlay")), t > 767 && (l.toggleClass("hide"), o.toggleClass("hide"), i.toggleClass("hide"), r.toggleClass("hide"), n.toggleClass("hide")), t < 768 && (g.toggleClass("hide"), g.hasClass("toggled") && g.removeClass("toggled"), p.hasClass("toggled") && p.removeClass("toggled")), c.exists() && c.toggleClass("hide"), d.exists() && d.toggleClass("hide"), u.removeClass("dl-subview"), m.removeClass("dl-subview dl-subviewopen"), a.toggleClass("site-wrapper--has-menu-overlay")
                    };
                    s.on("click", function() {
                        f()
                    }), e(document).keyup(function(e) {
                        27 === e.keyCode && s.hasClass("toggled") && f()
                    })
                }
            },
            headerCart: function() {
                var s = e(".header-cart-toggle"),
                    a = e(".header-search-toggle"),
                    l = e(".header-menu-toggle"),
                    o = e(".header-top-bar-toggle"),
                    i = e(".menu-panel__top-bar"),
                    r = e(".site-wrapper"),
                    n = e(".site-overlay");
                if (s.exists()) {
                    var c = function() {
                        s.toggleClass("toggled"), r.toggleClass("site-wrapper--has-overlay"), r.hasClass("site-wrapper--has-search-overlay") && (a.toggleClass("toggled"), r.toggleClass("site-wrapper--has-search-overlay")), t < 768 && r.hasClass("site-wrapper--has-menu-overlay") && (l.toggleClass("toggled"), o.toggleClass("hide"), r.toggleClass("site-wrapper--has-menu-overlay"), o.hasClass("toggled") && o.removeClass("toggled"), i.hasClass("toggled") && i.removeClass("toggled"))
                    };
                    s.on("click", function() {
                        c()
                    }), n.on("click", function() {
                        s.hasClass("toggled") && c()
                    }), e(document).keyup(function(e) {
                        27 === e.keyCode && s.hasClass("toggled") && c()
                    })
                }
            },
            headerSearch: function() {
                var s = e(".header-search-toggle"),
                    a = e(".header-cart-toggle"),
                    l = e(".header-menu-toggle"),
                    o = e(".header-top-bar-toggle"),
                    i = e(".menu-panel__top-bar"),
                    r = e(".site-wrapper");
                if (s.exists()) {
                    var n = function() {
                        s.toggleClass("toggled"), r.toggleClass("site-wrapper--has-search-overlay"), r.hasClass("site-wrapper--has-overlay") && (a.toggleClass("toggled"), r.toggleClass("site-wrapper--has-overlay")), t < 768 && r.hasClass("site-wrapper--has-menu-overlay") && (l.toggleClass("toggled"), o.toggleClass("hide"), r.toggleClass("site-wrapper--has-menu-overlay"), o.hasClass("toggled") && o.removeClass("toggled"), i.hasClass("toggled") && i.removeClass("toggled"))
                    };
                    s.on("click", function() {
                        n(), s.hasClass("toggled") && e("#header-search-form input").focus()
                    }), e(document).keyup(function(e) {
                        27 === e.keyCode && s.hasClass("toggled") && n()
                    })
                }
            },
            headerTopBar: function() {
                var s = e(".header-top-bar-toggle"),
                    a = e(".menu-panel__top-bar");
                s.exists() && s.on("click", function() {
                    e(this).toggleClass("toggled"), t < 768 && a.toggleClass("toggled")
                })
            },
            headerBlogFilter: function() {
                var s = e(".df-icon--filter"),
                    t = e(".filter-menu");
                s.exists() && t.exists() && s.on("click", function() {
                    t.toggleClass("filter-menu--active")
                })
            },
            checkoutRedeemPopup: function() {
                var s = e(".checkout-redeem"),
                    t = (e(".checkout-redeem-popup"), e(".site-wrapper")),
                    a = e(".site-overlay");
                s.exists() && (s.on("click", function() {
                    t.addClass("site-wrapper--has-redeem-overlay")
                }), a.on("click", function() {
                    t.removeClass("site-wrapper--has-redeem-overlay")
                }))
            },
            countDown: function() {
                var s = e(".countdown-counter"),
                    t = s.data("date");
                s.countdown({
                    date: t,
                    render: function(s) {
                        e(this.el).html("<div class='countdown-counter__item countdown-counter__item--days'>" + this.leadingZeros(s.days, 2) + " <span class='countdown-counter__label'>Days</span></div><div class='countdown-counter__item countdown-counter__item--hours'>" + this.leadingZeros(s.hours, 2) + " <span class='countdown-counter__label'>Hours</span></div><div class='countdown-counter__item countdown-counter__item--mins'>" + this.leadingZeros(s.min, 2) + " <span class='countdown-counter__label'>Mins</span></div><div class='countdown-counter__item countdown-counter__item--secs'>" + this.leadingZeros(s.sec, 2) + " <span class='countdown-counter__label'>Secs</span></div>")
                    }
                })
            },
            isotope: function() {
                var s, t = e(".streams-archive"),
                    a = e(".matches-scores");
                if (t.exists()) {
                    var l, o = e(".js-filter"),
                        i = e(window).width();
                    l = i > 991 ? "fitColumns" : "fitRows", s = t.imagesLoaded(function() {
                        s.isotope({
                            layoutMode: l,
                            itemSelector: ".stream"
                        }), s.isotope("layout"), o.on("click", "button", function() {
                            var t = e(this).attr("data-filter");
                            o.find("button").removeClass("active").addClass(""), e(this).removeClass("").addClass("active"), s.isotope({
                                filter: t
                            })
                        })
                    }), e(window).on("resize", function() {
                        i = e(window).width(), s.isotope("destroy"), l = i > 991 ? "fitColumns" : "fitRows", s.isotope({
                            layoutMode: l,
                            itemSelector: ".stream"
                        }), s.isotope("layout")
                    })
                }
                a.exists() && (s = a.imagesLoaded(function() {
                    var t = e(".js-filter");
                    s.isotope({
                        layoutMode: "fitRows",
                        itemSelector: ".col-md-12"
                    }), t.on("click", "li", function() {
                        var a = e(this).attr("data-filter");
                        t.find("li").removeClass("active").addClass(""), e(this).removeClass("").addClass("active"), s.isotope({
                            filter: a
                        })
                    })
                }))
            },
            slickCarousel: function() {
                var t = e(".widget-carousel"),
                    a = e(".top-bar-carousel"),
                    l = e(".widget-partners-carousel"),
                    o = e(".widget-partners-mobile-carousel"),
                    i = e(".product__thumbnail.slick-slider"),
                    r = e(".matches-scores__navigation"),
                    n = e(".team-carousel__content"),
                    c = e("#player-info-carousel-1"),
                    d = e("#player-info-carousel-2"),
                    g = e(".js-team-player__slider"),
                    p = e(".js-team-selection-slider");
                if (p.exists() && (p.slick({
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        autoplay: !1,
                        autoplaySpeed: 5e3,
                        arrows: !0,
                        dots: !1,
                        fade: !0,
                        infinite: !0,
                        prevArrow: e(".js-team-selection-slider__nav-prev"),
                        nextArrow: e(".js-team-selection-slider__nav-next"),
                        asNavFor: ".js-header-team-nav"
                    }), e(".js-header-team-nav").slick({
                        slidesToShow: 4,
                        slidesToScroll: 1,
                        asNavFor: p,
                        dots: !1,
                        arrows: !1,
                        vertical: !0,
                        focusOnSelect: !0
                    }), e(".header-team-toggle .df-icon").on("click", function() {
                        e(this).parent().toggleClass("header-team-toggle--active")
                    })), g.exists() && g.slick({
                        slidesToShow: 2,
                        slidesToScroll: 1,
                        autoplay: !0,
                        autoplaySpeed: 5e3,
                        arrows: !0,
                        dots: !1,
                        infinite: !1,
                        prevArrow: e(".js-team-player__nav-prev"),
                        nextArrow: e(".js-team-player__nav-next"),
                        responsive: [{
                            breakpoint: 992,
                            settings: {
                                slidesToShow: 1
                            }
                        }, {
                            breakpoint: 768,
                            settings: {
                                slidesToShow: 2
                            }
                        }, {
                            breakpoint: 576,
                            settings: {
                                slidesToShow: 1
                            }
                        }]
                    }), t.exists() && t.slick({
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        autoplay: !0,
                        autoplaySpeed: 5e3,
                        arrows: !1,
                        dots: !0,
                        centerPadding: 0
                    }), a.exists() && (a.slick({
                        infinite: !0,
                        slidesToShow: 4,
                        variableWidth: !0,
                        prevArrow: "<button class='slick-prev'><svg role='img' class='df-icon df-icon--left-arrow'><use xlink:href='assets/img/necromancers.svg#left-arrow'/></svg></button>",
                        nextArrow: "<button class='slick-next'><svg role='img' class='df-icon df-icon--right-arrow'><use xlink:href='assets/img/necromancers.svg#right-arrow'/></svg></button>",
                        responsive: [{
                            breakpoint: 768,
                            settings: "unslick"
                        }]
                    }), e(document).ready(function() {
                        var t, l, o = e(".top-bar-filter .cs-options"),
                            i = !1;
                        o.on("click", function() {
                            !1 === i ? (t = e(".cs-selected", this), l = t.attr("data-value"), a.slick("slickFilter", "." + l), i = !0, s()) : (a.slick("slickUnfilter"), t = e(".cs-selected", this), "all" != (l = t.attr("data-value")) ? (a.slick("slickFilter", "." + l), i = !0, s()) : (i = !1, s()))
                        })
                    })), l.exists()) {
                    e("ul", l).slick({
                        slidesToShow: 3,
                        slidesToScroll: 1,
                        autoplay: !0,
                        autoplaySpeed: 5e3,
                        arrows: !0,
                        dots: !1,
                        centerPadding: 0,
                        prevArrow: "<button class='slick-prev'><svg role='img' class='df-icon df-icon--left-arrow'><use xlink:href='assets/img/necromancers.svg#left-arrow'/></svg></button>",
                        nextArrow: "<button class='slick-next'><svg role='img' class='df-icon df-icon--right-arrow'><use xlink:href='assets/img/necromancers.svg#right-arrow'/></svg></button>",
                        responsive: [{
                            breakpoint: 1199,
                            settings: {
                                slidesToShow: 2
                            }
                        }, {
                            breakpoint: 992,
                            settings: {
                                slidesToShow: 1
                            }
                        }]
                    });
                    var u = e(".widget__title", l).width() + 34;
                    e(document).ready(function() {
                        e(".slick-arrow", l).appendTo(l).css({
                            left: u
                        })
                    });
                    e("ul", l).on("breakpoint", function(s) {
                        e(".slick-arrow", l).appendTo(l).css({
                            left: u
                        })
                    })
                }
                if (o.exists()) {
                    var m = o.parents(".collapse");
                    m.addClass("show"), setTimeout(function() {
                        o.slick({
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            arrows: !0,
                            dots: !1,
                            refresh: !0,
                            prevArrow: "<button class='slick-prev'><svg role='img' class='df-icon df-icon--left-arrow'><use xlink:href='assets/img/necromancers.svg#left-arrow'/></svg></button>",
                            nextArrow: "<button class='slick-next'><svg role='img' class='df-icon df-icon--right-arrow'><use xlink:href='assets/img/necromancers.svg#right-arrow'/></svg></button>"
                        })
                    }, 500), setTimeout(function() {
                        m.removeClass("show")
                    }, 1500)
                }
                if (i.exists() && i.slick({
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        autoplay: !0,
                        autoplaySpeed: 5e3,
                        arrows: !0,
                        dots: !1,
                        centerPadding: 0,
                        prevArrow: "<button class='slick-prev'><svg role='img' class='df-icon df-icon--left-arrow'><use xlink:href='assets/img/necromancers.svg#left-arrow'/></svg></button>",
                        nextArrow: "<button class='slick-next'><svg role='img' class='df-icon df-icon--right-arrow'><use xlink:href='assets/img/necromancers.svg#right-arrow'/></svg></button>"
                    }), r.exists() && r.slick({
                        slidesToShow: 9,
                        slidesToScroll: 3,
                        autoplay: !1,
                        arrows: !0,
                        centerPadding: 0,
                        responsive: [{
                            breakpoint: 992,
                            settings: {
                                arrows: !0,
                                centerPadding: 0,
                                slidesToShow: 6
                            }
                        }, {
                            breakpoint: 768,
                            settings: {
                                arrows: !0,
                                centerPadding: 0,
                                slidesToShow: 4
                            }
                        }, {
                            breakpoint: 576,
                            settings: {
                                arrows: !0,
                                centerPadding: 0,
                                slidesToShow: 4
                            }
                        }]
                    }), n.exists()) {
                    var f = 0,
                        h = document.location.search.match(/slide=(\d+)/);
                    h && h[1] && (f = h[1]), n.slick({
                        initialSlide: f,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        autoplay: !1,
                        vertical: !0,
                        verticalSwiping: !0,
                        centerPadding: 0,
                        arrows: !1,
                        dots: !0,
                        adaptiveHeight: !0,
                        customPaging: function(e, s) {
                            var t = e.$slides.get(s).dataset.icon;
                            return '<svg role="img" class="df-icon df-icon--' + t + '"><use xlink:href="assets/img/necromancers.svg#' + t + '"/></svg>'
                        },
                        responsive: [{
                            breakpoint: 1200,
                            settings: {
                                vertical: !1,
                                verticalSwiping: !1
                            }
                        }]
                    }), n.on("breakpoint", function(e) {
                        s()
                    })
                }
                c.exists() && (c.on("init", function(e, s) {
                    var t = s.currentSlide + 1 + "/" + s.slideCount;
                    c.append('<div class="slick-custom-pagination">' + t + "</div>")
                }), c.slick({
                    slidesToShow: 1,
                    centerPadding: 0,
                    arrows: !0,
                    prevArrow: "<button class='slick-prev'><svg role='img' class='df-icon df-icon--left-arrow'><use xlink:href='assets/img/necromancers.svg#left-arrow'/></svg></button>",
                    nextArrow: "<button class='slick-next'><svg role='img' class='df-icon df-icon--right-arrow'><use xlink:href='assets/img/necromancers.svg#right-arrow'/></svg></button>"
                }), c.on("afterChange", function(s, t, a) {
                    var l = t.currentSlide + 1 + "/" + t.slideCount;
                    e("#player-info-carousel-1 .slick-custom-pagination").html(l)
                })), d.exists() && (d.on("init", function(e, s) {
                    var t = s.currentSlide + 1 + "/" + s.slideCount;
                    d.append('<div class="slick-custom-pagination">' + t + "</div>")
                }), d.slick({
                    slidesToShow: 1,
                    centerPadding: 0,
                    arrows: !0,
                    prevArrow: "<button class='slick-prev'><svg role='img' class='df-icon df-icon--left-arrow'><use xlink:href='assets/img/necromancers.svg#left-arrow'/></svg></button>",
                    nextArrow: "<button class='slick-next'><svg role='img' class='df-icon df-icon--right-arrow'><use xlink:href='assets/img/necromancers.svg#right-arrow'/></svg></button>"
                }), d.on("afterChange", function(s, t, a) {
                    var l = t.currentSlide + 1 + "/" + t.slideCount;
                    e("#player-info-carousel-2 .slick-custom-pagination").html(l)
                }))
            },
            progressBar: function() {
                var s = e(".player-info-detail__bar");
                s.exists() && e(document).find(s).each(function(s) {
                    var t = e(this).attr("data-value"),
                        a = "#" + e(this).attr("data-id"),
                        l = new ProgressBar.Path(a, {
                            easing: "easeInOut",
                            duration: 1400
                        });
                    l.set(0), l.animate(t / 100)
                })
            },
            googleMap: function() {
                var s = e(".gm-map");
                s.exists() && s.each(function() {
                    var s = e(this),
                        t = s.attr("data-map-address") ? s.attr("data-map-address") : "New York, USA",
                        a = s.attr("data-map-zoom") ? s.attr("data-map-zoom") : "15",
                        l = s.attr("data-map-icon") ? s.attr("data-map-icon") : "",
                        o = s.attr("data-map-style"),
                        i = !!s.children().html() && s.children().html(),
                        r = "";
                    r = "necromancers" === o ? [{
                        elementType: "labels.text.fill",
                        stylers: [{
                            color: "#ffffff"
                        }]
                    }, {
                        elementType: "labels.text.stroke",
                        stylers: [{
                            color: "#222430"
                        }]
                    }, {
                        featureType: "administrative.land_parcel",
                        elementType: "labels",
                        stylers: [{
                            visibility: "off"
                        }]
                    }, {
                        featureType: "landscape",
                        elementType: "geometry",
                        stylers: [{
                            color: "#222430"
                        }]
                    }, {
                        featureType: "poi",
                        elementType: "geometry.fill",
                        stylers: [{
                            color: "#5e627e"
                        }]
                    }, {
                        featureType: "poi",
                        elementType: "geometry.stroke",
                        stylers: [{
                            color: "#717595"
                        }]
                    }, {
                        featureType: "poi",
                        elementType: "labels.text",
                        stylers: [{
                            visibility: "off"
                        }]
                    }, {
                        featureType: "poi.business",
                        stylers: [{
                            visibility: "off"
                        }]
                    }, {
                        featureType: "poi.park",
                        elementType: "geometry.fill",
                        stylers: [{
                            color: "#a3ff12"
                        }]
                    }, {
                        featureType: "road",
                        elementType: "geometry",
                        stylers: [{
                            color: "#323545"
                        }]
                    }, {
                        featureType: "road",
                        elementType: "labels",
                        stylers: [{
                            color: "#ffffff"
                        }]
                    }, {
                        featureType: "road",
                        elementType: "labels.icon",
                        stylers: [{
                            visibility: "off"
                        }]
                    }, {
                        featureType: "road",
                        elementType: "labels.text.fill",
                        stylers: [{
                            color: "#ffffff"
                        }]
                    }, {
                        featureType: "road",
                        elementType: "labels.text.stroke",
                        stylers: [{
                            color: "#222430"
                        }]
                    }, {
                        featureType: "road.local",
                        elementType: "labels",
                        stylers: [{
                            visibility: "off"
                        }]
                    }, {
                        featureType: "transit",
                        stylers: [{
                            visibility: "off"
                        }]
                    }, {
                        featureType: "water",
                        elementType: "geometry.fill",
                        stylers: [{
                            color: "#4545fa"
                        }]
                    }] : "ultra-light" === o ? [{
                        featureType: "water",
                        elementType: "geometry",
                        stylers: [{
                            color: "#e9e9e9"
                        }, {
                            lightness: 17
                        }]
                    }, {
                        featureType: "landscape",
                        elementType: "geometry",
                        stylers: [{
                            color: "#f5f5f5"
                        }, {
                            lightness: 20
                        }]
                    }, {
                        featureType: "road.highway",
                        elementType: "geometry.fill",
                        stylers: [{
                            color: "#ffffff"
                        }, {
                            lightness: 17
                        }]
                    }, {
                        featureType: "road.highway",
                        elementType: "geometry.stroke",
                        stylers: [{
                            color: "#ffffff"
                        }, {
                            lightness: 29
                        }, {
                            weight: .2
                        }]
                    }, {
                        featureType: "road.arterial",
                        elementType: "geometry",
                        stylers: [{
                            color: "#ffffff"
                        }, {
                            lightness: 18
                        }]
                    }, {
                        featureType: "road.local",
                        elementType: "geometry",
                        stylers: [{
                            color: "#ffffff"
                        }, {
                            lightness: 16
                        }]
                    }, {
                        featureType: "poi",
                        elementType: "geometry",
                        stylers: [{
                            color: "#f5f5f5"
                        }, {
                            lightness: 21
                        }]
                    }, {
                        featureType: "poi.park",
                        elementType: "geometry",
                        stylers: [{
                            color: "#dedede"
                        }, {
                            lightness: 21
                        }]
                    }, {
                        elementType: "labels.text.stroke",
                        stylers: [{
                            visibility: "on"
                        }, {
                            color: "#ffffff"
                        }, {
                            lightness: 16
                        }]
                    }, {
                        elementType: "labels.text.fill",
                        stylers: [{
                            saturation: 36
                        }, {
                            color: "#333333"
                        }, {
                            lightness: 40
                        }]
                    }, {
                        elementType: "labels.icon",
                        stylers: [{
                            visibility: "off"
                        }]
                    }, {
                        featureType: "transit",
                        elementType: "geometry",
                        stylers: [{
                            color: "#f2f2f2"
                        }, {
                            lightness: 19
                        }]
                    }, {
                        featureType: "administrative",
                        elementType: "geometry.fill",
                        stylers: [{
                            color: "#fefefe"
                        }, {
                            lightness: 20
                        }]
                    }, {
                        featureType: "administrative",
                        elementType: "geometry.stroke",
                        stylers: [{
                            color: "#fefefe"
                        }, {
                            lightness: 17
                        }, {
                            weight: 1.2
                        }]
                    }] : "light-dream" === o ? [{
                        featureType: "landscape",
                        stylers: [{
                            hue: "#FFBB00"
                        }, {
                            saturation: 43.400000000000006
                        }, {
                            lightness: 37.599999999999994
                        }, {
                            gamma: 1
                        }]
                    }, {
                        featureType: "road.highway",
                        stylers: [{
                            hue: "#FFC200"
                        }, {
                            saturation: -61.8
                        }, {
                            lightness: 45.599999999999994
                        }, {
                            gamma: 1
                        }]
                    }, {
                        featureType: "road.arterial",
                        stylers: [{
                            hue: "#FF0300"
                        }, {
                            saturation: -100
                        }, {
                            lightness: 51.19999999999999
                        }, {
                            gamma: 1
                        }]
                    }, {
                        featureType: "road.local",
                        stylers: [{
                            hue: "#FF0300"
                        }, {
                            saturation: -100
                        }, {
                            lightness: 52
                        }, {
                            gamma: 1
                        }]
                    }, {
                        featureType: "water",
                        stylers: [{
                            hue: "#0078FF"
                        }, {
                            saturation: -13.200000000000003
                        }, {
                            lightness: 2.4000000000000057
                        }, {
                            gamma: 1
                        }]
                    }, {
                        featureType: "poi",
                        stylers: [{
                            hue: "#00FF6A"
                        }, {
                            saturation: -1.0989010989011234
                        }, {
                            lightness: 11.200000000000017
                        }, {
                            gamma: 1
                        }]
                    }] : "shades-of-grey" === o ? [{
                        featureType: "all",
                        elementType: "labels.text.fill",
                        stylers: [{
                            saturation: 36
                        }, {
                            color: "#000000"
                        }, {
                            lightness: 40
                        }]
                    }, {
                        featureType: "all",
                        elementType: "labels.text.stroke",
                        stylers: [{
                            visibility: "on"
                        }, {
                            color: "#000000"
                        }, {
                            lightness: 16
                        }]
                    }, {
                        featureType: "all",
                        elementType: "labels.icon",
                        stylers: [{
                            visibility: "off"
                        }]
                    }, {
                        featureType: "administrative",
                        elementType: "geometry.fill",
                        stylers: [{
                            color: "#000000"
                        }, {
                            lightness: 20
                        }]
                    }, {
                        featureType: "administrative",
                        elementType: "geometry.stroke",
                        stylers: [{
                            color: "#000000"
                        }, {
                            lightness: 17
                        }, {
                            weight: 1.2
                        }]
                    }, {
                        featureType: "landscape",
                        elementType: "geometry",
                        stylers: [{
                            color: "#000000"
                        }, {
                            lightness: 20
                        }]
                    }, {
                        featureType: "poi",
                        elementType: "geometry",
                        stylers: [{
                            color: "#000000"
                        }, {
                            lightness: 21
                        }]
                    }, {
                        featureType: "road.highway",
                        elementType: "geometry.fill",
                        stylers: [{
                            color: "#000000"
                        }, {
                            lightness: 17
                        }]
                    }, {
                        featureType: "road.highway",
                        elementType: "geometry.stroke",
                        stylers: [{
                            color: "#000000"
                        }, {
                            lightness: 29
                        }, {
                            weight: .2
                        }]
                    }, {
                        featureType: "road.arterial",
                        elementType: "geometry",
                        stylers: [{
                            color: "#000000"
                        }, {
                            lightness: 18
                        }]
                    }, {
                        featureType: "road.local",
                        elementType: "geometry",
                        stylers: [{
                            color: "#000000"
                        }, {
                            lightness: 16
                        }]
                    }, {
                        featureType: "transit",
                        elementType: "geometry",
                        stylers: [{
                            color: "#000000"
                        }, {
                            lightness: 19
                        }]
                    }, {
                        featureType: "water",
                        elementType: "geometry",
                        stylers: [{
                            color: "#000000"
                        }, {
                            lightness: 17
                        }]
                    }] : "blue-water" === o ? [{
                        featureType: "administrative",
                        elementType: "labels.text.fill",
                        stylers: [{
                            color: "#444444"
                        }]
                    }, {
                        featureType: "landscape",
                        elementType: "all",
                        stylers: [{
                            color: "#f2f2f2"
                        }]
                    }, {
                        featureType: "poi",
                        elementType: "all",
                        stylers: [{
                            visibility: "off"
                        }]
                    }, {
                        featureType: "road",
                        elementType: "all",
                        stylers: [{
                            saturation: -100
                        }, {
                            lightness: 45
                        }]
                    }, {
                        featureType: "road.highway",
                        elementType: "all",
                        stylers: [{
                            visibility: "simplified"
                        }]
                    }, {
                        featureType: "road.arterial",
                        elementType: "labels.icon",
                        stylers: [{
                            visibility: "off"
                        }]
                    }, {
                        featureType: "transit",
                        elementType: "all",
                        stylers: [{
                            visibility: "off"
                        }]
                    }, {
                        featureType: "water",
                        elementType: "all",
                        stylers: [{
                            color: "#46bcec"
                        }, {
                            visibility: "on"
                        }]
                    }] : [{
                        featureType: "administrative.country",
                        elementType: "geometry",
                        stylers: [{
                            visibility: "simplified"
                        }, {
                            hue: "#ff0000"
                        }]
                    }], !1 !== i ? s.gmap3({
                        zoom: Number(a),
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        scrollwheel: !1,
                        address: t,
                        styles: r
                    }).marker({
                        address: t,
                        icon: l
                    }).infowindow({
                        position: t,
                        content: i
                    }).then(function(e) {
                        var s = this.get(0),
                            t = this.get(1);
                        t.addListener("click", function() {
                            e.open(s, t)
                        })
                    }) : s.gmap3({
                        zoom: Number(a),
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        scrollwheel: !1,
                        address: t,
                        styles: r
                    }).marker({
                        address: t,
                        icon: l
                    })
                })
            },
            magnificPopupInit: function() {
                a.exists() && e(".mp_iframe").magnificPopup({
                    type: "iframe",
                    removalDelay: 300,
                    mainClass: "mfp-fade",
                    autoFocusLast: !1,
                    patterns: {
                        youtube: {
                            index: "youtube.com/",
                            id: "v=",
                            src: "//www.youtube.com/embed/%id%?autoplay=1"
                        },
                        vimeo: {
                            index: "vimeo.com/",
                            id: "/",
                            src: "//player.vimeo.com/video/%id%?autoplay=1"
                        },
                        gmaps: {
                            index: "//maps.google.",
                            src: "%id%&output=embed"
                        }
                    },
                    srcAction: "iframe_src"
                })
            },
            horizontalScroll: function() {
                var s;
                e(".site-layout--horizontal").exists() && e(".site-wrapper").mousewheel(function(e, a) {
                    t > 991 && (s = a, -1 != navigator.appVersion.indexOf("Win") && ("Windows", s = 40 * a), this.scrollLeft -= s, e.preventDefault())
                })
            },
            customCursor: function() {
                if (t > 992) {
                    var e, s, a = document.querySelector.bind(document);
                    document.addEventListener.bind(document)("mousemove", function(t) {
                        e = t.clientX || t.pageX, s = t.clientY || t.pageY
                    });
                    var l = a("#df-custom-cursor"),
                        o = void 0,
                        i = void 0,
                        r = void 0,
                        n = void 0;
                    ! function t() {
                        requestAnimationFrame(t), o && i ? (r = .25 * (e - o), n = .25 * (s - i), Math.abs(r) + Math.abs(n) < .1 ? (o = e, i = s) : (o += r, i += n)) : (o = e, i = s), l.style.transform = "translate(" + o + "px, " + i + "px)"
                    }()
                }
            },
            socialGlitchEffect: function() {
                e(".social-menu--landing-glitch").exists() && e(".social-menu--landing-glitch > li > a").each(function() {
                    var s = e(this).find('[class*="fa-"]').clone().addClass("glitch-layer"),
                        t = s.clone().addClass("glitch-layer--1"),
                        a = s.clone().addClass("glitch-layer--2");
                    e(this).prepend(t, a)
                })
            },
            miscScripts: function() {
                [].slice.call(document.querySelectorAll("select.cs-select")).forEach(function(e) {
                    new SelectFx(e)
                }), e("#accordionFaqs").collapse({
                    toggle: !1
                }), e("#paymentMethods").collapse({
                    toggle: !0
                }), e(".counter__number").counterUp({
                    delay: 10,
                    time: 1e3
                }), e(".nano").nanoScroller(), e(".matches-tabs__navigation a").on("click", function() {
                    setTimeout(function() {
                        e(".nano").nanoScroller()
                    }, 200)
                }), e("#dl-menu").dlmenu({
                    animationClasses: {
                        classin: "dl-animate-in-1",
                        classout: "dl-animate-out-1"
                    },
                    backLabel: '<svg role="img" class="df-icon df-icon--left-arrow"><use xlink:href="assets/img/necromancers.svg#left-arrow"></use></svg> Back'
                }), e(".widget--sidebar").find("label").addClass("control-label"), e(".widget--sidebar select").wrap('<div class="select-wrapper"></div>')
            }
        };
    e(document).on("ready", function() {
        l.initialize()
    }), e(window).on("load", function() {
        l.onload()
    })
}(jQuery);






/********** search */
$('.main-btn').click(function() {
    $('.search-description').slideToggle(100);
  });
  $('.search-description li').click(function() {
    var target = $(this).html();
    var toRemove = 'By ';
    var newTarget = target.replace(toRemove, '');
    //remove spaces
    newTarget = newTarget.replace(/\s/g, '');
    $(".search-large").html(newTarget);
    $('.search-description').hide();
    $('.main-input').hide();
    newTarget = newTarget.toLowerCase();
    $('.main-' + newTarget).show();
  });
  $('#main-submit-mobile').click(function() {
    $('#main-submit').trigger('click');
  });
  $(window).resize(function() {
    replaceMatches();
  });
  
  function replaceMatches() {
    var width = $(window).width();
    if (width < 516) {
      $('.main-location').attr('value', 'City or postal code');
    } else {
      $('.main-location').attr('value', 'Search by city or postal code');
    }
  };
  replaceMatches();
  
  function clearText(thefield) {
    if (thefield.defaultValue == thefield.value) {
      thefield.value = ""
    }
  }
  
  function replaceText(thefield) {
    if (thefield.value == "") {
      thefield.value = thefield.defaultValue
    }
  }



  /******footer */


  