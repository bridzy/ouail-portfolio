/* ============================================
   PORTFOLIO - Interactive JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileNav();
    initActiveNavLink();
    initVisitorCounter();
});

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
        .then(total => {
            countEl.textContent = total.toLocaleString('fr-FR');
        })
        .catch(() => {
            countEl.textContent = '—';
        });
}
