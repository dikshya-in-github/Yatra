/* =====================================================
   ESEWA STEP 3 — confirmation, wallet/bank choice,
   insufficient balance check, cancel, success redirect
   ===================================================== */
document.addEventListener("DOMContentLoaded", function () {

    var fmt = function (n) {
        return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };
    function load(key) {
        try { return JSON.parse(sessionStorage.getItem(key)); } catch (e) { return null; }
    }

    /* ---------- Pending payment (set by balance page) ---------- */
    var pending = load("yatra_pending_payment") || {};
    var payable = typeof pending.amount === "number" ? pending.amount : 8299.99;
    var product = typeof pending.productAmount === "number" ? pending.productAmount : payable;
    var hasPromo = !!pending.promo;
    var user = pending.user || {
        phone: "9803660660",
        name: "Dikshya Ghising",
        email: "ghisingleeku@gmail.com",
        address: "Pariwartan, Suryabinayak Municipality-8, Bhaktapur, Bagmati Pradesh"
    };
    var flight = pending.flight || load("yatra_selected_flight");

    /* ---------- Fill details + amounts ---------- */
    document.getElementById("cId").textContent = user.phone;
    document.getElementById("cName").textContent = user.name;
    document.getElementById("cContact").textContent = user.phone;
    document.getElementById("cMail").textContent = user.email;
    document.getElementById("cAddress").textContent = user.address;

    document.getElementById("confProduct").textContent = fmt(product);
    document.getElementById("confTotal").textContent = fmt(payable);
    if (hasPromo) {
        document.getElementById("confPromoRow").hidden = false;
        document.getElementById("confPromoVal").textContent =
            product > payable ? "− " + fmt(product - payable) : pending.promo;
    }
    document.title = user.phone + " :: Confirmation | ePay";

    /* ---------- Balance ---------- */
    var BAL_KEY = "yatra_esewa_balance";
    var balance = parseFloat(sessionStorage.getItem(BAL_KEY));
    if (isNaN(balance)) balance = 26.35;

    /* ---------- Payment option toggle ---------- */
    var optWallet = document.getElementById("optWallet");
    var optBank = document.getElementById("optBank");
    var payBtn = document.getElementById("confPay");
    var method = "eSewa";

    optWallet.addEventListener("click", function () {
        optWallet.classList.add("selected");
        optBank.classList.remove("selected");
        method = "eSewa";
        payBtn.textContent = "PAY VIA ESEWA";
    });
    optBank.addEventListener("click", function () {
        optBank.classList.add("selected");
        optWallet.classList.remove("selected");
        method = "Linked Bank Account";
        payBtn.textContent = "PAY VIA BANK";
    });

    /* ---------- Modals ---------- */
    var insufModal = document.getElementById("insufModal");
    var cancelModal = document.getElementById("cancelModal");
    function show(m) { m.hidden = false; }
    function hide(m) { m.hidden = true; }

    /* ---------- PAY ---------- */
    payBtn.addEventListener("click", function () {
        if (method === "eSewa" && balance < payable) {
            show(insufModal);          // stacks over the confirmation modal
            return;
        }
        // Simulate processing, then success
        payBtn.disabled = true;
        payBtn.textContent = "PROCESSING...";
        setTimeout(function () {
            if (method === "eSewa") {
                balance -= payable;
                sessionStorage.setItem(BAL_KEY, balance.toFixed(2));
            }
            var txn = {
                txnId: "9A" + Date.now().toString().slice(-8),
                method: method,
                amount: payable,
                productAmount: product,
                paidAt: new Date().toISOString(),
                ref: flight || null
            };
            sessionStorage.setItem("yatra_transaction", JSON.stringify(txn));

            /* ---------- Persist the completed booking (Master Plan §2.1 #5) ----------
               Durable record for the admin panel (localStorage survives closing
               the tab, unlike sessionStorage). Data comes from booking.js's
               `bookingData`; the flight reference is the live eSewa txn.
               Same record the Spring API's POST /api/bookings will create
               later — same keys, same shapes. */
            try {
                var bk = load("bookingData") || {};
                var f = txn.ref || {};
                var contact = bk.contact || {};
                var paxList = bk.passengers || [];
                var adminFlights = JSON.parse(localStorage.getItem("yatra_admin_flights") || "[]");
                var match = null;
                for (var i = 0; i < adminFlights.length; i++) {
                    var af = adminFlights[i];
                    if (af && af.no === (f.flightNo || "") && af.from === (f.from || "") && af.to === (f.to || "")) {
                        match = af;
                        break;
                    }
                }
                if (match && typeof match.bookedSeats === "number") {
                    var paying = bk.flight && bk.flight.passengerCount ? bk.flight.passengerCount : 1;
                    match.bookedSeats = Math.min(match.seats, match.bookedSeats + paying);
                    localStorage.setItem("yatra_admin_flights", JSON.stringify(adminFlights));
                }
                /* Same deterministic PNR/ticket derivation eticket.js uses,
                   so the admin record matches the printed e-ticket. */
                var seed = txn.txnId.replace(/\D/g, "") || "00000000";
                var pnrVal = "YTRA" + seed.slice(0, 2).split("").map(function (c) {
                    return String.fromCharCode(65 + (+c) % 26);
                }).join("") + seed.slice(2, 4);
                var bookingRecord = {
                    id: "BKG" + Date.now().toString().slice(-8),
                    pnr: pnrVal,
                    ticketNo: "784-24" + seed.slice(0, 10),
                    status: "Confirmed",
                    paymentStatus: "Paid",
                    customer: contact.firstName
                        ? (contact.firstName + " " + (contact.lastName || "")).trim()
                        : (user.name || ""),
                    email: contact.email || user.email || "",
                    phone: contact.phone || user.phone || "",
                    passengers: paxList,
                    flight: {
                        flightNo: f.flightNo || "",
                        airline: f.airline || null,
                        from: f.from || "",
                        to: f.to || "",
                        date: f.date || "",
                        depart: f.depart || "",
                        arrive: f.arrive || "",
                        flightClass: f.flightClass || "E Class",
                        refundable: !!f.refundable,
                        pricePerPassenger: bk.flight ? bk.flight.pricePerPassenger : null,
                        passengerCount: bk.flight ? bk.flight.passengerCount : 1
                    },
                    amount: txn.amount,
                    productAmount: txn.productAmount,
                    payment: {
                        method: txn.method,
                        txnId: txn.txnId,
                        paidAt: txn.paidAt
                    },
                    createdAt: new Date().toISOString()
                };
                var allBookings = JSON.parse(localStorage.getItem("yatra_bookings") || "[]");
                allBookings.unshift(bookingRecord);
                localStorage.setItem("yatra_bookings", JSON.stringify(allBookings));
            } catch (e) { /* demo store failure must never block the e-ticket */ }

            location.href = "./eticket.html"; // success / e-ticket page
        }, 1300);
    });

    /* ---------- Insufficient balance modal ---------- */
    document.getElementById("insufClose").addEventListener("click", function () { hide(insufModal); });
    document.getElementById("insufX").addEventListener("click", function () { hide(insufModal); });

    /* ---------- Cancel flow ---------- */
    document.getElementById("confCancel").addEventListener("click", function () { show(cancelModal); });
    document.getElementById("confClose").addEventListener("click", function () { show(cancelModal); });
    document.getElementById("cancelNo").addEventListener("click", function () { hide(cancelModal); });
    document.getElementById("cancelX").addEventListener("click", function () { hide(cancelModal); });
    document.getElementById("cancelYes").addEventListener("click", function () {
        sessionStorage.removeItem("yatra_pending_payment");
        location.href = "./searchFlight.html";
    });

    /* ---------- Esc closes the top modal ---------- */
    document.addEventListener("keydown", function (e) {
        if (e.key !== "Escape") return;
        if (!insufModal.hidden) { hide(insufModal); return; }
        if (!cancelModal.hidden) { hide(cancelModal); }
    });
});
