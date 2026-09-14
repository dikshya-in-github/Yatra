document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // CONFIG
    // ==========================================
    const AMOUNT = 8299.99;
    const OTP_EXPIRY_SECONDS = 94;          // 01:34 — matches real ePay
    const NEXT_PAGE = './esewaPayment.html'; // User Details step
    const CANCEL_TARGET = './payment.html';

    const fmt = (n) => n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.querySelectorAll('.js-amount').forEach(el => el.textContent = fmt(AMOUNT));
    document.querySelectorAll('.js-amount-total').forEach(el => el.textContent = `NPR. ${fmt(AMOUNT)}`);

    // ==========================================
    // TOAST HELPER
    // ==========================================
    const toastEl = document.getElementById('epayToast');
    let toastT;
    const toast = (msg) => {
        toastEl.textContent = msg;
        toastEl.classList.add('show');
        clearTimeout(toastT);
        toastT = setTimeout(() => toastEl.classList.remove('show'), 2600);
    };

    // ==========================================
    // 1. OTP COUNTDOWN — 01:34
    // ==========================================
    const otpTimerEl = document.getElementById('otpTimer');
    const otpRow = document.getElementById('otpExpiresRow');
    const otpInput = document.getElementById('otpInput');
    const otpError = document.getElementById('otpError');
    const verifyBtn = document.getElementById('verifyBtn');
    let otpLeft = OTP_EXPIRY_SECONDS;
    let otpInterval = null;

    function renderTimer() {
        const m = String(Math.floor(otpLeft / 60)).padStart(2, '0');
        const s = String(otpLeft % 60).padStart(2, '0');
        otpTimerEl.textContent = `${m}:${s}`;
    }

    function startTimer() {
        clearInterval(otpInterval);
        otpLeft = OTP_EXPIRY_SECONDS;
        otpRow.classList.remove('expired');
        otpError.textContent = '';
        verifyBtn.disabled = false;
        otpInput.disabled = false;
        renderTimer();

        otpInterval = setInterval(() => {
            otpLeft--;
            renderTimer();

            if (otpLeft <= 0) {
                clearInterval(otpInterval);
                otpTimerEl.textContent = '00:00';
                otpRow.classList.add('expired');
                verifyBtn.disabled = true;
                otpInput.disabled = true;
                otpError.textContent = 'OTP expired. Please resend to continue.';
            }
        }, 1000);
    }
    startTimer();

    // ==========================================
    // 2. RESEND OTP — resets to 01:34
    // ==========================================
    document.getElementById('resendOtp').addEventListener('click', () => {
        startTimer();
        otpInput.value = '';
        otpInput.focus();
        toast('A new OTP has been sent to 9803660660.');
    });

    // Digits only, max 6
    otpInput.addEventListener('input', () => {
        otpInput.value = otpInput.value.replace(/\D/g, '').slice(0, 6);
        otpError.textContent = '';
    });

    // ==========================================
    // 3. VERIFY → next screen in flow
    // ==========================================
    verifyBtn.addEventListener('click', () => {
        const code = otpInput.value.trim();

        if (!/^\d{6}$/.test(code)) {
            otpError.textContent = 'Please enter the 6-digit code sent to your mobile.';
            otpInput.classList.add('shake');
            setTimeout(() => otpInput.classList.remove('shake'), 450);
            return;
        }

        clearInterval(otpInterval);
        verifyBtn.disabled = true;
        verifyBtn.innerHTML = '<i class="fa-solid fa-check"></i> VERIFIED';

        sessionStorage.setItem('esewaOtpVerified', '1');

        setTimeout(() => {
            window.location.href = NEXT_PAGE;
        }, 700);
    });

    // Enter key submits
    otpInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') verifyBtn.click();
    });

    // Back To Login — clear verified flag so flow restarts cleanly
    document.getElementById('backToLogin').addEventListener('click', () => {
        sessionStorage.removeItem('esewaOtpVerified');
    });

    // ==========================================
    // 4. CANCEL PAYMENT modal
    // ==========================================
    const cancelModal = document.getElementById('cancelModal');
    document.getElementById('cancelPaymentBtn').addEventListener('click', () => {
        cancelModal.classList.add('open');
    });
    document.getElementById('noClose').addEventListener('click', () => {
        cancelModal.classList.remove('open');
    });
    document.getElementById('yesCancel').addEventListener('click', () => {
        sessionStorage.removeItem('esewaOtpVerified');
        sessionStorage.setItem('paymentData', JSON.stringify({
            method: 'esewa', status: 'cancelled', amount: AMOUNT
        }));
        window.location.href = CANCEL_TARGET;
    });

    // Backdrop click + ESC close
    cancelModal.addEventListener('click', (e) => {
        if (e.target === cancelModal) cancelModal.classList.remove('open');
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') cancelModal.classList.remove('open');
    });
});