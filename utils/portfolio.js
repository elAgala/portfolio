export function mountPortfolio() {
  const disposals = [];
  const listen = (target, type, handler, options) => {
    target.addEventListener(type, handler, options);
    disposals.push(() => target.removeEventListener(type, handler, options));
  };
  let disposed = false;
  const root = document.documentElement;
  if (
    !window.location.hash &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    root.classList.add("booting");
  const body = document.body;
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".site-nav");
  const navLinks = [...document.querySelectorAll("[data-section-link]")];
  const sections = navLinks
    .map((link) => document.getElementById(link.dataset.sectionLink))
    .filter(Boolean);

  const bootCommand = document.querySelector("[data-boot-command]");
  const bootStatus = document.querySelector("[data-boot-status]");
  const command = "whoami";
  const mistypedCommand = "whoaim";
  let bootTimer = null;
  let bootComplete = false;

  const finishBoot = () => {
    if (bootComplete) return;
    bootComplete = true;
    window.clearTimeout(bootTimer);
    bootCommand.textContent = command;
    bootStatus.textContent = "Portfolio ready";
    root.classList.remove("booting");
    root.classList.add("boot-complete");
    window.removeEventListener("hashchange", finishBoot);
    document.removeEventListener("keydown", skipBootWithKey);
    document.removeEventListener("click", skipBootWithLink);
  };

  function skipBootWithKey(event) {
    if (event.key === "Enter" || event.key === "Escape") finishBoot();
  }

  function skipBootWithLink(event) {
    if (event.target.closest('a[href^="#"]')) finishBoot();
  }

  if (root.classList.contains("booting") && bootCommand) {
    bootCommand.textContent = "";
    const schedule = (callback, delay) => {
      bootTimer = window.setTimeout(callback, delay);
    };

    const typeCharacters = (characters, delay, onComplete) => {
      let characterIndex = 0;
      const typeNextCharacter = () => {
        if (characterIndex >= characters.length) {
          onComplete();
          return;
        }

        bootCommand.textContent += characters[characterIndex];
        characterIndex += 1;
        schedule(typeNextCharacter, delay);
      };
      typeNextCharacter();
    };

    const deleteCharacters = (count, delay, onComplete) => {
      let remaining = count;
      const deleteNextCharacter = () => {
        if (remaining === 0) {
          onComplete();
          return;
        }

        bootCommand.textContent = bootCommand.textContent.slice(0, -1);
        remaining -= 1;
        schedule(deleteNextCharacter, delay);
      };
      deleteNextCharacter();
    };

    schedule(() => {
      typeCharacters(mistypedCommand, 72, () => {
        bootStatus.textContent = "Correcting command";
        schedule(() => {
          deleteCharacters(2, 95, () => {
            schedule(() => {
              typeCharacters("mi", 90, () => schedule(finishBoot, 240));
            }, 120);
          });
        }, 420);
      });
    }, 280);
    listen(window, "hashchange", finishBoot);
    listen(document, "keydown", skipBootWithKey);
    listen(document, "click", skipBootWithLink);
  } else {
    bootCommand.textContent = command;
    bootStatus.textContent = "Portfolio ready";
    root.classList.remove("booting");
  }

  const setMenu = (open) => {
    navigation.dataset.open = String(open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.textContent = open ? "Close" : "Menu";
    body.classList.toggle("menu-open", open);
  };

  listen(menuButton, "click", () => {
    setMenu(navigation.dataset.open !== "true");
  });

  listen(navigation, "click", (event) => {
    if (event.target.closest("a")) setMenu(false);
  });

  listen(document, "keydown", (event) => {
    if (event.key === "Escape" && navigation.dataset.open === "true") {
      setMenu(false);
      menuButton.focus();
    }
  });

  const setActiveSection = (id) => {
    navLinks.forEach((link) => {
      if (link.dataset.sectionLink === id) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-20% 0px -58%", threshold: [0.08, 0.25, 0.5] },
    );
    sections.forEach((section) => sectionObserver.observe(section));
    disposals.push(() => sectionObserver.disconnect());
  }

  let progressFrame = null;
  const updateProgress = () => {
    const scrollable =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress =
      scrollable > 0
        ? Math.min(1, Math.max(0, window.scrollY / scrollable))
        : 0;
    document.documentElement.style.setProperty(
      "--page-progress",
      progress.toFixed(4),
    );
    progressFrame = null;
  };

  listen(
    window,
    "scroll",
    () => {
      if (!progressFrame) progressFrame = requestAnimationFrame(updateProgress);
    },
    { passive: true },
  );
  updateProgress();

  const initializeMusic = async () => {
    const musicPlayer = document.querySelector("[data-music-player]");
    const soundcloudFrame = document.querySelector("[data-soundcloud-player]");
    const playbackButton = document.querySelector("[data-playback]");
    const previousButton = document.querySelector("[data-previous]");
    const nextButton = document.querySelector("[data-next]");
    const muteButton = document.querySelector("[data-mute]");
    const musicStatus = document.querySelector("[data-music-status]");
    const trackTitle = document.querySelector("[data-track-title]");
    const trackArtist = document.querySelector("[data-track-artist]");
    const trackPosition = document.querySelector("[data-track-position]");
    const trackLink = document.querySelector("[data-track-link]");
    const trackProgress = document.querySelector("[data-track-progress]");
    const currentTime = document.querySelector("[data-current-time]");
    const trackDuration = document.querySelector("[data-track-duration]");

    if (
      musicPlayer &&
      soundcloudFrame &&
      playbackButton &&
      previousButton &&
      nextButton &&
      muteButton &&
      musicStatus &&
      trackTitle &&
      trackArtist &&
      trackPosition &&
      trackLink &&
      trackProgress &&
      currentTime &&
      trackDuration
    ) {
      const tracks = [
        {
          title: "Aspects Of Rhythm",
          artist: "Audio Junkies",
          url: "https://soundcloud.com/maccabihouse/audio-junkies-aspects-of-rhythm-1",
          start: 182000,
        },
        {
          title: "Wow",
          artist: "Sako Isoyan",
          url: "https://soundcloud.com/isoformance/sako-isoyan-wow",
          start: 175000,
        },
        {
          title: "UFO On A Limousine",
          artist: "Breezy S",
          // The artist upload currently returns 404 for both audio streams.
          // This release premiere is the same 6:32 recording.
          url: "https://soundcloud.com/user-956047264/breezy-s-ufo-on-a-limousine",
          start: 208000,
        },
      ];
      let currentTrack = 0;
      let playing = false;
      let muted = false;
      let widgetReady = false;
      let loadingTrack = false;
      let duration = 0;
      let scrubbing = false;
      let pendingStart = tracks[0].start;

      const current = () => tracks[currentTrack];

      const formatTime = (milliseconds) => {
        const seconds = Math.max(0, Math.floor(milliseconds / 1000));
        return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
      };

      const renderTimeline = (position) => {
        const safePosition = Math.min(
          Math.max(0, position),
          duration || position,
        );
        trackProgress.max = String(duration || 1);
        trackProgress.value = String(safePosition);
        currentTime.textContent = formatTime(safePosition);
        trackDuration.textContent = formatTime(duration);
        trackProgress.setAttribute(
          "aria-valuetext",
          `${formatTime(safePosition)} of ${formatTime(duration)}`,
        );
      };

      const renderTrack = () => {
        const track = current();
        trackTitle.textContent = track.title;
        trackArtist.textContent = `${track.artist} · SoundCloud`;
        trackPosition.textContent = `${String(currentTrack + 1).padStart(2, "0")} / ${String(tracks.length).padStart(2, "0")}`;
        trackLink.href = track.url;
        playbackButton.setAttribute("aria-pressed", String(playing));
        playbackButton.setAttribute(
          "aria-label",
          playing
            ? `Pause ${track.title} by ${track.artist}`
            : `Play ${track.title} by ${track.artist}`,
        );
        muteButton.setAttribute("aria-pressed", String(muted));
        muteButton.setAttribute(
          "aria-label",
          muted ? "Unmute audio" : "Mute audio",
        );
      };

      const setControlsDisabled = (disabled) => {
        previousButton.disabled = disabled;
        playbackButton.disabled = disabled;
        nextButton.disabled = disabled;
        muteButton.disabled = disabled;
        trackProgress.disabled = disabled;
      };

      const setPlayerState = (state, status) => {
        musicPlayer.dataset.state = state;
        musicStatus.textContent = status;
        playbackButton.toggleAttribute("aria-busy", state === "loading");
      };

      renderTrack();

      try {
        if (!window.SC?.Widget)
          await new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://w.soundcloud.com/player/api.js";
            const timer = window.setTimeout(
              () => reject(new Error("SoundCloud timed out")),
              15000,
            );
            script.onload = () => {
              clearTimeout(timer);
              resolve();
            };
            script.onerror = () => {
              clearTimeout(timer);
              reject(new Error("SoundCloud unavailable"));
            };
            document.head.appendChild(script);
            disposals.push(() => {
              clearTimeout(timer);
              script.remove();
              reject(new Error("Disposed"));
            });
          });
      } catch {
        if (disposed) return;
      }
      if (disposed) return;
      if (!window.SC || !window.SC.Widget) {
        setPlayerState(
          "error",
          "SoundCloud playback unavailable. Open the track title to listen on SoundCloud.",
        );
        setControlsDisabled(true);
      } else {
        const widget = window.SC.Widget(soundcloudFrame);
        let loadTimeout;
        let playbackTimeout;
        let playbackStart = 0;
        const armLoadTimeout = () => {
          clearTimeout(loadTimeout);
          loadTimeout = window.setTimeout(() => {
            if (disposed) return;
            loadingTrack = false;
            playing = false;
            renderTrack();
            setControlsDisabled(false);
            setPlayerState(
              "error",
              "SoundCloud took too long. Retry Play or open the track title.",
            );
          }, 20000);
        };
        armLoadTimeout();
        disposals.push(() => {
          clearTimeout(loadTimeout);
          clearTimeout(playbackTimeout);
          widget.pause();
          Object.values(window.SC.Widget.Events).forEach((event) =>
            widget.unbind(event),
          );
        });

        const loadTrack = (index, shouldPlay) => {
          clearTimeout(playbackTimeout);
          armLoadTimeout();
          currentTrack = (index + tracks.length) % tracks.length;
          playing = false;
          loadingTrack = true;
          duration = 0;
          pendingStart = current().start;
          renderTrack();
          renderTimeline(current().start);
          setControlsDisabled(true);
          setPlayerState("loading", `Loading ${current().title}`);

          widget.load(current().url, {
            auto_play: false,
            buying: false,
            sharing: false,
            download: false,
            show_artwork: false,
            show_playcount: false,
            show_user: false,
            callback: () => {
              if (disposed) return;
              clearTimeout(loadTimeout);
              widget.setVolume(muted ? 0 : 80);
              widget.getDuration((value) => {
                if (disposed) return;
                duration = value;
                renderTimeline(current().start);
              });
              loadingTrack = false;
              widgetReady = true;
              setControlsDisabled(false);
              setPlayerState(
                "paused",
                `${current().title} ready at selected start`,
              );
              if (shouldPlay) startPlayback();
            },
          });
        };

        widget.bind(window.SC.Widget.Events.READY, () => {
          if (disposed || loadingTrack) return;
          clearTimeout(loadTimeout);
          widgetReady = true;
          widget.setVolume(muted ? 0 : 80);
          widget.getDuration((value) => {
            if (disposed) return;
            duration = value;
            renderTimeline(current().start);
          });
          setControlsDisabled(false);
          setPlayerState(
            "paused",
            `${current().title} ready at selected start`,
          );
        });

        widget.bind(window.SC.Widget.Events.PLAY, () => {
          if (disposed || loadingTrack) return;
          playing = true;
          renderTrack();
          setPlayerState(
            "playing",
            `Playing ${current().title} by ${current().artist}`,
          );
        });

        widget.bind(window.SC.Widget.Events.PAUSE, () => {
          if (disposed || loadingTrack || musicPlayer.dataset.state === "error") return;
          playing = false;
          renderTrack();
          setPlayerState("paused", `${current().title} paused`);
        });

        widget.bind(window.SC.Widget.Events.PLAY_PROGRESS, (event) => {
          if (disposed || loadingTrack) return;
          if (event.currentPosition > playbackStart + 250)
            clearTimeout(playbackTimeout);
          if (!scrubbing) renderTimeline(event.currentPosition);
        });

        widget.bind(window.SC.Widget.Events.FINISH, () => {
          loadTrack(currentTrack + 1, true);
        });

        widget.bind(window.SC.Widget.Events.ERROR, () => {
          clearTimeout(loadTimeout);
          clearTimeout(playbackTimeout);
          playing = false;
          loadingTrack = false;
          renderTrack();
          setControlsDisabled(false);
          setPlayerState(
            "error",
            `${current().title} is unavailable. Retry Play, choose another track or open the track title.`,
          );
        });

        const startPlayback = () => {
          clearTimeout(playbackTimeout);
          playbackStart = pendingStart ?? Number(trackProgress.value);
          playbackTimeout = window.setTimeout(() => {
            if (disposed) return;
            widget.pause();
            playing = false;
            pendingStart = playbackStart;
            renderTrack();
            setPlayerState(
              "error",
              "Audio could not start. Retry Play or open the track title on SoundCloud.",
            );
          }, 15000);
          // Seeking on READY can trigger playback before a user gesture.
          // Apply the requested offset only when playback is requested.
          if (pendingStart !== null) {
            widget.seekTo(pendingStart);
            pendingStart = null;
          }
          widget.play();
        };

        listen(playbackButton, "click", () => {
          if (musicPlayer.dataset.state === "error") {
            loadTrack(currentTrack, true);
            return;
          }
          if (!widgetReady || loadingTrack) return;
          if (playing) {
            clearTimeout(playbackTimeout);
            widget.pause();
          } else {
            setPlayerState("loading", `Starting ${current().title}`);
            startPlayback();
          }
        });

        listen(previousButton, "click", () =>
          loadTrack(currentTrack - 1, true),
        );
        listen(nextButton, "click", () => loadTrack(currentTrack + 1, true));

        listen(trackProgress, "input", () => {
          scrubbing = true;
          renderTimeline(Number(trackProgress.value));
        });

        listen(trackProgress, "change", () => {
          widget.seekTo(Number(trackProgress.value));
          scrubbing = false;
          musicStatus.textContent = `${current().title} moved to ${currentTime.textContent}`;
        });

        listen(muteButton, "click", () => {
          muted = !muted;
          widget.setVolume(muted ? 0 : 80);
          renderTrack();
          musicStatus.textContent = muted ? "Sound muted" : "Sound on";
        });
      }
    }
  };
  void initializeMusic();

  const copyButton = document.querySelector(".copy-email");
  const copyStatus = document.querySelector(".copy-status");
  let copyTimer = null;

  const fallbackCopy = (value) => {
    const input = document.createElement("textarea");
    input.value = value;
    input.setAttribute("readonly", "");
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.appendChild(input);
    input.select();
    const copied = document.execCommand("copy");
    input.remove();
    if (!copied) throw new Error("Copy command failed");
  };

  listen(copyButton, "click", async () => {
    clearTimeout(copyTimer);
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(copyButton.dataset.email);
      } else {
        fallbackCopy(copyButton.dataset.email);
      }
      copyButton.dataset.state = "copied";
      copyButton.querySelector("span").textContent = "Email copied";
      copyStatus.textContent = "Email address copied to the clipboard.";
    } catch {
      copyButton.dataset.state = "error";
      copyButton.querySelector("span").textContent = "Use mail link";
      copyStatus.textContent = "Copy failed. Use the email link instead.";
    }

    copyTimer = window.setTimeout(() => {
      copyButton.dataset.state = "idle";
      copyButton.querySelector("span").textContent = "Copy email";
    }, 2400);
  });
  return () => {
    disposed = true;
    window.clearTimeout(bootTimer);
    window.clearTimeout(copyTimer);
    cancelAnimationFrame(progressFrame);
    disposals.forEach((dispose) => dispose());
    root.classList.remove("booting", "boot-complete");
    body.classList.remove("menu-open");
    root.style.removeProperty("--page-progress");
  };
}
