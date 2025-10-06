import { useEffect, useRef, useState } from 'react';

interface ImmersiveLandingPageProps {
    onGetStarted: () => void;
}

declare global {
    interface Window {
        gsap: any;
        ScrollTrigger: any;
        Lenis: any;
    }
}

export const ImmersiveLandingPage = ({ onGetStarted }: ImmersiveLandingPageProps) => {
    const [showAudioEnable, setShowAudioEnable] = useState(true);
    const [showPreloader, setShowPreloader] = useState(false);
    const [counter, setCounter] = useState(0);
    const circleTransitions = useRef<any[]>([]);

    useEffect(() => {
        // Add noise texture to body
        document.body.style.position = 'relative';
        const noiseOverlay = document.createElement('div');
        noiseOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E");
      opacity: 0.08;
      z-index: 1000;
      pointer-events: none;
    `;
        document.body.appendChild(noiseOverlay);

        return () => {
            if (document.body.contains(noiseOverlay)) {
                document.body.removeChild(noiseOverlay);
            }
        };
    }, []);

    const setupGeometricBackground = () => {
        const svg = document.getElementById('geometric-svg');
        if (!svg) return;

        const gridLinesGroup = document.getElementById('grid-lines');
        const circlesOutlineGroup = document.getElementById('circles-outline');
        const circlesFilledGroup = document.querySelector('#circles-filled > g');

        if (!gridLinesGroup || !circlesOutlineGroup || !circlesFilledGroup) return;

        // Create grid lines
        const gridSpacing = 48;
        for (let i = 0; i <= 40; i++) {
            const vLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            vLine.setAttribute('class', 'grid-line');
            vLine.setAttribute('x1', (i * gridSpacing).toString());
            vLine.setAttribute('y1', '0');
            vLine.setAttribute('x2', (i * gridSpacing).toString());
            vLine.setAttribute('y2', '1080');
            vLine.setAttribute('stroke', 'rgba(245, 245, 245, 0.15)');
            vLine.setAttribute('stroke-width', '1');
            gridLinesGroup.appendChild(vLine);

            if (i <= 22) {
                const hLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                hLine.setAttribute('class', 'grid-line');
                hLine.setAttribute('x1', '0');
                hLine.setAttribute('y1', (i * gridSpacing).toString());
                hLine.setAttribute('x2', '1920');
                hLine.setAttribute('y2', (i * gridSpacing).toString());
                hLine.setAttribute('stroke', 'rgba(245, 245, 245, 0.15)');
                hLine.setAttribute('stroke-width', '1');
                gridLinesGroup.appendChild(hLine);
            }
        }

        // Create circles
        const d = 80;
        const centerX = 960;
        const centerY = 540;

        const transitions = [
            { initial: { cx: centerX - 3 * d, cy: centerY, r: d * 0.8 }, final: { cx: centerX, cy: centerY, r: 4 * d } },
            { initial: { cx: centerX + 3 * d, cy: centerY, r: d * 0.8 }, final: { cx: centerX, cy: centerY, r: 4 * d } },
            { initial: { cx: centerX, cy: centerY - 3 * d, r: d * 0.8 }, final: { cx: centerX, cy: centerY, r: 4 * d } },
            { initial: { cx: centerX, cy: centerY + 3 * d, r: d * 0.8 }, final: { cx: centerX, cy: centerY, r: 4 * d } },
            { initial: { cx: centerX - 2 * d, cy: centerY - 2 * d, r: d * 0.6 }, final: { cx: centerX, cy: centerY, r: 4 * d } },
            { initial: { cx: centerX + 2 * d, cy: centerY - 2 * d, r: d * 0.6 }, final: { cx: centerX, cy: centerY, r: 4 * d } },
            { initial: { cx: centerX - 2 * d, cy: centerY + 2 * d, r: d * 0.6 }, final: { cx: centerX, cy: centerY, r: 4 * d } },
            { initial: { cx: centerX + 2 * d, cy: centerY + 2 * d, r: d * 0.6 }, final: { cx: centerX, cy: centerY, r: 4 * d } },
        ];

        circleTransitions.current = transitions.map((transition) => {
            const circleOutline = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circleOutline.setAttribute('cx', transition.initial.cx.toString());
            circleOutline.setAttribute('cy', transition.initial.cy.toString());
            circleOutline.setAttribute('r', transition.initial.r.toString());
            circleOutline.setAttribute('stroke', 'rgba(245, 245, 245, 0.3)');
            circleOutline.setAttribute('stroke-width', '1');
            circleOutline.setAttribute('fill', 'none');
            circlesOutlineGroup.appendChild(circleOutline);

            const circleFilled = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circleFilled.setAttribute('cx', transition.initial.cx.toString());
            circleFilled.setAttribute('cy', transition.initial.cy.toString());
            circleFilled.setAttribute('r', transition.initial.r.toString());
            circleFilled.setAttribute('stroke', 'rgba(245, 245, 245, 0.3)');
            circleFilled.setAttribute('stroke-width', '1');
            circleFilled.setAttribute('fill', 'rgba(245, 245, 245, 0.05)');
            circlesFilledGroup.appendChild(circleFilled);

            return {
                ...transition,
                outlineCircle: circleOutline,
                filledCircle: circleFilled,
            };
        });
    };

    const startAnimations = () => {
        if (!window.gsap || !window.ScrollTrigger || !window.Lenis) return;

        window.gsap.registerPlugin(window.ScrollTrigger);

        // Initialize Lenis smooth scroll
        const lenis = new window.Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        lenis.on('scroll', window.ScrollTrigger.update);

        window.gsap.ticker.add((time: number) => {
            lenis.raf(time * 1000);
        });

        // Animate gradient reveal
        window.gsap.to('.gradient-reveal', {
            y: '-500vh',
            duration: 2,
            ease: 'power2.inOut',
            delay: 0.25,
        });

        // Add scroll triggers for gradient sections to prevent overwriting
        window.gsap.utils.toArray('section').forEach((section: any, index: number) => {
            if (index === 1) { // Second section (Dark Radial Glow)
                window.gsap.to('#section-2-gradient', {
                    backgroundImage: 'radial-gradient(circle 600px at 50% 200px, rgba(62, 62, 62, 0.7), transparent)',
                    ease: 'none',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1,
                    }
                });
            }
            if (index === 2) { // Third section (Pink Radial Glow)
                window.gsap.to('#section-3-gradient', {
                    backgroundImage: 'radial-gradient(circle 700px at 50% 100px, rgba(236, 72, 153, 0.8), transparent)',
                    ease: 'none',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1,
                    }
                });
            }
        });

        // Setup scroll animations
        const updateAnimations = () => {
            const scrollY = window.scrollY;
            const maxScroll = document.body.scrollHeight - window.innerHeight;
            const progress = Math.min(scrollY / maxScroll, 1);

            // Update center circle
            const circle = document.getElementById('glow-circle');
            if (circle) {
                const scale = 1 + progress * 1.8;
                const shadowSize = progress * 150;
                const shadowSpread = progress * 35;
                const shadowOpacity = progress;

                circle.style.transform = `scale(${scale})`;
                circle.style.boxShadow = `0 0 ${shadowSize}px ${shadowSpread}px rgba(208, 79, 153, ${shadowOpacity})`;
            }

            // Animate gradient backgrounds based on scroll
            const section2Gradient = document.getElementById('section-2-gradient');
            const section3Gradient = document.getElementById('section-3-gradient');

            if (section2Gradient) {
                const section2Progress = Math.max(0, Math.min(1, (scrollY - window.innerHeight * 2) / (window.innerHeight * 2)));
                const glowIntensity = 0.3 + section2Progress * 0.4;
                const glowSize = 400 + section2Progress * 200;
                section2Gradient.style.backgroundImage = `radial-gradient(circle ${glowSize}px at 50% 200px, rgba(62, 62, 62, ${glowIntensity}), transparent)`;
            }

            if (section3Gradient) {
                const section3Progress = Math.max(0, Math.min(1, (scrollY - window.innerHeight * 4) / (window.innerHeight * 2)));
                const pinkIntensity = 0.2 + section3Progress * 0.6;
                const pinkSize = 400 + section3Progress * 300;
                section3Gradient.style.backgroundImage = `radial-gradient(circle ${pinkSize}px at 50% 100px, rgba(236, 72, 153, ${pinkIntensity}), transparent)`;
            }

            // Update geometric circles
            circleTransitions.current.forEach((transition, index) => {
                const currentCx = transition.initial.cx + (transition.final.cx - transition.initial.cx) * progress;
                const currentCy = transition.initial.cy + (transition.final.cy - transition.initial.cy) * progress;
                const currentR = transition.initial.r + (transition.final.r - transition.initial.r) * progress;
                const rotation = progress * 360 * (index % 2 === 0 ? 1 : -1);
                const opacity = Math.max(0.1, 1 - progress * 0.7);

                if (transition.outlineCircle) {
                    transition.outlineCircle.setAttribute('cx', currentCx.toString());
                    transition.outlineCircle.setAttribute('cy', currentCy.toString());
                    transition.outlineCircle.setAttribute('r', currentR.toString());
                    transition.outlineCircle.setAttribute('transform', `rotate(${rotation} ${currentCx} ${currentCy})`);
                    transition.outlineCircle.setAttribute('stroke-opacity', opacity.toString());
                }

                if (transition.filledCircle) {
                    transition.filledCircle.setAttribute('cx', currentCx.toString());
                    transition.filledCircle.setAttribute('cy', currentCy.toString());
                    transition.filledCircle.setAttribute('r', currentR.toString());
                    transition.filledCircle.setAttribute('transform', `rotate(${rotation} ${currentCx} ${currentCy})`);
                    transition.filledCircle.setAttribute('fill-opacity', (opacity * 0.05).toString());
                }
            });

            // Update debug text
            const freq1 = (432 + progress * 108).toFixed(1);
            const energy = (progress * 99.9).toFixed(1);

            const debugLine1 = document.getElementById('debug-line-1');
            const debugLine3 = document.getElementById('debug-line-3');

            if (debugLine1) {
                let awarenessState = 'AWARENESS: SILENCE';
                if (progress > 0.75) awarenessState = 'AWARENESS: TRANSCENDING';
                else if (progress > 0.5) awarenessState = 'AWARENESS: ASCENDING';
                else if (progress > 0.25) awarenessState = 'AWARENESS: FLOWING';
                else if (progress > 0.1) awarenessState = 'AWARENESS: STIRRING';

                debugLine1.textContent = `[${freq1}] ${awarenessState}`;
            }

            if (debugLine3) {
                let energyState = 'ENERGY: DORMANT';
                if (progress > 0.75) energyState = 'ENERGY: OVERFLOWING';
                else if (progress > 0.5) energyState = 'ENERGY: RADIATING';
                else if (progress > 0.25) energyState = 'ENERGY: BUILDING';
                else if (progress > 0.1) energyState = 'ENERGY: AWAKENING';

                debugLine3.textContent = `{${energy}} ${energyState}`;
            }
        };

        let animationFrame: number;
        window.addEventListener('scroll', () => {
            if (animationFrame) cancelAnimationFrame(animationFrame);
            animationFrame = requestAnimationFrame(updateAnimations);
        });

        updateAnimations();
    };

    const handleStart = () => {
        setShowAudioEnable(false);
        setShowPreloader(true);
        document.body.style.overflow = 'hidden';

        let count = 0;
        const timer = setInterval(() => {
            count++;
            setCounter(count);
            if (count >= 100) {
                clearInterval(timer);
                setTimeout(() => {
                    setShowPreloader(false);
                    document.body.style.overflow = 'auto';
                    setupGeometricBackground();
                    startAnimations();
                }, 500);
            }
        }, 50);
    };

    return (
        <>
            {/* Audio Enable Screen */}
            {showAudioEnable && (
                <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[2000] text-white font-mono text-xs uppercase gap-8 text-center p-4">
                    <p className="leading-relaxed">
                        ENTER EXPERIENCE
                        <br />
                        DISCOVER LEARNING
                    </p>
                    <button
                        onClick={handleStart}
                        className="border border-white bg-transparent text-white px-8 py-4 font-mono text-xs uppercase cursor-pointer tracking-wider transition-all duration-300 hover:bg-white hover:text-black"
                    >
                        START JOURNEY
                    </button>
                </div>
            )}

            {/* Preloader */}
            {showPreloader && (
                <div className="fixed inset-0 bg-black flex items-center justify-center z-[2000] text-white font-mono text-xs uppercase tracking-wider">
                    <span>[{counter.toString().padStart(3, '0')}]</span>
                </div>
            )}

            {/* Main Content */}
            <div className="relative bg-black text-white font-mono text-xs uppercase overflow-x-hidden" style={{ height: '700vh' }}>


                {/* Header */}
                <header className="fixed top-0 left-0 w-full h-20 bg-transparent z-[100] flex items-center">
                    <div className="grid grid-cols-12 gap-4 items-center px-8 w-full h-full">
                        {/* Logo */}
                        <div className="col-span-2 relative flex items-center h-8">
                            <div className="relative w-full h-full">
                                <div className="absolute w-7 h-7 bg-white rounded-full top-1/2 left-0 transform -translate-y-1/2 transition-transform duration-500 hover:-translate-x-2"></div>
                                <div className="absolute w-7 h-7 bg-white rounded-full top-1/2 left-4 transform -translate-y-1/2 mix-blend-difference transition-transform duration-500 hover:translate-x-2"></div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="col-span-4 col-start-4">
                            <ul className="flex list-none gap-6 flex-wrap">
                                <li className="relative">
                                    <a href="#" className="text-white no-underline text-xs font-mono uppercase tracking-wider block relative pl-2 transition-colors duration-200">
                                        LEARNING JOURNEY
                                    </a>
                                    <div className="absolute top-1/2 left-0 w-1 h-1 bg-white transform -translate-y-1/2 scale-x-0 origin-left transition-transform duration-300"></div>
                                </li>
                                <li className="relative">
                                    <a href="#" className="text-white no-underline text-xs font-mono uppercase tracking-wider block relative pl-2 transition-colors duration-200">
                                        COURSES
                                    </a>
                                    <div className="absolute top-1/2 left-0 w-1 h-1 bg-white transform -translate-y-1/2 scale-x-0 origin-left transition-transform duration-300"></div>
                                </li>
                                <li className="relative">
                                    <a href="#" className="text-white no-underline text-xs font-mono uppercase tracking-wider block relative pl-2 transition-colors duration-200">
                                        KNOWLEDGE
                                    </a>
                                    <div className="absolute top-1/2 left-0 w-1 h-1 bg-white transform -translate-y-1/2 scale-x-0 origin-left transition-transform duration-300"></div>
                                </li>
                            </ul>
                        </nav>

                        {/* Contact Link */}
                        <div className="col-span-4 col-start-9 text-right">
                            <button
                                onClick={onGetStarted}
                                className="text-white no-underline text-xs font-mono uppercase tracking-wider transition-opacity duration-300 hover:opacity-70"
                            >
                                +START LEARNING
                            </button>
                        </div>
                    </div>
                </header>

                {/* Hero Tagline Section */}
                <div className="fixed top-1/2 left-8 transform -translate-y-1/2 z-[70] max-w-2xl pointer-events-none">
                    <div className="mb-8">
                        <h1 className="text-lg font-bold text-white mb-6 tracking-wider leading-tight font-mono uppercase">
                            LEARNHUB
                        </h1>
                        <div className="text-xs text-white/80 font-mono uppercase tracking-[0.2em] mb-8 leading-relaxed">
                            <p className="mb-2">AI-POWERED COURSE DISCOVERY</p>
                            <p className="mb-2">PERSONALIZED LEARNING PATHS</p>
                            <p>INFINITE KNOWLEDGE EXPANSION</p>
                        </div>
                        <div className="text-[12px] text-white/60 font-mono uppercase tracking-[0.15em] leading-relaxed">
                            <p className="mb-2">
                                DISCOVER COURSES MADE JUST FOR YOU
                            </p>
                            <p className="mb-2">
                                TAILORED TO YOUR INTERESTS • SKILLS • CAREER GOALS
                            </p>
                            <p>
                                JOIN 1M+ LEARNERS WORLDWIDE
                            </p>
                        </div>
                    </div>
                    <div className="pointer-events-auto">
                        <button
                            onClick={onGetStarted}
                            className="border-2 border-white bg-transparent text-white px-12 py-4 font-mono text-sm uppercase cursor-pointer tracking-[0.2em] transition-all duration-500 hover:bg-white hover:text-black hover:scale-105 hover:shadow-2xl"
                        >
                            BEGIN DISCOVERY
                        </button>
                    </div>
                </div>

                {/* Geometric Background */}
                <div className="fixed top-0 left-0 w-full h-full z-[50] pointer-events-none">
                    <svg id="geometric-svg" className="w-full h-full" viewBox="0 0 1920 1080">
                        <g id="grid-lines"></g>
                        <g id="circles-outline"></g>
                        <g id="circles-filled">
                            <clipPath id="right-half">
                                <rect x="960" y="0" width="960" height="1080" />
                            </clipPath>
                            <g clipPath="url(#right-half)"></g>
                        </g>
                        <text className="font-mono text-xs fill-white/60 uppercase tracking-wider" x="100" y="100">
                            INTELLIGENT
                        </text>
                        <text className="font-mono text-xs fill-white/60 uppercase tracking-wider" x="100" y="115">
                            RECOMMENDATIONS
                        </text>
                        <text className="font-mono text-xs fill-white/60 uppercase tracking-wider" x="1720" y="100">
                            PERSONALIZED
                        </text>
                        <text className="font-mono text-xs fill-white/60 uppercase tracking-wider" x="1720" y="115">
                            LEARNING PATHS
                        </text>
                        <text id="debug-line-1" className="font-mono text-xs fill-white/60 uppercase tracking-wider" x="100" y="980">
                            [432.0] AWARENESS: SILENCE
                        </text>
                        <text className="font-mono text-xs fill-white/60 uppercase tracking-wider" x="100" y="995">
                            .528.0 STATE: VOID
                        </text>
                        <text id="debug-line-3" className="font-mono text-xs fill-white/60 uppercase tracking-wider" x="100" y="1010">
                            {'{0.0}'} ENERGY: DORMANT
                        </text>
                        <text className="font-mono text-xs fill-white/60 uppercase tracking-wider" x="100" y="1025">
                            .100.0 PRESENCE: SOLID
                        </text>
                        <text className="font-mono text-xs fill-white/60 uppercase tracking-wider" x="1620" y="980">
                            COURSE MATCHING
                        </text>
                        <text className="font-mono text-xs fill-white/60 uppercase tracking-wider" x="1620" y="995">
                            ALGORITHM
                        </text>
                    </svg>
                </div>

                {/* Center Circle */}
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-[60] w-full flex flex-col items-center justify-center">
                    <div className="flex items-center justify-center">
                        <div
                            id="glow-circle"
                            className="w-20 h-20 bg-white rounded-full relative transition-all duration-300"
                            style={{ boxShadow: 'none' }}
                        ></div>
                    </div>
                </div>

                {/* Gradient Reveal */}
                <div className="gradient-reveal fixed top-0 left-0 w-full pointer-events-none z-[1500]" style={{
                    height: '500vh',
                    background: 'linear-gradient(to bottom, #000000 0%, #000000 20%, rgba(0, 0, 0, 0.8) 40%, rgba(0, 0, 0, 0.4) 70%, transparent 100%)',
                    transform: 'translateY(0)'
                }}></div>

                {/* Sections */}
                <section className="relative h-[200vh] bg-cover bg-center bg-fixed bg-no-repeat">
                    {/* Prismatic Aurora Burst - Multi-layered Gradient */}
                    <div
                        className="absolute inset-0 z-0"
                        style={{
                            background: `radial-gradient(ellipse 120% 80% at 70% 20%, rgba(255, 20, 147, 0.15), transparent 50%),
                          radial-gradient(ellipse 100% 60% at 30% 10%, rgba(0, 255, 255, 0.12), transparent 60%),
                          radial-gradient(ellipse 90% 70% at 50% 0%, rgba(138, 43, 226, 0.18), transparent 65%),
                          radial-gradient(ellipse 110% 50% at 80% 30%, rgba(255, 215, 0, 0.08), transparent 40%),
                          #000000`
                        }}
                    />
                    <div className="relative z-[2] h-full p-8"></div>
                </section>
                <section className="relative h-[200vh] bg-cover bg-center bg-fixed bg-no-repeat">
                    {/* Prismatic Aurora Burst - Multi-layered Gradient */}
                    <div className="min-h-screen w-full bg-black relative">
                        {/* Crimson Core Glow */}
                        <div
                            className="absolute inset-0 z-0"
                            style={{
                                background:
                                    "linear-gradient(0deg, rgba(0,0,0,0.6), rgba(0,0,0,0.6)), radial-gradient(68% 58% at 50% 50%, #c81e3a 0%, #a51d35 16%, #7d1a2f 32%, #591828 46%, #3c1722 60%, #2a151d 72%, #1f1317 84%, #141013 94%, #0a0a0a 100%), radial-gradient(90% 75% at 50% 50%, rgba(228,42,66,0.06) 0%, rgba(228,42,66,0) 55%), radial-gradient(150% 120% at 8% 8%, rgba(0,0,0,0) 42%, #0b0a0a 82%, #070707 100%), radial-gradient(150% 120% at 92% 92%, rgba(0,0,0,0) 42%, #0b0a0a 82%, #070707 100%), radial-gradient(60% 50% at 50% 60%, rgba(240,60,80,0.06), rgba(0,0,0,0) 60%), #050505",
                            }}
                        />
                        {/* Soft vignette to blend edges */}
                        <div
                            className="absolute inset-0 z-0 pointer-events-none"
                            style={{
                                backgroundImage:
                                    "radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.5) 100%)",
                                opacity: 0.95,
                            }}
                        />
                        {/* Your Content/Components */}
                    </div>
                    <div className="relative z-[2] h-full"></div>
                </section>
                <section className="relative h-[200vh] bg-cover bg-center bg-fixed bg-no-repeat">
                    {/* Prismatic Aurora Burst - Multi-layered Gradient */}
                    <div className="min-h-screen w-full relative">
                        {/* Aurora Dream Corner Whispers */}
                        <div className="min-h-screen w-full bg-black relative">
                            {/* Deep Ocean Glow */}
                            <div
                                className="absolute inset-0 z-0"
                                style={{
                                    background:
                                        "radial-gradient(70% 55% at 50% 50%, #2a5d77 0%, #184058 18%, #0f2a43 34%, #0a1b30 50%, #071226 66%, #040d1c 80%, #020814 92%, #01040d 97%, #000309 100%), radial-gradient(160% 130% at 10% 10%, rgba(0,0,0,0) 38%, #000309 76%, #000208 100%), radial-gradient(160% 130% at 90% 90%, rgba(0,0,0,0) 38%, #000309 76%, #000208 100%)"
                                }}
                            />
                            {/* Your Content/Components */}
                        </div>
                        {/* Your content goes here */}
                    </div>
                    <div className="relative z-[2] h-full p-8"></div>
                </section>
            </div>
        </>
    );
};