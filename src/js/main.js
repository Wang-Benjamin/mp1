const header = document.querySelector('[data-header]');
const navigation = document.querySelector('.site-nav');
const navLinks = [...document.querySelectorAll('.nav-link')];
const pageSections = [...document.querySelectorAll('main > .stripe[id]')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

let scrollFrameRequested = false;

const setActiveNavigation = () => {
    const headerBottom = navigation.getBoundingClientRect().bottom + 1;
    const pageBottomReached =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;

    let activeSection = pageSections[0];

    if (pageBottomReached) {
        activeSection = pageSections[pageSections.length - 1];
    } else {
        pageSections.forEach((section) => {
            const bounds = section.getBoundingClientRect();

            if (bounds.top <= headerBottom && bounds.bottom > headerBottom) {
                activeSection = section;
            }
        });
    }

    navLinks.forEach((link) => {
        const isCurrent = link.hash === `#${activeSection.id}`;
        link.classList.toggle('is-active', isCurrent);

        if (isCurrent) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });
};

const updateScrollState = () => {
    header.classList.toggle('is-compact', window.scrollY > 20);
    setActiveNavigation();
    scrollFrameRequested = false;
};

const requestScrollUpdate = () => {
    if (!scrollFrameRequested) {
        window.requestAnimationFrame(updateScrollState);
        scrollFrameRequested = true;
    }
};

window.addEventListener('scroll', requestScrollUpdate, { passive: true });
window.addEventListener('resize', requestScrollUpdate);
updateScrollState();

document.querySelectorAll('.nav-link, .nav-brand, .scroll-cue').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
        const target = document.querySelector(anchor.hash);

        if (!target) {
            return;
        }

        event.preventDefault();
        target.scrollIntoView({
            behavior: reducedMotion.matches ? 'auto' : 'smooth',
            block: 'start',
        });

        window.history.pushState(null, '', anchor.hash);
    });
});

const experienceData = {
    zorix: {
        company: 'Zorix',
        title: 'Algorithm Engineer',
        details: [
            'Architected a perception-aware audio pipeline for companion robots to generate scene-appropriate audio candidates',
            'Built a real-time 3D facial-animation pipeline for emotion recognition, expression synthesis and lip synchronization',
            'Engineered a 6-DOF Stewart-platform simulator and motion-authoring framework',
        ],
    },
    knowlecy: {
        company: 'Knowlecy',
        title: 'Software Developer',
        details: [
            'Developed end-to-end social networking features for an AI-powered research platform, enabling users to follow researchers and explore their profiles and connections',
            'Built reusable follower/following interfaces and interactive profile cards, expanding networking and researcher-discovery workflows for 5,000+ users',
        ],
    },
    prelude: {
        company: 'Prelude',
        title: 'Software Developer',
        details: [
            'Designed and implemented a multi-tenant RAG-powered CRM intelligence platform, enabling AI-assisted outreach, insight generation, and competitor analysis for cross-border B2B sales teams',
            'Built a hybrid retrieval pipeline to generate grounded, citation-aware business insights and emails from email history, CRM interactions, and meeting notes',
        ],
    },
};

const experienceDialog = document.querySelector('#experience-dialog');
const dialogTitle = document.querySelector('#dialog-title');
const dialogCompany = document.querySelector('#dialog-company');
const dialogDetails = document.querySelector('#dialog-details');
const dialogCloseButton = document.querySelector('[data-onclick="close-dialog"]');
let dialogTrigger = null;

const closeExperienceDialog = () => {
    if (experienceDialog.open) {
        experienceDialog.close();
    }
};

document.querySelectorAll('[data-onclick="open-experience"]').forEach((button) => {
    button.addEventListener('click', () => {
        const experience = experienceData[button.dataset.experience];

        if (!experience) {
            return;
        }

        dialogTrigger = button;
        dialogCompany.textContent = experience.company;
        dialogTitle.textContent = experience.title;
        dialogDetails.replaceChildren(
            ...experience.details.map((detail) => {
                const item = document.createElement('li');
                item.textContent = detail;
                return item;
            }),
        );

        document.body.classList.add('is-dialog-open');
        experienceDialog.showModal();
        dialogCloseButton.focus();
    });
});

