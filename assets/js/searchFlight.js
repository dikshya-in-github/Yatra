/* =====================================================
   FLIGHT SEARCH — URL params, date strip, flight cards,
   ticket-class pricing, policy modal, step-1 select
   ===================================================== */
document.addEventListener("DOMContentLoaded", function () {

    /* ---------- Airport data ---------- */
    var CITY = {
        KTM: "Kathmandu", PKR: "Pokhara", BWA: "Bhairahawa", BDP: "Bhadrapur",
        BIR: "Biratnagar", BHR: "Bharatpur", JKR: "Janakpur", SIM: "Simara",
        DHI: "Dhangadhi", KEP: "Nepalgunj", TMI: "Tumlingtar"
    };
    var CITY_UP = {
        KTM: "KATHMANDU", PKR: "POKHARA", BWA: "BHAIRAHAWA (GAUTAM BUDDHA)", BDP: "BHADRAPUR (JHAPA)",
        BIR: "BIRATNAGAR", BHR: "BHARATPUR", JKR: "JANAKPUR", SIM: "SIMARA",
        DHI: "DHANGADHI", KEP: "NEPALGUNJ", TMI: "TUMLINGTAR"
    };

    /* ---------- Fare classes (Buddha-Air-style tiers) ---------- */
    var BASE_FARE = 8299.99;
    var CLASSES = [
        { code: "E", label: "E Class", delta: 0, refund: false },
        { code: "C", label: "C Class", delta: 1000, refund: false },
        { code: "D", label: "D Class", delta: 2000, refund: false },
        { code: "B", label: "B Class", delta: 3000, refund: false },
        { code: "A", label: "A Class", delta: 4000, refund: true },
        { code: "Y", label: "Y Class", delta: 5000, refund: true }
    ];
    var POLICIES = {
        none: [
            "Cancellation is not available for this fare.",
            "Only PSC (Airport Tax) will be refunded.",
            "Date changes are not permitted on this fare."
        ],
        flexi: [
            "Cancellation allowed up to 2 hours before departure — only a 10% fee (33.33% within 11 hours).",
            "Free date changes up to 2 hours before departure (fare difference may apply).",
            "Unutilized PSC (Airport Tax) is always refundable on request."
        ]
    };

    var SCHEDULES = [
        ["06:50", "07:35"], ["09:55", "10:40"], ["11:35", "12:20"],
        ["12:50", "13:35"], ["15:10", "15:55"], ["17:25", "18:10"]
    ];
 
    /* ---------- Nepali domestic carriers (real IATA codes) ---------- */
    var AIRLINES = [
        { name: "Buddha Air", code: "U4", logo: "assets/imgs/airline-buddha.jpg" },
        { name: "Yeti Airlines", code: "YT", logo: "assets/imgs/airline-yeti.jpg" },
        { name: "Shree Airlines", code: "S3", logo: "assets/imgs/airline-shree.svg" },
        { name: "Sita Air", code: "ST", logo: "assets/imgs/airline-sita.jpeg" },
    ];

    /* ---------- URL params ---------- */
    var params = new URLSearchParams(location.search);
    var from = (params.get("from") || "KTM").toUpperCase();
    var to = (params.get("to") || "BDP").toUpperCase();
    var pax = parseInt(params.get("pax"), 10) || 1;

    function parseDate(s) {
        if (!s) return null;
        var d = new Date(s + "T00:00:00");
        return isNaN(d) ? null : d;
    }
    var selected = parseDate(params.get("date")) || new Date(new Date().setHours(0, 0, 0, 0));

    function iso(d) {
        return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    }
    function shortDate(d) {
        return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
    }
    function to12(hhmm) {
        var p = hhmm.split(":"), h = +p[0], m = p[1];
        var ap = h >= 12 ? "PM" : "AM";
        return ((h + 11) % 12 + 1) + ":" + m + " " + ap;
    }
    function duration(dep, arr) {
        var a = dep.split(":"), b = arr.split(":");
        var mins = (+b[0] * 60 + +b[1]) - (+a[0] * 60 + +a[1]);
        return mins + " min";
    }
    function npr(n) {
        return "NPR " + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    /* THE LINE THAT WAS MISSING — restore it */
    var fromUp = CITY_UP[from] || from, toUp = CITY_UP[to] || to;
    var fromCity = CITY[from] || from, toCity = CITY[to] || to;

    /* ---------- Header text ---------- */
    document.title = from + " - " + to + " :: Flight search | Yatra";
    document.getElementById("sumFrom").textContent = from;
    document.getElementById("sumTo").textContent = to;
    document.getElementById("sumPax").textContent = pax + (pax > 1 ? " Adults" : " Adult");
    document.getElementById("resultsTitle").textContent =
        "Select your preferred flight from " + fromUp + " to " + toUp;

    /* ---------- Date strip (selected day sits 4th of 7) ---------- */
    var strip = document.getElementById("dateStrip");
    var list = document.getElementById("flightsList");
    var emptyState = document.getElementById("emptyState");

    function renderStrip() {
        strip.innerHTML = "";
        for (var i = -3; i <= 3; i++) {
            var d = new Date(selected);
            d.setDate(d.getDate() + i);
            var btn = document.createElement("button");
            btn.type = "button";
            btn.className = "date-btn" + (i === 0 ? " selected" : "");
            btn.textContent = shortDate(d);
            btn.setAttribute("aria-pressed", i === 0 ? "true" : "false");
            (function (date) {
                btn.addEventListener("click", function () {
                    selected = date;
                    params.set("date", iso(date));
                    history.replaceState(null, "", location.pathname + "?" + params.toString());
                    renderStrip();
                    renderFlights();
                });
            })(d);
            strip.appendChild(btn);
        }
        document.getElementById("sumDate").textContent = shortDate(selected);
    }

    /* ---------- Flights per day (varies by date so it feels live) ---------- */
    function flightsFor(date) {
        var dow = date.getDay(), dom = date.getDate();
        var count = 4 + ((dow + dom) % 3); // 4–6 flights
        var out = [];
        for (var i = 0; i < count; i++) {
            var s = SCHEDULES[i % SCHEDULES.length];
            var al = AIRLINES[(i * 2 + dow + dom) % AIRLINES.length];
            out.push({
                dep: s[0], arr: s[1],
                no: al.code + " " + (951 + i * 7 + dow),
                base: BASE_FARE + i * 150,
                low: i === 0,
                airline: al
            });
        }
        return out;
    }


    /* ---------- Render flight cards ---------- */
    function renderFlights() {
        if (from === to || !CITY[from] || !CITY[to]) {
            list.innerHTML = "";
            emptyState.hidden = false;
            return;
        }
        emptyState.hidden = true;
        var flights = flightsFor(selected);
        list.classList.add("fading");
        setTimeout(function () {
            list.innerHTML = "";
            flights.forEach(function (f, idx) {
                list.appendChild(cardHTML(f, idx));
            });
            list.classList.remove("fading");
        }, 150);
    }

    function cardHTML(f, idx) {
        var card = document.createElement("article");
        card.className = "flight-card";
        card.dataset.idx = idx;
        card.dataset.classIdx = "0";

        var was = f.low ? "<s>" + npr(f.base + 177) + "</s> " : "";
        var row = document.createElement("button");
        row.type = "button";
        row.className = "flight-row";
        row.setAttribute("aria-expanded", "false");
        row.innerHTML =
            '<div class="fc-times"><h3>' + to12(f.dep) + " - " + to12(f.arr) + '</h3>' +
            '<p>' + fromCity + " (" + from + ")&nbsp; - &nbsp;" + toCity + " (" + to + ')</p></div>' +
            '<div class="fc-airline"><span class="al-mark"><span class="al-code">' + f.airline.code + '</span>' +
            '<img class="al-logo" src="' + f.airline.logo + '" alt="" onerror="this.remove()"></span>' +
            '<span class="al-txt"><strong>' + f.airline.name + '</strong><span class="al-sub">Airline</span></span></div>' +
            '<div class="fc-cell fc-class"><strong>E Class</strong><span>Ticket type</span></div>' +
            '<div class="fc-cell fc-bag"><strong>15kg</strong><span><i class="fa-solid fa-briefcase"></i> Baggage</span></div>' +
            '<div class="fc-cell fc-hand"><strong>5kg</strong><span><i class="fa-solid fa-suitcase-rolling"></i> Hand carry</span></div>' +
            '<div class="fc-price"><strong>' + npr(f.base) +
            (f.low ? ' <span class="badge-low">Low fare</span>' : "") +
            '</strong><p>' + was + '<span class="refund-word">Non Refundable</span></p></div>' +
            '<span class="fc-chev"><i class="fa-solid fa-chevron-down"></i></span>';
        card.appendChild(row);

        var expand = document.createElement("div");
        expand.className = "flight-expand";
        var dateStr = shortDate(selected);
        expand.innerHTML =
            '<div class="fe-inner">' +
            '<div class="fe-head"><h4><span>Departure</span> &nbsp;·&nbsp; ' + dateStr + '</h4>' +
            '<div><span class="fe-price">' + npr(f.base) + '</span> ' +
            '<span class="fe-refund">Non Refundable</span></div></div>' +
            '<div class="fe-body">' +
            '<div class="fe-timeline">' +
            '<div class="tl-row"><span class="tl-time">' + to12(f.dep) + '</span><span class="tl-place">' + fromCity + " (" + from + ')</span></div>' +
            '<div class="tl-mid"><span class="tl-flight"><i class="fa-solid fa-plane"></i> ' + f.no + ' · ' + f.airline.name + '</span>' +
            '<span class="tl-sep"></span><span>Flight Duration: ' + duration(f.dep, f.arr) + '</span></div>' +
            '<div class="tl-row"><span class="tl-time">' + to12(f.arr) + '</span><span class="tl-place">' + toCity + " (" + to + ')</span></div>' +
            '</div>' +
            '<div class="fe-config">' +
            '<p class="fe-label">Select Ticket Type</p>' +
            '<div class="class-pills">' + pillsHTML() + '</div>' +
            '<p class="fe-bag"><i class="fa-solid fa-briefcase"></i>Baggage: <strong>15kg</strong>' +
            '<span class="gap"></span><i class="fa-solid fa-suitcase-rolling"></i>Hand carry: <strong>5kg</strong></p>' +
            '</div>' +
            /* Miles feature removed — footer is policy link + select button only */
            '<div class="fe-foot">' +
            '<button type="button" class="linklike" data-policy>Cancellation Policy</button>' +
            '<button type="button" class="btn btn-primary btn-select"><i class="fa-solid fa-circle-check"></i> Select Departure Flight</button>' +
            '</div>' +
            '</div>' +
            '</div>';
        card.appendChild(expand);
        return card;
    }

    function pillsHTML() {
        return CLASSES.map(function (c, i) {
            return '<button type="button" class="pill' + (i === 0 ? " active" : "") +
                '" data-class-idx="' + i + '">' + c.label + '</button>';
        }).join("");
    }

    /* ---------- Airline logos: flag loaded images (load doesn't bubble,
       so listen in capture phase — covers lazily added card images) ---------- */
    list.addEventListener("load", function (e) {
        var img = e.target;
        if (img.classList && img.classList.contains("al-logo")) {
            img.closest(".al-mark").classList.add("has-logo");
        }
    }, true);

    /* ---------- Card interactions (event delegation) ---------- */
    list.addEventListener("click", function (e) {
        var card = e.target.closest(".flight-card");
        if (!card) return;
        var expand = card.querySelector(".flight-expand");

        // 1) Toggle expand/collapse
        if (e.target.closest(".flight-row")) {
            var isOpen = card.classList.contains("open");
            document.querySelectorAll(".flight-card.open").forEach(function (c) {
                c.classList.remove("open");
                c.querySelector(".flight-expand").style.maxHeight = null;
                c.querySelector(".flight-row").setAttribute("aria-expanded", "false");
            });
            if (!isOpen) {
                card.classList.add("open");
                expand.style.maxHeight = expand.scrollHeight + "px";
                card.querySelector(".flight-row").setAttribute("aria-expanded", "true");
            }
            return;
        }

        // 2) Ticket-class pill — update price and refund text
        var pill = e.target.closest(".pill");
        if (pill) {
            card.querySelectorAll(".pill").forEach(function (p) { p.classList.remove("active"); });
            pill.classList.add("active");
            var ci = +pill.dataset.classIdx;
            card.dataset.classIdx = ci;

            var idx = +card.dataset.idx;
            var f = flightsFor(selected)[idx];
            var cls = CLASSES[ci];
            var price = f.base + cls.delta;
            var was = f.low && ci === 0 ? "<s>" + npr(f.base + 177) + "</s> " : "";

            card.querySelector(".fc-class strong").textContent = cls.label;
            card.querySelector(".fc-price strong").innerHTML = npr(price) +
                (f.low && ci === 0 ? ' <span class="badge-low">Low fare</span>' : "");
            card.querySelector(".fc-price .refund-word").textContent =
                cls.refund ? "Refundable" : "Non Refundable";
            var wasEl = card.querySelector(".fc-price s");
            if (wasEl) wasEl.remove();
            if (was) card.querySelector(".fc-price p").insertAdjacentHTML("afterbegin", was);

            card.querySelector(".fe-price").textContent = npr(price);
            card.querySelector(".fe-refund").textContent = cls.refund ? "Refundable" : "Non Refundable";
            expand.style.maxHeight = expand.scrollHeight + "px"; // re-measure
            return;
        }

        // 3) Cancellation policy modal
        if (e.target.closest("[data-policy]")) {
            openPolicy(CLASSES[+card.dataset.classIdx].refund);
            return;
        }

        // 4) Select flight → step 2
        if (e.target.closest(".btn-select")) {
            var ci2 = +card.dataset.classIdx;
            var idx2 = +card.dataset.idx;
            var fl = flightsFor(selected)[idx2];
            var cl = CLASSES[ci2];
            sessionStorage.setItem("yatra_selected_flight", JSON.stringify({
                from: from, to: to, date: iso(selected),
                flightNo: fl.no, depart: fl.dep, arrive: fl.arr,
                airline: fl.airline,
                flightClass: cl.label, refundable: cl.refund,
                price: Math.round((fl.base + cl.delta) * 100) / 100,
                passengers: pax
            }));
            location.href = "./booking.html"; // step 2 — Passenger Details
        }
    });

    /* ---------- Policy modal ---------- */
    var modal = document.getElementById("policyModal");
    var policyList = document.getElementById("policyList");
    var closeBtn = document.getElementById("policyClose");

    function openPolicy(refundable) {
        var items = refundable ? POLICIES.flexi : POLICIES.none;
        policyList.innerHTML = items.map(function (t) { return "<li>" + t + "</li>"; }).join("");
        modal.classList.add("show");
        modal.setAttribute("aria-hidden", "false");
        closeBtn.focus();
    }
    function closePolicy() {
        modal.classList.remove("show");
        modal.setAttribute("aria-hidden", "true");
    }
    closeBtn.addEventListener("click", closePolicy);
    modal.addEventListener("click", function (e) { if (e.target === modal) closePolicy(); });
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && modal.classList.contains("show")) closePolicy();
    });

    /* ---------- Navbar + mobile menu (same as other pages) ---------- */
    var navbar = document.getElementById("navbar");
    function onScroll() { navbar.classList.toggle("scrolled", window.scrollY > 40); }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    var menuBtn = document.getElementById("mobileMenuBtn");
    var mobileMenu = document.getElementById("mobileMenu");
    menuBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        mobileMenu.classList.toggle("open");
    });
    mobileMenu.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () { mobileMenu.classList.remove("open"); });
    });
    document.addEventListener("click", function (e) {
        if (mobileMenu.classList.contains("open") && !mobileMenu.contains(e.target) && e.target !== menuBtn) {
            mobileMenu.classList.remove("open");
        }
    });

    /* ---------- Back to top ---------- */
    var backToTop = document.getElementById("backToTop");
    if (backToTop) {
        var toggleBackToTop = function () { backToTop.classList.toggle("show", window.scrollY > 500); };
        window.addEventListener("scroll", toggleBackToTop, { passive: true });
        toggleBackToTop();
        backToTop.addEventListener("click", function () {
            var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
        });
    }

    /* ---------- Init ---------- */
    renderStrip();
    renderFlights();
});
