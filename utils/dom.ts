export function requireElement<T extends HTMLElement = HTMLElement>(
  selector: string,
): T {
  const element = document.querySelector<T>(selector)
  if (!element) throw new Error(`Missing portfolio element: ${selector}`)
  return element
}

export function createListenerRegistry(disposals: Array<() => void>) {
  type Events = GlobalEventHandlersEventMap & WindowEventMap & DocumentEventMap
  return <K extends keyof Events>(
    target: EventTarget,
    type: K,
    handler: (event: Events[K]) => void,
    options?: AddEventListenerOptions,
  ) => {
    const listener = handler as EventListener
    target.addEventListener(type, listener, options)
    disposals.push(() => target.removeEventListener(type, listener, options))
  }
}
