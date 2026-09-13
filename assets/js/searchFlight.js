/* =====================================================
   SEARCH FLIGHT — step 1 of booking wizard
   Reads ?from=&to=&date=&passengers= from URL
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* ---------- Config ---------- */
    var BASE_FARE = 8299.99; // demo fare
    var CLASSES = {
        E: { name: "E Class", mult: 1.00, refund: "Non Refundable",
             policy: ["Cancellation is not available for this fare.",
                      "Only PSC (Airport Tax) will be refunded."] },
        C: { name: "C Class", mult: 1.08, refund: "Non Refundable",
             policy: ["Cancellation is not available for this fare.",
                      "Only PSC (Airport Tax) will be refunded."] },
        D: { name: "D Class", mult: 1.16, refund: "Non Refundable",
             policy: ["Cancellation is not available for this fare.",
                      "Only PSC (Airport Tax) will be refunded."] },
        B: { name: "B Class", mult: 1.32, refund: "Taxes only refundable",
             policy: ["Base fare is forfeited on cancellation.",
                      "Fuel surcharge and PSC (Airport Tax) are refundable before the 2-hour cutoff."] },
        A: { name: "A Class", mult: 1.50, refund: "Charges apply",
             policy: ["More than 11 hours before departure: 25% cancellation charge.",
                      "2–11 hours before departure: 50% cancellation charge.",
                      "Within 2 hours: cancellation not permitted (no-show = fare forfeited)."] },
        Y: { name: "Y Class", mult: 1.80, refund: "Refundable with fee",
             policy: ["More than 11 hours before departure: 10% cancellation charge.",
                      "2–11 hours before departure: 33.33% cancellation charge.",
                      "Within 2 hours: cancellation not permitted (no-show = fare forfeited)."] }
    };
    var AIRPORTS = {
        KTM: { city: "KATHMANDU", name: "Tribhuvan International" },
        PKR: { city: "POKHARA", name: "Pokhara International" },
        BWA: { city: "BHAIRAHAWA", name: "Gautam Buddha International" },
        BDP: { city: "BHADRAPUR (JHAPA)", name: "Bhadrapur" },
        BIR: { city: "BIRATNAGAR", name: "Biratnagar" },
        JKRP: { city: "JANAKPUR", name: "Janakpur" },
       KEP: { city: "NEPALGUNJ", name: "Nepalgunj" },
        FDB: ... }; // fallback for unknown codes

    var AIRPORTS = {
        KTM: { city: "KATHMANDU" }, PKR: { city: "POKHARA" },
        BWA: { city: "BHAIRahawa" }, BDP: { city: "BHADRAPUR (JHAPA)" },
        BIR: { city: "BIRATNAGAR" }, JKRP: { city: "JANAKPUR" },
        KEP: { city: "NEPALGUNJ" }
    };
    var flightNoSeed = 950;

    /* ---------- URL params ---------- */
    var params = new URLSearchParams(location.search);
    var from = (params.get("from") || "KTM").toUpperCase();
    var to = (params.get("to") || "BDP").toUpperCase();
    var pax = parseInt(params.get("passengers") || "1", 10);
    var trip = params.get("trip") || "oneway";
    var today = new Date();
    var selDate = params.get("date") ? new Date(params.get("date")) : new Date(today.getTime() + 2 * 86400000);
    if (isNaN(selDate)) selDate = new Date(today.getTime() + 2 * 86400000);

    /* ---------- Helpers ---------- */
    var $ = function (id) { return document.getElementById(id); };
    var fmt = function (n) { return "NPR " + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
    var DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    function dLabel(d) { return DAYS[d.getDay()] + ", " + d.getDate() + " " + MONTHS[d.getMonth()]; }
    function iso(d) { return d.toISOString().slice(0, 10); }
    function cityOf(code) {
        var a = AIRPORTS[code];
        return a ? a.city : code;
    }

    /* ---------- Mock flights generator (stable per date) ---------- */
    function hash(str) {
        var h = 0;
        for (var i = 0; i < str.length; i++) { h = (h * 31 + str.charCodeAt(i)) | 0; }
        return Math.abs(h);
    }
    function flightsFor(dateObj) {
        var seed = hash(from + to + iso(dateObj));
        var count = 4 + (seed % 3); // 4-6 flights
        var list = [];
        var baseMin = 5 * 60 + 50; // 05:50
        var gaps = [125, 185, 240, 315, 395]; // minutes after first
        for (var i = 0; i < count; i++) {
            var depMin = (baseMin + (i === 0 ? 0 : gaps[(seed + i) % gaps.length] + i * 8)) % (24 * 60);
            var dur = 35 + ((seed >> i) % 26); // 35-60 min
            var arrMin = depMin + dur;
            function t(m) {
                var h24 = Math.floor(m / 60) % 24;
                var mm = m % 60;
                var ampm = h24 >= 12 ? "PM" : "AM";
                var h12 = h24 % 12; if (h12 === 0) h12 = 12;
                return (h12 < 10 ? "0" : "") + h12 + ":" + (mm < 10 ? "0" : "") + mm + " " + ampm;
            }
            list.push({
                no: "U" + (950 + ((seed + i * 7) % 45)),
                dep: t(depMin), arr: t(arrMin),
                depMin: depMin, arrMin: arrMin, dur: dur,
                price: Math.round((BASE_FARE + (hash(iso(dateObj) + i) % 40) * 10) * 100) / 100,
                oldPrice: null,
                cardClass: i === 0 ? "E" : ["E", "C", "E", "D", "B", "Y"][(seed + i) % 6]
            });
        }
        list.sort(function (a, b) { return a.depMin - b.depMin; });
        // Lowest fare badge on cheapest
        var cheapest = Math.min.apply(null, list.map(function (f) { return f.price; }));
        list.forEach(function (f) { f.lowFare = f.price === cheapest; });
        return list;
    }

    /* ---------- Render summary + heading ---------- */
    $("sumFrom").textContent = from;
    $("sumTo").textContent = to;
    $("sumPax").textContent = pax + (pax > 1 ? " Adults" : " Adult");
    $("sumTrip").textContent = trip === "round" ? "Round Trip" : "One Way";
    $("sumDate").textContent = dLabel(selDate);
    $("cbRoute").textContent = from + " - " + to;
    $("fromFull").textContent = cityOf(from);
    $("toFull").textContent = cityOf(to);

    /* ---------- Date strip (7 days from selected) ---------- */
    var strip = $("dateStrip");
    var day0 = new Date(selDate.getTime() - 2 * 86400000);
    for (var i = 0; i < 7; i++) {
        (function (i) {
            var d = new Date(day0.getTime() + i * 86400000);
            var btn = document.createElement("button");
            btn.className = "date-chip" + (iso(d) === iso(selDate) ? " active" : "");
            btn.textContent = dLabel(d);
            btn.addEventListener("click", function () {
                selDate = d;
                strip.querySelectorAll(".date-chip").forEach(function (c) { c.classList.remove("active"); });
                btn.classList.add("active");
                $("sumDate").textContent = dLabel(selDate);
                $("cbDate").textContent = dLabel(selDate);
                renderFlights();
            });
            strip.appendChild(btn);
        })(i);
    }

    /* ---------- Render flights ---------- */
    var listEl = $("flightsList");
    var selected = null; // { flight, cls, price }

    function renderFlights() {
        listEl.innerHTML = "";
        selected = null;
        $("confirmBar").hidden = true;
        document.getElementById("emptyState").hidden = false;
        document.getElementById("emptyState").querySelector("h3").textContent = "Searching flights…";
        // simulate a tiny load delay for polish
        setTimeout(function () {
            var flights = flightsFor(selDate);
            listEl.innerHTML = "";
            document.getElementById("emptyState").hidden = flights.length > 0;
            document.getElementById("emptyState").querySelector("h3").textContent = "No flights found for this date";
            flights.forEach(function (f, idx) {
                listEl.appendChild(card(f, idx));
            });
        }, 450);
    }

    function card(f, idx) {
        var el = document.createElement("article");
        el.className = "flight-card" + (idx === 0 ? " open" : "");
        var showOld = f.price < BASE_FARE + 300; // some cards show a struck old price
        el.innerHTML =
            '<div class="flight-row" role="button" tabindex="0" aria-expanded="false">' +
                '<div><div class="fc-time">' + f.dep + " - " + f.arr + '</div>' +
                '<div class="fc-route">' + cityOf(from) + " (" + from + ") - " + cityOf(to) + " (" + to + ')</div></div>' +
                '<div class="fc-class">' + CLASSES[f.cardClass].name + '</div>' +
                '<div class="fc-luggage">' +
                    '<span><i class="fa-solid fa-suitcase-rolling"></i> 15kg</span>' +
                    '<span><i class="fa-solid fa-bag-shopping"></i> 5kg</span>' +
                '</div>' +
                '<div class="fc-price-block">' +
                    '<span class="fc-price">' + fmt(f.price) + (f.lowFare ? ' <span class="fc-badge">Low fare</span>' : "") + '</span>' +
                    (showOld ? '<div class="fc-old">' + fmt(f.price * 1.0213) + '</div>' : "") +
                    '<div class="fc-refund">' + CLASSES[f.cardClass].refund + '</div>' +
                '</div>' +
                '<button class="fc-chevron" aria-label="Toggle flight details"><i class="fa-solid fa-chevron-down"></i></button>' +
            '</div>' +
            '<div class="fc-details"><div class="fc-details-inner">' +
