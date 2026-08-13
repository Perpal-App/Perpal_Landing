export const OPENING_ACTIVE_CLASS = "opening-active";

/**
 * Fired when the opening card has uncovered the hero — which is partway through
 * its exit, not at the end of it.
 *
 * Named for the release rather than for the card's completion, because those are
 * no longer the same moment: the card leaves on a heavily front-loaded curve, so
 * waiting for it to be gone left the hero blank for half a second after the slide
 * had visibly stopped. `Splash` owns the arithmetic.
 */
export const HERO_RELEASE_EVENT = "perpal:hero-release";
