function redirectToUrl(url) {
    if (barba.transitions.isRunning)
        return;
    barba.go(url)
}

function isTransitioning() { return document.querySelector('html').classList.contains('is-transitioning') }

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function defaultTransition(currContainer, nextContainer) {
    const transitionTitle = document.querySelector('.transition-title');
    const transitionBackground = document.querySelector('.transition-background');
    transitionTitle.innerHTML = capitalizeFirstLetter(nextContainer.dataset.barbaNamespace);
    return gsap
        .timeline({
            onComplete: () => {
                transitionTitle.innerHTML = '';
            }
        })
        .set(transitionBackground, {
            clearProps: 'all'
        })
        .set(transitionTitle, {
            y: 100
        })
        .to(transitionBackground, {
            duration: 0.7,
            x: '0',
            ease: 'power4',
            onComplete: () => {
                currContainer.remove()
            }
        })
        .to(transitionTitle, 0.5, {
            y: 0,
            opacity: 1,
            ease: 'power4'
        }, 0.1)
        .from(nextContainer, {
            duration: 0.1,
            opacity: 0,
            ease: 'power4'
        })
        .to(transitionBackground, {
            duration: 0.7,
            x: '100%',
            ease: 'power4.inOut'
        }, 1)
        .to(transitionTitle, 0.7, {
            y: -100,
            opacity: 0,
            ease: 'power4.inOut'
        }, 0.8)
        .then();
}

function toResults(currContainer, nextContainer) {
    const transitionTitle = document.querySelector('.transition-title');
    const transitionBackground = document.querySelector('.transition-background');
    transitionTitle.innerHTML = "You're headed to...";
    return gsap
        .timeline({
            onComplete: () => {
                transitionTitle.innerHTML = '';
            }
        })
        .set(transitionBackground, {
            clearProps: 'all'
        })
        .set(transitionTitle, {
            y: 100
        })
        .to(transitionBackground, {
            duration: 0.7,
            x: '0',
            ease: 'power4',
            onComplete: () => {
                currContainer.remove()
            }
        })
        .to(transitionTitle, 0.5, {
            y: 0,
            opacity: 1,
            ease: 'power4'
        }, 0.1)
        .from(nextContainer, {
            duration: 0.1,
            opacity: 0,
            ease: 'power4'
        })
        .to(transitionBackground, {
            duration: 0.7,
            x: '100%',
            ease: 'power4.inOut'
        }, 2)
        .to(transitionTitle, 0.7, {
            y: -100,
            opacity: 0,
            ease: 'power4.inOut'
        }, 1.8)
        .then();
}

function contentAnimation(container) {
    return gsap
        .timeline()
        .from(container.querySelector('.is-animated'), {
            duration: 0.5,
            translateY: 10,
            opacity: 0,
            stagger: 0.4
        })
}



/* ==========================================================================
   GLOBAL (DEFAULT) HOOKS

   These always run before their respective specific hook
   ========================================================================== */
barba.hooks.leave(async (data) => {
    document.querySelector('html').classList.add('is-transitioning');
    document.body.classList.add('prevent-scroll');
    if (isMenuOpen())
        menuClose();
});
barba.hooks.enter(async (data) => {
    window.scrollTo(0, 0);
});
barba.hooks.afterEnter(async (data) => {
    document.querySelector('html').classList.remove('is-transitioning');
    document.body.classList.remove('prevent-scroll');
});
barba.hooks.once(async (data) => {
    // TODO: use async once(data) for content animation
    // await contentAnimation(data.next.container)
});

/* ==========================================================================
   SPECIFIC HOOKS
   ========================================================================== */
$(() => {
    barba.init({
        preventRunning: true,
        transitions: [
            // To Restaurant Roulette
            {
                to: { namespace: ['Restaurant Roulette'] },
                async enter(data) { await defaultTransition(data.current.container, data.next.container); },

                async beforeEnter(data) {
                    $('head').append('<link rel="stylesheet" href="css/index/index.css">');
                    $('head').append('<link rel="stylesheet" href="css/index/form.css">');
                    $('head').append('<link rel="stylesheet" href="css/index/banner.css">');
                    $.getScript("js/index/index.js");
                    $.getScript("js/index/form.js");
                    // document.getElementById('menu-roulette').classList.add('is-active');
                    // document.getElementById('menu-result').classList.remove('is-active');
                }
            },
            // To results
            {
                to: { namespace: ['results'] },
                async enter(data) {
                    await toResults(data.current.container, data.next.container);
                    await roll();
                },

                async beforeEnter(data) {
                    $('head').append('<link rel="stylesheet" href="css/results/results.css">');
                    $.getScript("js/results/results.js");
                    $.getScript("js/results/resultsNav.js");
                    $.getScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyDbEPugXWcqo1q6b-X_pd09a0Zaj3trDOw&callback=initMap");
                    // document.getElementById('menu-result').classList.add('is-active');
                    // document.getElementById('menu-roulette').classList.remove('is-active');
                }
            },
            // To account info
            {
                to: { namespace: ['Account Info'] },
                async enter(data) {
                    await defaultTransition(data.current.container, data.next.container);
                    accountFunctions();
                },

                async beforeEnter(data) {
                    $('head').append('<link rel="stylesheet" href="css/index/form.css">');
                    $.getScript("js/login.js");
                }
            },
            // To past searches
            {
                to: { namespace: ['Past Searches'] },
                async enter(data) {
                    await defaultTransition(data.current.container, data.next.container);
                    getSearches();
                },

                async beforeEnter(data) {
                    $('head').append('<link rel="stylesheet" href="css/index/form.css">');
                    $.getScript("js/login.js");
                }
            }
        ]
    });
});
