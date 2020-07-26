function redirectToUrl(url) {
    if (barba.transitions.isRunning)
        return;
    barba.go(url)
}

function isTransitioning() { return document.body.classList.contains('is-transitioning') }

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function defaultTransition(currContainer, nextContainer) {
    const transitionTitle = document.querySelector('.transition-title');
    const transitionBackground = document.querySelector('.transition-background');
    transitionTitle.innerHTML = capitalizeFirstLetter(nextContainer.dataset.barbaNamespace);
    // transitionTitle.innerHTML = "You're headed to...";
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

$(() => {
    barba.init({
        preventRunning: true,
        transitions: [
            // Default
            {
                async leave(data) {
                    document.body.classList.add('is-transitioning');
                    document.body.classList.add('prevent-scroll');
                    if (isMenuOpen())
                        menuClose();
                },

                async enter(data) {
                    await defaultTransition(data.current.container, data.next.container);
                    document.body.classList.remove('is-transitioning');
                    document.body.classList.remove('prevent-scroll');
                }
            },
            // To results
            {
                to: { namespace: ['results'] },
                async leave(data) {
                    document.body.classList.add('is-transitioning');
                    document.body.classList.add('prevent-scroll');
                    if (isMenuOpen())
                        menuClose();
                },

                async enter(data) {
                    await toResults(data.current.container, data.next.container);
                    document.body.classList.remove('is-transitioning');
                    document.body.classList.remove('prevent-scroll');
                }
            }
            // {
            //     from: { namespace: ['search'] },
            //     to: { namespace: ['results'] },
            //     async leave(data) {
            //         await pageTransitionIn()
            //         data.current.container.remove()
            //     },

            //     async enter(data) {
            //         await pageTransitionOut(data.next.container)
            //     },

            //     async once(data) { await contentAnimation(data.next.container); }
            // }
        ]
    });
});
