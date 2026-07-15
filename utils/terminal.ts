export interface TerminalProjectTarget {
  slug: string
  title: string
  path: string
  repository: string
}

export interface TerminalContext {
  name: string
  title: string
  location: string
  email: string
  github: string
  projects: TerminalProjectTarget[]
  experience: Array<{
    dates: string
    role: string
    company: string
    summary: string
  }>
}

export type TerminalAction =
  | { type: 'navigate', target: string }
  | { type: 'external', target: string }
  | { type: 'clear' }
  | { type: 'close' }

export interface TerminalResult {
  output: string[]
  action?: TerminalAction
}

const commands = ['help', 'whoami', 'experience', 'lab', 'projects', 'open', 'source', 'resume', 'contact', 'clear', 'exit']

function projectFor(value: string | undefined, context: TerminalContext) {
  if (!value)
    return undefined
  const normalized = value.toLowerCase()
  return context.projects.find(project => project.slug === normalized || project.title.toLowerCase().replaceAll(' ', '-') === normalized)
}

function missingTarget(command: string, context: TerminalContext): TerminalResult {
  return {
    output: [
      `${command}: missing target`,
      `available: ${context.projects.map(project => project.slug).join(' · ')}`,
    ],
  }
}

export function runTerminalCommand(rawInput: string, context: TerminalContext): TerminalResult {
  const [command = '', target] = rawInput.trim().split(/\s+/)
  const normalizedCommand = command.toLowerCase()

  if (!normalizedCommand)
    return { output: [] }

  if (normalizedCommand === 'help') {
    return {
      output: [
        'AVAILABLE COMMANDS',
        'help                 show this reference',
        'whoami               print the operator profile',
        'experience           print the professional record',
        'lab                  inspect the private lab scope',
        'projects             list selected open-source work',
        'open <project>       open a case study',
        'source <project>     open repository source',
        'resume               open the formal résumé',
        'contact              jump to contact',
        'clear                clear this session',
        'exit                 close the terminal',
      ],
    }
  }

  if (normalizedCommand === 'whoami') {
    return {
      output: [
        context.name,
        `${context.title} · ${context.location}`,
        `${context.email} · ${context.github.replace('https://', '')}`,
        'Product interfaces / backend systems / platform craft',
      ],
    }
  }

  if (normalizedCommand === 'experience') {
    return {
      output: context.experience.flatMap((entry, index) => [
        `${String(index + 1).padStart(2, '0')}  ${entry.dates.padEnd(13, ' ')} ${entry.company} — ${entry.role}`,
        `    ${entry.summary}`,
      ]),
    }
  }

  if (normalizedCommand === 'lab') {
    const lab = context.experience.find(entry => entry.company === 'Agala Labs')
    return {
      output: lab
        ? [
            `${lab.company} — ${lab.role} · ${lab.dates}`,
            lab.summary,
            'layers: product surfaces / Go services / Linux platform',
            'status: implementation disclosed · products private',
          ]
        : ['lab: record unavailable'],
    }
  }

  if (normalizedCommand === 'projects') {
    return {
      output: context.projects.map((project, index) => `${String(index + 1).padStart(2, '0')}  ${project.slug.padEnd(14, ' ')} ${project.title}`),
    }
  }

  if (normalizedCommand === 'open') {
    const project = projectFor(target, context)
    if (!target)
      return missingTarget('open', context)
    if (!project)
      return { output: [`open: target not found: ${target}`, 'run `projects` to list valid targets'] }
    return { output: [`opening ${project.path}`], action: { type: 'navigate', target: project.path } }
  }

  if (normalizedCommand === 'source') {
    if (!target)
      return { output: ['opening github.com/elAgala'], action: { type: 'external', target: context.github } }
    const project = projectFor(target, context)
    if (!project)
      return { output: [`source: repository not found: ${target}`, 'run `projects` to list valid targets'] }
    return { output: [`opening ${project.repository.replace('https://', '')}`], action: { type: 'external', target: project.repository } }
  }

  if (normalizedCommand === 'resume')
    return { output: ['opening /resume'], action: { type: 'navigate', target: '/resume' } }

  if (normalizedCommand === 'contact')
    return { output: [`contact: ${context.email}`], action: { type: 'navigate', target: '/#contact' } }

  if (normalizedCommand === 'clear')
    return { output: [], action: { type: 'clear' } }

  if (normalizedCommand === 'exit')
    return { output: ['session closed'], action: { type: 'close' } }

  return {
    output: [
      `command not found: ${command}`,
      'run `help` for available commands',
    ],
  }
}

export function completeTerminalInput(rawInput: string, context: TerminalContext): string {
  const input = rawInput.trimStart()
  const parts = input.split(/\s+/)

  if (parts.length === 1 && !input.endsWith(' ')) {
    const match = commands.find(command => command.startsWith(parts[0]!.toLowerCase()))
    return match ?? rawInput
  }

  const command = parts[0]?.toLowerCase()
  if (command === 'open' || command === 'source') {
    const partial = parts[1]?.toLowerCase() ?? ''
    const match = context.projects.find(project => project.slug.startsWith(partial))
    return match ? `${command} ${match.slug}` : rawInput
  }

  return rawInput
}
