import type { MusicObserver } from './music'
import { mountSoundCloud } from './soundcloud-player'
import { createListenerRegistry, requireElement } from './dom'

export function mountPortfolio(options: MusicObserver = {}) {
  const disposals: Array<() => void> = []
  const listen = createListenerRegistry(disposals)
  let disposed = false
  const root = document.documentElement
  if (
    !window.location.hash &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
    root.classList.add('booting')
  const body = document.body
  const menuButton = requireElement<HTMLButtonElement>('.menu-toggle')
  const navigation = requireElement<HTMLElement>('.site-nav')
  const navLinks = [
    ...document.querySelectorAll<HTMLAnchorElement>('[data-section-link]'),
  ]
  const sections = navLinks
    .map((link) => document.getElementById(link.dataset.sectionLink ?? ''))
    .filter((section): section is HTMLElement => section !== null)

  const bootCommand = requireElement('[data-boot-command]')
  const bootStatus = requireElement('[data-boot-status]')
  const command = 'whoami'
  const mistypedCommand = 'whoaim'
  let bootTimer = 0
  let bootComplete = false

  const finishBoot = () => {
    if (bootComplete) return
    bootComplete = true
    window.clearTimeout(bootTimer)
    bootCommand.textContent = command
    bootStatus.textContent = 'Portfolio ready'
    root.classList.remove('booting')
    root.classList.add('boot-complete')
    window.removeEventListener('hashchange', finishBoot)
    document.removeEventListener('keydown', skipBootWithKey)
    document.removeEventListener('click', skipBootWithLink)
  }

  function skipBootWithKey(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === 'Escape') finishBoot()
  }

  function skipBootWithLink(event: MouseEvent) {
    if (event.target instanceof Element && event.target.closest('a[href^="#"]'))
      finishBoot()
  }

  if (root.classList.contains('booting') && bootCommand) {
    bootCommand.textContent = ''
    const schedule = (callback: () => void, delay: number) => {
      bootTimer = window.setTimeout(callback, delay)
    }

    const typeCharacters = (
      characters: string,
      delay: number,
      onComplete: () => void,
    ) => {
      let characterIndex = 0
      const typeNextCharacter = () => {
        if (characterIndex >= characters.length) {
          onComplete()
          return
        }

        bootCommand.textContent =
          (bootCommand.textContent ?? '') + characters.charAt(characterIndex)
        characterIndex += 1
        schedule(typeNextCharacter, delay)
      }
      typeNextCharacter()
    }

    const deleteCharacters = (
      count: number,
      delay: number,
      onComplete: () => void,
    ) => {
      let remaining = count
      const deleteNextCharacter = () => {
        if (remaining === 0) {
          onComplete()
          return
        }

        bootCommand.textContent = (bootCommand.textContent ?? '').slice(0, -1)
        remaining -= 1
        schedule(deleteNextCharacter, delay)
      }
      deleteNextCharacter()
    }

    schedule(() => {
      typeCharacters(mistypedCommand, 72, () => {
        bootStatus.textContent = 'Correcting command'
        schedule(() => {
          deleteCharacters(2, 95, () => {
            schedule(() => {
              typeCharacters('mi', 90, () => schedule(finishBoot, 240))
            }, 120)
          })
        }, 420)
      })
    }, 280)
    listen(window, 'hashchange', finishBoot)
    listen(document, 'keydown', skipBootWithKey)
    listen(document, 'click', skipBootWithLink)
  } else {
    bootCommand.textContent = command
    bootStatus.textContent = 'Portfolio ready'
    root.classList.remove('booting')
  }

  const setMenu = (open: boolean) => {
    navigation.dataset.open = String(open)
    menuButton.setAttribute('aria-expanded', String(open))
    menuButton.textContent = open ? 'Close' : 'Menu'
    body.classList.toggle('menu-open', open)
  }

  listen(menuButton, 'click', () => {
    setMenu(navigation.dataset.open !== 'true')
  })

  listen(navigation, 'click', (event) => {
    if (event.target instanceof Element && event.target.closest('a'))
      setMenu(false)
  })

  listen(document, 'keydown', (event) => {
    if (event.key === 'Escape' && navigation.dataset.open === 'true') {
      setMenu(false)
      menuButton.focus()
    }
  })

  const setActiveSection = (id: string) => {
    navLinks.forEach((link) => {
      if (link.dataset.sectionLink === id) {
        link.setAttribute('aria-current', 'location')
      } else {
        link.removeAttribute('aria-current')
      }
    })
  }

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActiveSection(visible.target.id)
      },
      { rootMargin: '-20% 0px -58%', threshold: [0.08, 0.25, 0.5] },
    )
    sections.forEach((section) => sectionObserver.observe(section))
    disposals.push(() => sectionObserver.disconnect())
  }

  let progressFrame = 0
  const updateProgress = () => {
    const scrollable =
      document.documentElement.scrollHeight - window.innerHeight
    const progress =
      scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0
    document.documentElement.style.setProperty(
      '--page-progress',
      progress.toFixed(4),
    )
    progressFrame = 0
  }

  listen(
    window,
    'scroll',
    () => {
      if (!progressFrame) progressFrame = requestAnimationFrame(updateProgress)
    },
    { passive: true },
  )
  updateProgress()

  disposals.push(mountSoundCloud(options))

  const copyButton = requireElement<HTMLButtonElement>('.copy-email')
  const copyStatus = requireElement('.copy-status')
  let copyTimer = 0

  const fallbackCopy = (value: string) => {
    const input = document.createElement('textarea')
    input.value = value
    input.setAttribute('readonly', '')
    input.style.position = 'fixed'
    input.style.opacity = '0'
    document.body.appendChild(input)
    input.select()
    const copied = document.execCommand('copy')
    input.remove()
    if (!copied) throw new Error('Copy command failed')
  }

  listen(copyButton, 'click', async () => {
    clearTimeout(copyTimer)
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(copyButton.dataset.email ?? '')
      } else {
        fallbackCopy(copyButton.dataset.email ?? '')
      }
      if (disposed) return
      copyButton.dataset.state = 'copied'
      requireElement('.copy-email span').textContent = 'Email copied'
      copyStatus.textContent = 'Email address copied to the clipboard.'
    } catch {
      copyButton.dataset.state = 'error'
      requireElement('.copy-email span').textContent = 'Use mail link'
      copyStatus.textContent = 'Copy failed. Use the email link instead.'
    }

    copyTimer = window.setTimeout(() => {
      copyButton.dataset.state = 'idle'
      requireElement('.copy-email span').textContent = 'Copy email'
    }, 2400)
  })
  return () => {
    disposed = true
    window.clearTimeout(bootTimer)
    window.clearTimeout(copyTimer)
    cancelAnimationFrame(progressFrame)
    disposals.forEach((dispose) => dispose())
    root.classList.remove('booting', 'boot-complete')
    body.classList.remove('menu-open')
    root.style.removeProperty('--page-progress')
  }
}
