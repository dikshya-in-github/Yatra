document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. NAVBAR SCROLL EFFECT
    // ==========================================
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // ==========================================
    // 2. MOBILE MENU
    // ==========================================
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
            const icon = mobileBtn.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-xmark');
        });
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                const icon = mobileBtn.querySelector('i');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-xmark');
            });
        });
    }

    // ==========================================
    // 3. COUNTDOWN TIMER (resume from sessionStorage)
    // ==========================================
    const TIMER_DURATION = 15 * 60;
    let timeLeft = parseInt(sessionStorage.getItem('bookingTimeLeft')) || TIMER_DURATION;
    const timerDisplay = document.getElementById('timerDisplay');
    const timerBar = document.querySelector('.timer-bar');

    function formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m} minute${m !== 1 ? 's' : ''} ${s} second${s !== 1 ? 's' : ''}`;
    }

    function updateTimerDisplay() {
        timerDisplay.textContent = formatTime(timeLeft);
        timerBar.classList.remove('warning', 'danger');
        if (timeLeft <= 120) timerBar.classList.add('danger');
        else if (timeLeft <= 300) timerBar.classList.add('warning');
    }

    updateTimerDisplay();

    const timerInterval = setInterval(() => {
        timeLeft--;
        sessionStorage.setItem('bookingTimeLeft', timeLeft);

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerDisplay.textContent = '0 minutes 0 seconds';
            timerBar.classList.add('danger');
            alert('Your booking session has expired. Please start again.');
            sessionStorage.removeItem('bookingTimeLeft');
            sessionStorage.removeItem('bookingData');
            window.location.href = './homeLogged.html';
            return;
        }
        updateTimerDisplay();
    }, 1000);

    // ==========================================
    // 4. PAYMENT OPTION SELECTION
    // ==========================================
    document.querySelectorAll('.payment-option input').forEach(radio => {
        radio.addEventListener('change', () => {
            // Visual feedback handled by CSS :checked
            console.log('Selected payment:', radio.value);
        });
    });

    // ==========================================
    // 5. PROMO CODE
    // ==========================================
    const promoInput = document.getElementById('promoInput');
    const promoApplyBtn = document.getElementById('promoApplyBtn');
    if (promoApplyBtn && promoInput) {
        promoApplyBtn.addEventListener('click', () => {
            const code = promoInput.value.trim().toUpperCase();
            if (!code) {
                promoInput.style.borderColor = 'var(--accent)';
                setTimeout(() => { promoInput.style.borderColor = ''; }, 1500);
                return;
            }
            promoApplyBtn.textContent = 'Applied ✓';
            promoApplyBtn.classList.add('applied');
            promoInput.disabled = true;
            setTimeout(() => {
                promoApplyBtn.textContent = 'Apply';
                promoApplyBtn.classList.remove('applied');
                promoInput.disabled = false;
                promoInput.value = '';
            }, 2500);
        });
    }

    // ==========================================
    // 6. PRICE BREAKDOWN TOGGLE
    // ==========================================
    const breakdownBtn = document.getElementById('breakdownBtn');
    const priceBreakdown = document.getElementById('priceBreakdown');
    if (breakdownBtn && priceBreakdown) {
        breakdownBtn.addEventListener('click', () => {
            breakdownBtn.classList.toggle('open');
            priceBreakdown.classList.toggle('open');
        });
    }

    // ==========================================
    // 7. CONTINUE BUTTON — eSewa only for now (author decision)
    // ==========================================
    const continueBtn = document.getElementById('continueBtn');
    if (continueBtn) {
        continueBtn.addEventListener('click', (e) => {
            e.preventDefault();

            const selected = document.querySelector('input[name="payment"]:checked');
            if (!selected) {
                alert('Please select a payment method.');
                return;
            }

            // eSewa is the only integrated gateway right now. Other methods
            // (cards/banks, Khalti, IME Pay, ConnectIPS) come later.
            if (selected.value !== 'esewa') {
                alert('Only eSewa is available right now. Please select eSewa to continue.');
                return;
            }

            // Loading state
            continueBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
            continueBtn.disabled = true;

            const paymentData = {
                method: selected.value,
                promoCode: promoInput?.value.trim() || null,
                timestamp: new Date().toISOString(),
            };
            sessionStorage.setItem('paymentData', JSON.stringify(paymentData));

            // Step 3a — hand off to the mock eSewa gateway (login step)
            setTimeout(() => {
                window.location.href = './esewaLogin.html';
            }, 1200);
        });
    }

    // ==========================================
    // 8. HOTEL BUTTON
    // ==========================================
    const hotelBtn = document.getElementById('hotelBtn');
    if (hotelBtn) {
        hotelBtn.addEventListener('click', () => {
            window.open('./hotels.html', '_blank');
        });
    }

    // ==========================================
    // 9. SCROLL REVEAL
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    revealElements.forEach(el => revealObserver.observe(el));

    // ==========================================
    // 10. BACK TO TOP
    // ==========================================
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        const toggleBackToTop = () => backToTop.classList.toggle('show', window.scrollY > 500);
        window.addEventListener('scroll', toggleBackToTop, { passive: true });
        toggleBackToTop();
        backToTop.addEventListener('click', () => {
            const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
        });
    }
});