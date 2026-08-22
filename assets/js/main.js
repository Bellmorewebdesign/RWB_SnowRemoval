/* RWB Snow Removal LLC
   Progressive enhancement only. Every section reads and works without this
   file; what follows adds the scroll behaviour, the three feature moments,
   and the mobile menu. */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  var motionOK = !reduceQuery.matches;
  var saveData = !!(navigator.connection && navigator.connection.saveData);

  function on(el, ev, fn, opts) { if (el) el.addEventListener(ev, fn, opts); }
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  function applyMotionPreference() {
    motionOK = !reduceQuery.matches;
    root.classList.toggle("motion", motionOK);
    armRibbons();
  }
  if (reduceQuery.addEventListener) {
    reduceQuery.addEventListener("change", function () { applyMotionPreference(); measure(); update(); });
  }

  /* ---------------------------------------------------------------- header */
  var header = $("[data-header]");
  var navToggle = $("[data-nav-toggle]");
  var navPanel = $("[data-nav-panel]");
  var menuOpen = false;
  var lastFocused = null;

  function focusables() { return $$("a[href], button:not([disabled])", navPanel); }

  function openMenu() {
    if (menuOpen) return;
    menuOpen = true;
    lastFocused = document.activeElement;
    navPanel.hidden = false;
    requestAnimationFrame(function () { navPanel.classList.add("is-open"); });
    navToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    var items = focusables();
    if (items.length) items[0].focus();
  }

  function closeMenu(returnFocus) {
    if (!menuOpen) return;
    menuOpen = false;
    navPanel.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    window.setTimeout(function () { if (!menuOpen) navPanel.hidden = true; }, 250);
    if (returnFocus && lastFocused && lastFocused.focus) lastFocused.focus();
  }

  on(navToggle, "click", function () { menuOpen ? closeMenu(true) : openMenu(); });

  /* The dimmed backdrop is a pseudo element on the panel, so a click that
     lands on the panel itself rather than a child came from the backdrop. */
  on(navPanel, "click", function (e) { if (e.target === navPanel) closeMenu(true); });

  on(document, "keydown", function (e) {
    if (!menuOpen) return;
    if (e.key === "Escape") { closeMenu(true); return; }
    if (e.key !== "Tab") return;
    var items = focusables();
    items.push(navToggle);
    var first = items[0];
    var last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  $$("a", navPanel).forEach(function (a) { on(a, "click", function () { closeMenu(false); }); });
  on(window, "resize", function () { if (window.innerWidth >= 1000) closeMenu(false); });

  /* ------------------------------------------------------- reveal on entry */
  var revealItems = $$(".reveal, .reveal-img, .area-map");
  if ("IntersectionObserver" in window) {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        revealIO.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.06 });
    revealItems.forEach(function (el) { revealIO.observe(el); });
  } else {
    revealItems.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ------------------------------------------ WOW 1: the patriotic ribbon */
  var ribbons = $$("[data-ribbon]");

  function armRibbons() {
    ribbons.forEach(function (layer) {
      if (!motionOK) { layer.classList.remove("is-armed"); return; }
      if (!layer.dataset.ready) {
        $$("path", layer).forEach(function (p) { p.setAttribute("pathLength", "1"); });
        layer.dataset.ready = "1";
      }
      layer.classList.add("is-armed");
    });
  }

  /* ------------------------------------------ WOW 2: the RWB service truck */
  var machine = $("[data-machine]");
  var machineTag = $("[data-machine-tag]");
  var machineNote = $("[data-machine-note]");
  var stageCol = $(".svc-stage-col");
  var services = $$(".card[data-svc]");
  var chips = $$(".chip");
  var serviceSection = $("#services");
  var machineCopy = {
    snow: ["Snow removal", "Plow down, salt ready"],
    towing: ["Towing", "Hook out"],
    junk: ["Junk removal", "Bed up, loaded"],
    power: ["Power washing", "High pressure"],
    soft: ["Soft washing", "Low pressure"]
  };
  var currentService = "";

  function setService(name) {
    if (!machine || !name || name === currentService || !machineCopy[name]) return;
    currentService = name;
    machine.setAttribute("data-state", name);
    if (machineTag) machineTag.textContent = machineCopy[name][0];
    if (machineNote) machineNote.textContent = machineCopy[name][1];
    services.forEach(function (s) { s.classList.toggle("is-active", s.getAttribute("data-svc") === name); });
    chips.forEach(function (c) {
      if (c.getAttribute("data-svc") === name) c.setAttribute("aria-current", "true");
      else c.removeAttribute("aria-current");
    });
  }

  chips.forEach(function (chip) {
    on(chip, "click", function () { setService(chip.getAttribute("data-svc")); });
  });

  /* --------------------------------------- WOW 3: seasonal transformation */
  var seasonTrack = $("[data-season-track]");
  var seasonStage = $("[data-season-stage]");

  /* ------------------------------------------------------------ call bar */
  var callbar = $("[data-callbar]");
  var hero = $("[data-hero]");

  /* --------------------------------------------------------- measurements */
  var heroHeight = 0;
  var viewportH = 0;
  var seasonRange = 1;
  var pinned = false;

  function measure() {
    viewportH = window.innerHeight;
    heroHeight = hero ? hero.offsetHeight : 0;
    pinned = motionOK && window.innerWidth >= 760;
    if (seasonTrack) seasonRange = Math.max(1, seasonTrack.offsetHeight - viewportH);
  }

  /* ------------------------------------------------------ the scroll loop */
  var ticking = false;
  var navLinks = $$(".nav-list a");
  var spySections = navLinks.map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); });

  function update() {
    ticking = false;
    var y = window.pageYOffset || document.documentElement.scrollTop;

    if (header) header.classList.toggle("is-stuck", y > 20);
    if (callbar) callbar.classList.toggle("is-on", y > Math.max(150, heroHeight * 0.5));

    /* restrained hero depth */
    if (hero && motionOK && y < heroHeight + viewportH) {
      var hp = clamp(y / Math.max(1, heroHeight), 0, 1);
      hero.style.setProperty("--hero-y", (hp * 34).toFixed(1) + "px");
      hero.style.setProperty("--seal-y", (hp * -46).toFixed(1) + "px");
    }

    /* the ribbon draws itself as each section passes through */
    if (motionOK) {
      for (var r = 0; r < ribbons.length; r++) {
        var lay = ribbons[r];
        var lr = lay.getBoundingClientRect();
        if (lr.bottom < -200 || lr.top > viewportH + 200) continue;
        var span = lr.height + viewportH * 0.45;
        var drawn = clamp((viewportH * 0.86 - lr.top) / span, 0, 1);
        lay.style.setProperty("--draw", drawn.toFixed(3));
      }
    }

    /* the plow blade wipe */
    if (seasonStage && seasonTrack) {
      if (pinned) {
        var top = seasonTrack.getBoundingClientRect().top;
        var sp = clamp(-top / seasonRange, 0, 1);
        var mask = clamp((sp - 0.14) / 0.56, 0, 1);
        seasonStage.style.setProperty("--p", mask.toFixed(4));
        seasonStage.style.setProperty("--blade-o",
          (mask > 0 && mask < 1 ? clamp(Math.min(mask, 1 - mask) * 9, 0, 1) : 0).toFixed(3));
        var stage = sp < 0.3 ? "0" : sp < 0.72 ? "1" : "2";
        if (seasonStage.getAttribute("data-stage") !== stage) seasonStage.setAttribute("data-stage", stage);
      } else if (seasonStage.hasAttribute("data-stage")) {
        seasonStage.removeAttribute("data-stage");
        seasonStage.style.removeProperty("--p");
      }
    }

    /* the truck follows whichever service is being read */
    if (serviceSection && services.length) {
      var secRect = serviceSection.getBoundingClientRect();
      if (secRect.top < viewportH && secRect.bottom > 0) {
        var wide = window.innerWidth >= 1000;
        var line = wide
          ? viewportH * 0.45
          : (stageCol ? stageCol.getBoundingClientRect().bottom + 60 : viewportH * 0.4);
        var pick = services[0];
        for (var i = 0; i < services.length; i++) {
          if (services[i].getBoundingClientRect().top <= line) pick = services[i];
        }
        setService(pick.getAttribute("data-svc"));
      }
    }

    /* nav highlighting */
    for (var n = spySections.length - 1; n >= 0; n--) {
      var sec = spySections[n];
      if (!sec) continue;
      var sr = sec.getBoundingClientRect();
      if (sr.top <= viewportH * 0.42 && sr.bottom > viewportH * 0.35) {
        navLinks.forEach(function (a, idx) {
          if (idx === n) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
        break;
      }
    }
  }

  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }

  var resizeTimer;
  function onResize() {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () { measure(); update(); }, 120);
  }

  on(window, "scroll", onScroll, { passive: true });
  on(window, "resize", onResize);
  on(window, "orientationchange", onResize);

  /* -------------------------------------------------------- project reel */
  var reel = $("[data-reel]");
  if (reel) {
    var video = $("[data-reel-video]", reel);
    var btn = $("[data-reel-btn]", reel);
    var loaded = false;
    var userPaused = false;

    function loadVideo() {
      if (loaded) return;
      loaded = true;
      video.src = video.getAttribute("data-src");
      video.load();
    }

    function setPlayingState(playing) {
      reel.classList.toggle("is-playing", playing);
      btn.setAttribute("aria-label", playing ? "Pause the project reel" : "Play the project reel");
    }

    on(video, "error", function () {
      /* The still is already on screen, so only the useless control goes away. */
      reel.classList.remove("is-playing");
      btn.hidden = true;
    });
    on(video, "play", function () { setPlayingState(true); });
    on(video, "pause", function () { setPlayingState(false); });

    on(btn, "click", function () {
      loadVideo();
      if (video.paused) {
        userPaused = false;
        var p = video.play();
        if (p && p.catch) p.catch(function () { setPlayingState(false); });
      } else {
        userPaused = true;
        video.pause();
      }
    });

    if ("IntersectionObserver" in window) {
      var nearIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) { if (entry.isIntersecting) { loadVideo(); nearIO.disconnect(); } });
      }, { rootMargin: "300px 0px" });
      nearIO.observe(reel);

      var playIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            if (motionOK && !saveData && !userPaused) {
              loadVideo();
              var p = video.play();
              if (p && p.catch) p.catch(function () { setPlayingState(false); });
            }
          } else if (!video.paused) {
            video.pause();
          }
        });
      }, { threshold: 0.5 });
      playIO.observe(reel);
    } else {
      loadVideo();
    }
  }

  /* ----------------------------------------------------------- footer year */
  var yearEl = $("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ------------------------------------------------------------------ start */
  applyMotionPreference();
  measure();
  update();
  on(window, "load", function () { measure(); update(); });
})();