dialogCloseButton.addEventListener('click', closeExperienceDialog);

experienceDialog.addEventListener('click', (event) => {
    if (event.target === experienceDialog) {
        closeExperienceDialog();
    }
});

experienceDialog.addEventListener('close', () => {
    document.body.classList.remove('is-dialog-open');
    dialogTrigger?.focus();
});

const carousel = document.querySelector('.carousel');
const carouselTrack = document.querySelector('[data-carousel-track]');
const projectSlides = [...carouselTrack.children];
const carouselDots = [...document.querySelectorAll('[data-carousel-dot]')];
const carouselAutoplayDelay = 5000;
let currentSlide = 0;
let carouselAutoplayTimer = null;

const renderCarousel = () => {
    carouselTrack.dataset.slide = String(currentSlide);

    projectSlides.forEach((slide, index) => {
        slide.setAttribute('aria-hidden', String(index !== currentSlide));
    });

    carouselDots.forEach((dot, index) => {
        const isCurrent = index === currentSlide;
        dot.classList.toggle('is-active', isCurrent);

        if (isCurrent) {
            dot.setAttribute('aria-current', 'true');
        } else {
            dot.removeAttribute('aria-current');
        }
    });
};

const showSlide = (index) => {
    currentSlide = (index + projectSlides.length) % projectSlides.length;
    renderCarousel();
};

const stopCarouselAutoplay = () => {
    window.clearTimeout(carouselAutoplayTimer);
    carouselAutoplayTimer = null;
};

const scheduleCarouselAutoplay = () => {
    stopCarouselAutoplay();

    const userIsInteracting = carousel.matches(':hover') || carousel.contains(document.activeElement);

    if (reducedMotion.matches || document.hidden || userIsInteracting) {
        return;
    }

    carouselAutoplayTimer = window.setTimeout(() => {
        showSlide(currentSlide + 1);
        scheduleCarouselAutoplay();
    }, carouselAutoplayDelay);
};

document.querySelector('[data-onclick="previous-project"]').addEventListener('click', () => {
    showSlide(currentSlide - 1);
    scheduleCarouselAutoplay();
});

document.querySelector('[data-onclick="next-project"]').addEventListener('click', () => {
    showSlide(currentSlide + 1);
    scheduleCarouselAutoplay();
});

carouselDots.forEach((dot) => {
    dot.addEventListener('click', () => {
        showSlide(Number(dot.dataset.carouselDot));
        scheduleCarouselAutoplay();
    });
});

carousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        event.preventDefault();
        showSlide(currentSlide - 1);
        scheduleCarouselAutoplay();
    }

    if (event.key === 'ArrowRight') {
        event.preventDefault();
        showSlide(currentSlide + 1);
        scheduleCarouselAutoplay();
    }
});

renderCarousel();
scheduleCarouselAutoplay();

carousel.addEventListener('mouseenter', stopCarouselAutoplay);
carousel.addEventListener('mouseleave', scheduleCarouselAutoplay);
carousel.addEventListener('focusin', stopCarouselAutoplay);
carousel.addEventListener('focusout', () => window.requestAnimationFrame(scheduleCarouselAutoplay));
document.addEventListener('visibilitychange', scheduleCarouselAutoplay);
reducedMotion.addEventListener('change', scheduleCarouselAutoplay);

const revealElements = document.querySelectorAll(
    '.section-title, .about-group, .experience-card, .carousel, .video-frame, .contact-link',
);

if ('IntersectionObserver' in window && !reducedMotion.matches) {
    revealElements.forEach((element) => element.classList.add('will-reveal'));

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12 },
    );

    revealElements.forEach((element) => revealObserver.observe(element));
}
