<script setup lang="ts">
import portfolioStyles from "~/assets/css/portfolio.css?inline";
import { mountPortfolio } from "~/utils/portfolio";
import { initialMusicState, musicTracks, type MusicActions } from "~/utils/music";

const music = shallowRef({ ...initialMusicState });
const musicActions = shallowRef<MusicActions | null>(null);

useHead({
  style: [{ key: "portfolio-design", innerHTML: portfolioStyles }],
  script: [
    {
      key: "portfolio-boot",
      innerHTML: `if (location.pathname === '/' && !location.hash && !matchMedia('(prefers-reduced-motion: reduce)').matches) { document.documentElement.classList.add('booting'); setTimeout(() => document.documentElement.classList.remove('booting'), 5000); }`,
    },
  ],
});
let dispose: (() => void) | undefined;
onMounted(() => {
  dispose = mountPortfolio({
    onMusicState: (state) => { music.value = state; },
    onMusicActions: (actions) => { musicActions.value = actions; },
  });
});
onBeforeUnmount(() => {
  dispose?.();
});
</script>

<template>
  <div class="portfolio-page">
    <SoundCloudBackdrop :music="music" />
    <FloatingMusicPlayer :music="music" :actions="musicActions" />
    <a class="skip-link" href="#main-content">Skip to the portfolio</a>
    <span class="reading-progress" aria-hidden="true" />

    <header class="site-header">
      <div class="header-inner">
        <a class="site-mark" href="#identity" aria-label="Julián Benitez, home">
          <img
            class="site-mark__portrait"
            src="/portfolio/images/julian-benitez.png"
            alt=""
            width="1254"
            height="1254"
          >
          <span>Julián Benitez</span>
        </a>

        <nav
          id="primary-navigation"
          class="site-nav"
          aria-label="Primary navigation"
          data-open="false"
        >
          <a
            href="#identity"
            data-section-link="identity"
            aria-current="location"
            >Identity</a
          >
          <a href="#systems" data-section-link="systems">Agala Labs</a>
          <a href="/resume" target="_blank" rel="noopener noreferrer">Resume</a>
          <a href="#contact" data-section-link="contact">Contact</a>
        </nav>

        <button
          class="menu-toggle"
          type="button"
          aria-expanded="false"
          aria-controls="primary-navigation"
        >
          Menu
        </button>
      </div>
    </header>

    <main id="main-content" class="shell">
      <section id="identity" class="hero" aria-labelledby="hero-title">
        <div class="hero-top">
          <div class="terminal-intro">
            <p class="terminal-line" aria-hidden="true">
              <span class="terminal-prompt">$</span
              ><span data-boot-command>whoami</span
              ><span class="terminal-cursor" />
            </p>
            <p
              class="sr-only"
              data-boot-status
              role="status"
              aria-live="polite"
            >
              Loading portfolio
            </p>
          </div>
          <p class="hero-state">
            <span>Technical Lead / Software Engineer</span
            ><span>Buenos Aires, Argentina</span>
          </p>
        </div>

        <div class="hero-main">
          <h1 id="hero-title" class="hero-title">
            <span class="title-line"><span>Julián</span></span>
            <span class="title-line"><span>Benitez</span></span>
          </h1>
          <figure class="hero-portrait-wrap">
            <img
              class="hero-portrait"
              src="/portfolio/images/julian-benitez.png"
              alt="Portrait of Julián Benitez"
              width="1254"
              height="1254"
            >
          </figure>
        </div>

        <div class="hero-bottom">
          <p class="hero-intro">
            <strong
              >I'm Julián, a Technical Lead and Software Engineer based in
              Buenos Aires.</strong
            >
            At AlixPartners I set technical direction and stay close to
            architecture, implementation and review. Agala is the nickname I use
            online. Agala Labs is where I build and operate my own software.
          </p>

          <div class="hero-identity">
            <div class="music-player" data-music-player data-state="paused">
              <div class="music-heading">
                <span class="meta-label">Listen to some house music I like</span>
                <span class="music-eq" aria-hidden="true"
                  ><span /><span /><span /><span
                /></span>
              </div>
              <span
                class="sr-only"
                role="status"
                aria-live="polite"
                data-music-status
                >Paused</span
              >
              <div class="music-track">
                <div class="music-track-top">
                  <a
                    class="music-track-link"
                    data-track-link
                    href="https://soundcloud.com/maccabihouse/audio-junkies-aspects-of-rhythm-1"
                    target="_blank"
                    rel="noreferrer"
                    ><span data-track-title>Aspects Of Rhythm</span></a
                  >
                  <span class="music-position" data-track-position
                    >01 / {{ String(musicTracks.length).padStart(2, '0') }}</span
                  >
                </div>
                <span class="music-credit" data-track-artist
                  >Audio Junkies · SoundCloud</span
                >
              </div>
              <div class="music-controls">
                <div class="music-transport">
                  <button
                    class="music-control"
                    type="button"
                    data-previous
                    aria-label="Play previous track"
                    disabled
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M6 5v14M18 6l-8 6 8 6V6Z" />
                    </svg>
                  </button>
                  <button
                    class="music-control music-control--playback"
                    type="button"
                    data-playback
                    aria-label="Play Aspects Of Rhythm by Audio Junkies"
                    aria-pressed="false"
                    disabled
                  >
                    <svg
                      class="music-icon--play"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="m9 6 9 6-9 6V6Z" />
                    </svg>
                    <svg
                      class="music-icon--pause"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M9 6v12M15 6v12" />
                    </svg>
                  </button>
                  <button
                    class="music-control"
                    type="button"
                    data-next
                    aria-label="Play next track"
                    disabled
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M18 5v14M6 6l8 6-8 6V6Z" />
                    </svg>
                  </button>
                </div>
                <div class="music-timeline">
                  <span class="music-time" data-current-time>03:02</span>
                  <input
                    class="music-progress"
                    data-track-progress
                    type="range"
                    min="0"
                    max="1"
                    value="0"
                    step="250"
                    aria-label="Seek in current track"
                    disabled
                  >
                  <span class="music-time" data-track-duration>00:00</span>
                </div>
              </div>
              <div class="soundcloud-frame-host" aria-hidden="true">
                <iframe
                  class="soundcloud-frame"
                  data-soundcloud-player
                  title="SoundCloud audio player"
                  tabindex="-1"
                  allow="autoplay"
                />
              </div>
            </div>
          </div>

          <div class="hero-links" aria-label="Primary links">
            <a class="text-link" href="#systems"
              ><span>Explore Agala Labs</span></a
            >
            <a class="text-link" href="#contact"
              ><span>Email me</span></a
            >
          </div>
        </div>
      </section>

      <section class="section" aria-labelledby="operating-title">
        <div class="intro-grid">
          <div class="intro-rail">
            <p class="section-index">How I work</p>
          </div>

          <div class="intro-statement">
            <h2 id="operating-title">I lead by building.</h2>
            <p>
              I lead multidisciplinary teams at AlixPartners, working across
              Argentina, the US and Europe. I stay involved in architecture,
              implementation and review, and help engineers work through
              technical decisions.
            </p>
          </div>

          <ol class="operating-range" aria-label="Operating domains">
            <li>
              <strong class="range-title">Technical direction</strong>
              <span class="range-copy"
                >I turn product requirements into architecture decisions and
                delivery plans the team can work from.</span
              >
            </li>
            <li>
              <strong class="range-title">Team &amp; craft</strong>
              <span class="range-copy"
                >I mentor engineers, review code and co-lead the Frontend Guild,
                building shared interface patterns and engineering practices.</span
              >
            </li>
            <li>
              <strong class="range-title">Delivery &amp; operations</strong>
              <span class="range-copy"
                >I stay involved through implementation and production, and
                automate recurring delivery and support work.</span
              >
            </li>
          </ol>
        </div>
      </section>

      <section class="section ai-work" aria-labelledby="ai-title">
        <header class="ai-heading">
          <p class="section-index">AI in the loop</p>
          <h2 id="ai-title">AI in my engineering workflow.</h2>
          <p class="ai-intro">
            I use coding agents to explore systems, plan changes and implement
            them. For complex work, I separate planning, implementation and
            review, with explicit decisions and executable checks between stages.
          </p>
        </header>

        <ol class="ai-workflow" aria-label="Engineering workflow with coding agents">
          <li class="ai-step">
            <h3>Plan</h3>
            <p>Start from the codebase and product constraints. Resolve open
              decisions and define a bounded change.</p>
          </li>
          <li class="ai-step">
            <h3>Implement</h3>
            <p>Give the implementation agent a clear task, relevant context and
              acceptance criteria.</p>
          </li>
          <li class="ai-step">
            <h3>Review &amp; verify</h3>
            <p>Review the diff separately, run checks and inspect the result
              before shipping.</p>
          </li>
        </ol>
      </section>

      <ToolingSection />

      <section
        id="systems"
        class="section systems"
        aria-labelledby="systems-title"
      >
        <header class="section-heading">
          <p class="section-index">Software platform</p>
          <h2 id="systems-title">Agala Labs.</h2>
          <p class="section-description">
            The technical home for my applications, shared services, UI library,
            infrastructure and this portfolio.
          </p>
        </header>

        <div class="architecture-overview">
          <div class="architecture-foundation">
            <h3>Nuxt applications. Go services. My own operating layer.</h3>
            <p>
              The applications are built in Nuxt. Shared capabilities live in Go
              microservices, with PostgreSQL underneath and a standardized path
              to production. The products do not need to share the same backend
              shape.
            </p>
            <p>
              This portfolio is part of Agala Labs too. Building the whole setup
              has been one of my favorite technical challenges. I like owning
              the path from UI components and service boundaries to servers and
              releases, then making that path reusable for whatever I build
              next.
            </p>
          </div>

          <dl class="architecture-layers">
            <div class="architecture-row">
              <dt>
                Applications
                <span class="architecture-stack">Nuxt · Vue · TypeScript</span>
              </dt>
              <dd>
                Nuxt applications handle the web experience. Each product keeps
                the backend architecture its domain requires.
              </dd>
            </div>
            <div class="architecture-row">
              <dt>
                UI library
                <span class="architecture-stack"
                  >@agala-labs/ui · Vue 3 · TypeScript</span
                >
              </dt>
              <dd>
                Shared components cover forms, navigation, overlays, data
                display and layout, with one semantic token system across
                applications.
              </dd>
            </div>
            <div class="architecture-row">
              <dt>
                Shared services
                <span class="architecture-stack">Go · HTTP APIs</span>
              </dt>
              <dd>
                Capabilities that belong outside a product live in focused Go
                microservices with explicit HTTP boundaries.
              </dd>
            </div>
            <div class="architecture-row">
              <dt>Data <span class="architecture-stack">PostgreSQL</span></dt>
              <dd>
                PostgreSQL provides the persistent data layer for product data
                and shared services.
              </dd>
            </div>
            <div class="architecture-row">
              <dt>
                Infrastructure
                <span class="architecture-stack"
                  >Linux · Docker · OpenTofu</span
                >
              </dt>
              <dd>
                Servers and workloads are defined as part of the platform
                instead of being configured as one-off environments.
              </dd>
            </div>
            <div class="architecture-row">
              <dt>
                Delivery
                <span class="architecture-stack">Ansible · Woodpecker CI</span>
              </dt>
              <dd>
                Shared pipelines and deployment playbooks give every new
                application or service a known, repeatable route to production.
              </dd>
            </div>
          </dl>

          <a
            class="architecture-link"
            href="https://agala.com.ar"
            target="_blank"
            rel="noreferrer"
            >Visit Agala Labs</a
          >
        </div>
      </section>

      <section
        id="contact"
        class="section contact"
        aria-labelledby="contact-title"
      >
        <header class="contact-heading">
          <p class="section-index">Contact</p>
          <div class="contact-copy">
            <h2 id="contact-title">Let’s talk.</h2>
          </div>
        </header>

        <div class="contact-actions">
          <div class="contact-primary">
            <a class="contact-email" href="mailto:julian@benitez.com.ar"
              >julian@benitez.com.ar</a
            >
            <button
              class="copy-email"
              type="button"
              data-email="julian@benitez.com.ar"
              data-state="idle"
            >
              <span>Copy email</span>
            </button>
          </div>
          <p class="copy-status" role="status" aria-live="polite" />
          <nav class="contact-links" aria-label="Contact links">
            <a href="/resume" target="_blank" rel="noopener noreferrer">Resume ↗</a>
            <a
              href="https://github.com/elAgala"
              target="_blank"
              rel="noreferrer"
              >GitHub ↗</a
            >
            <a href="#identity">Back to identity ↑</a>
          </nav>
        </div>
      </section>

      <footer class="site-footer">
        <span>© 2026 Julián Benitez</span>
        <a class="site-footer__brand" href="https://agala.com.ar" target="_blank" rel="noopener noreferrer">
          <span>Part of</span>
          <img src="/portfolio/images/agala-logo.png" alt="Agala Labs" width="1074" height="476" loading="lazy">
        </a>
        <span>Buenos Aires, Argentina</span>
      </footer>
    </main>
  </div>
</template>
