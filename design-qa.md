# Fairdeal Assets Homepage Revamp QA

## Evidence Reviewed
- Desktop layered hero start: `/tmp/fd-smooth-top.png` at 1440x900.
- Desktop cloud handoff at Core Values: `/tmp/fd-smooth-values-2.png` at 1440x900.
- Mobile layered hero start: `/tmp/fd-smooth-mobile.png` at 390x844.
- Mobile Core Values landing: `/tmp/fd-smooth-mobile-values.png` at 390x844.
- JavaScript syntax check: `node --check js/main.js`.

## Checks
- Hero follows the supplied Homy-style reference with pale sky, large black headline, black pill CTAs, modern property image, and lower fog transition.
- Hero now uses the supplied layered assets: `hero_bg-el0.png` for sky/mountains, `hero_bg-el1.png` for the foreground residence, and `hero_bg-cloud.png` for the transition clouds.
- Scroll progress drives the hero copy scale/opacity, background drift, foreground building lift/scale, and cloud movement.
- Foreground residence lift has been reduced so the lower villa does not fully climb through before the next section arrives.
- Core Values is pulled upward under the cloud bridge to reduce the empty gap between hero and section content.
- Navigation includes Properties, Services, About, Academy, and Contact us.
- Fairdeal Academy remains in third content position after Core Values.
- Core Values, Gallery, Insights, and About sections render with image fallbacks and no blank visual cards in the final capture.
- Mobile hero keeps text and CTAs readable, with the residence beginning below the controls and the cloud layer lowered below the main actions.

## Result
Passed visual QA for the requested parallax refresh. Low-risk difference from the reference: the Fairdeal logo/brand identity is retained instead of copying the Homy mark.
