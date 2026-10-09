/* ============================================
   PORTFOLIO - Interactive JavaScript
   ============================================ */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initNavbar();
    initMobileNav();
    initActiveNavLink();
    initCounters();
    initVisitorCounter();
});

/* ============================================
   THEME TOGGLE (light / dark)
   ============================================ */
// The saved choice is applied by an inline script in <head> before first paint.
// Without a saved choice, the CSS follows the OS setting (prefers-color-scheme).
function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    const root = document.documentElement;
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

    function currentTheme() {
        return root.getAttribute('data-theme') || (systemDark.matches ? 'dark' : 'light');
    }

    toggle.addEventListener('click', () => {
        const next = currentTheme() === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try {
            localStorage.setItem('theme', next);
        } catch (e) { /* storage unavailable: choice lasts for this visit only */ }
    });
}

/* ============================================
   NAVBAR SCROLL EFFECT
   ============================================ */
function initNavbar() {
    const navbar = document.getElementById('navbar');

    function update() {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
}

/* ============================================
   MOBILE NAVIGATION
   ============================================ */
function initMobileNav() {
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');
    const navItems = links.querySelectorAll('.nav-link');

    function setOpen(open) {
        toggle.classList.toggle('active', open);
        links.classList.toggle('active', open);
        toggle.setAttribute('aria-expanded', String(open));
        document.body.style.overflow = open ? 'hidden' : '';
    }

    toggle.addEventListener('click', () => setOpen(!links.classList.contains('active')));
    navItems.forEach(item => item.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setOpen(false);
    });
}

/* ============================================
   ACTIVE NAV LINK ON SCROLL
   ============================================ */
function initActiveNavLink() {
    // #hero has no nav link, so reaching it clears the highlight
    const sections = document.querySelectorAll('#hero, .section');
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' });

    sections.forEach(section => observer.observe(section));
}

/* ============================================
   COUNTER ANIMATION
   ============================================ */
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');

    if (prefersReducedMotion) {
        counters.forEach(counter => {
            counter.textContent = counter.getAttribute('data-target');
        });
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'), 10);
                animateNumber(counter, target, 1500);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

// Ease-out count from 0 to target; formats with French thousands separators.
function animateNumber(element, target, duration) {
    if (prefersReducedMotion || target === 0) {
        element.textContent = target.toLocaleString('fr-FR');
        return;
    }

    const start = performance.now();

    function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = Math.floor(eased * target).toLocaleString('fr-FR');
        if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

/* ============================================
   VISITOR COUNTER (GoatCounter)
   ============================================ */
// Requires "Allow adding visitor counts on your website" in GoatCounter settings.
function initVisitorCounter() {
    const countEl = document.getElementById('visitor-count');
    if (!countEl) return;

    const goatCounterCode = 'ouail';
    const base = `https://${goatCounterCode}.goatcounter.com/counter`;

    // GoatCounter returns counts as formatted strings ("1 234", "1,234")
    const parseCount = (data) => parseInt(String(data.count).replace(/\D/g, ''), 10) || 0;
    const getCount = (path) => fetch(`${base}/${path}.json`)
        .then(res => res.ok ? res.json() : Promise.reject(new Error(res.status)))
        .then(parseCount);

    getCount('TOTAL')
        .catch(() => getCount('%2F')) // fallback: home page counter
        .then(total => animateNumber(countEl, total, 1200))
        .catch(() => {
            countEl.textContent = '—';
        });
}
