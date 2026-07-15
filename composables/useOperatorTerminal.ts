import type { OperatorTerminalMode } from '~/types/workbench'

export function useOperatorTerminal() {
  const openRequest = useState('operator-terminal-open-request', () => 0)
  const closeRequest = useState('operator-terminal-close-request', () => 0)
  const mode = useState<OperatorTerminalMode>('operator-terminal-mode', () => 'idle')

  function requestOpen() {
    if (mode.value === 'idle')
      openRequest.value += 1
  }

  function requestClose() {
    if (mode.value === 'entering' || mode.value === 'terminal')
      closeRequest.value += 1
  }

  return {
    openRequest,
    closeRequest,
    mode,
    requestOpen,
    requestClose,
  }
}
