import type { EvidenceGraphDefinition } from '~/types/experience'

export const evidenceGraphs = [
  {
    id: 'agala-ui',
    title: 'Agala UI',
    outcome: 'A reusable product language.',
    materialTheme: 'parchment-oxblood',
    staticCameraFrame: { position: [0, 3.1, 4.8], target: [0, 1.2, 0] },
    phases: [
      { id: 'language', label: 'The language', start: 0, end: 0.34, annotation: 'Tokens establish the language.', activeNodeGroups: ['tokens'], activeEdgeGroups: ['foundation'], cameraEmphasis: [-0.8, 0.2, 0] },
      { id: 'behavior', label: 'The behavior', start: 0.34, end: 0.67, annotation: 'Typed primitives hold behavior.', activeNodeGroups: ['tokens', 'primitives'], activeEdgeGroups: ['foundation', 'composition'], cameraEmphasis: [0, 0.45, 0] },
      { id: 'workflow', label: 'The workflow', start: 0.67, end: 1, annotation: 'Workflows assemble without drift.', activeNodeGroups: ['tokens', 'primitives', 'workflows'], activeEdgeGroups: ['foundation', 'composition', 'assembly'], cameraEmphasis: [0.7, 0.65, 0] },
    ],
    nodes: [
      { id: 'tokens', label: 'Theme and CSS tokens', kind: 'token', group: 'tokens', position: [-1.45, 0.08, 0.7], scale: [0.72, 0.12, 0.5], activationPhase: 'language', metadataRef: 'approach.0' },
      { id: 'interactions', label: 'Interaction composables', kind: 'token', group: 'tokens', position: [-0.45, 0.08, 0.7], scale: [0.72, 0.12, 0.5], activationPhase: 'language', metadataRef: 'approach.2' },
      { id: 'typed-controls', label: 'Typed Vue controls', kind: 'primitive', group: 'primitives', position: [-1.1, 0.65, 0], scale: [0.68, 0.18, 0.5], activationPhase: 'behavior', metadataRef: 'approach.1' },
      { id: 'navigation', label: 'Navigation and overlays', kind: 'primitive', group: 'primitives', position: [0.15, 0.65, 0], scale: [0.68, 0.18, 0.5], activationPhase: 'behavior', metadataRef: 'narrative.0' },
      { id: 'scheduling', label: 'Scheduling workflows', kind: 'workflow', group: 'workflows', position: [0.85, 1.24, -0.55], scale: [0.85, 0.22, 0.58], activationPhase: 'workflow', metadataRef: 'narrative.1' },
      { id: 'interface', label: 'Reusable product interface', kind: 'outcome', group: 'workflows', position: [1.55, 1.84, -1.05], scale: [1.05, 0.3, 0.72], activationPhase: 'workflow', metadataRef: 'outcome' },
    ],
    edges: [
      { id: 'tokens-controls', source: 'tokens', target: 'typed-controls', direction: 'forward', style: 'assembly', activationPhase: 'language', pulseDuration: 1.4 },
      { id: 'interactions-navigation', source: 'interactions', target: 'navigation', direction: 'forward', style: 'assembly', activationPhase: 'language', pulseDuration: 1.3 },
      { id: 'controls-scheduling', source: 'typed-controls', target: 'scheduling', direction: 'forward', style: 'assembly', activationPhase: 'behavior', pulseDuration: 1.2 },
      { id: 'navigation-scheduling', source: 'navigation', target: 'scheduling', direction: 'forward', style: 'assembly', activationPhase: 'behavior', pulseDuration: 1.25 },
      { id: 'scheduling-interface', source: 'scheduling', target: 'interface', direction: 'forward', style: 'assembly', activationPhase: 'workflow', pulseDuration: 1.1 },
    ],
  },
  {
    id: 'agala-deploy',
    title: 'Agala Deploy',
    outcome: 'A repeatable path to production.',
    materialTheme: 'steel-brass',
    staticCameraFrame: { position: [0, 3, 5.2], target: [0, 0.9, 0] },
    phases: [
      { id: 'inputs', label: 'Constrained inputs', start: 0, end: 0.32, annotation: 'CI admits explicit inputs and encrypted secrets.', activeNodeGroups: ['inputs'], activeEdgeGroups: ['admission'], cameraEmphasis: [-1, 0.25, 0] },
      { id: 'execution', label: 'Portable execution', start: 0.32, end: 0.7, annotation: 'Inventory selects the environment; the container validates the run.', activeNodeGroups: ['inputs', 'execution'], activeEdgeGroups: ['admission', 'execution'], cameraEmphasis: [0, 0.55, 0] },
      { id: 'delivery', label: 'Verified delivery', start: 0.7, end: 1, annotation: 'Ansible carries a predictable release to managed targets.', activeNodeGroups: ['inputs', 'execution', 'targets'], activeEdgeGroups: ['admission', 'execution', 'delivery'], cameraEmphasis: [1, 0.35, 0] },
    ],
    nodes: [
      { id: 'ci', label: 'Woodpecker CI', kind: 'input', group: 'inputs', position: [-1.8, 0.35, 0.65], activationPhase: 'inputs', metadataRef: 'stack.5' },
      { id: 'vault', label: 'SOPS and age secrets', kind: 'secret', group: 'inputs', position: [-1.05, 0.75, -0.15], activationPhase: 'inputs', metadataRef: 'approach.1' },
      { id: 'inventory', label: 'Git-backed inventory', kind: 'inventory', group: 'execution', position: [-0.25, 0.35, 0.65], activationPhase: 'execution', metadataRef: 'approach.2' },
      { id: 'entrypoint', label: 'Validated Go entry point', kind: 'runtime', group: 'execution', position: [0.35, 0.8, -0.2], activationPhase: 'execution', metadataRef: 'approach.3' },
      { id: 'container', label: 'Containerized runtime', kind: 'runtime', group: 'execution', position: [0.95, 0.35, 0.65], activationPhase: 'execution', metadataRef: 'approach.0' },
      { id: 'ansible', label: 'Ansible execution', kind: 'runtime', group: 'targets', position: [1.35, 0.9, -0.15], activationPhase: 'delivery', metadataRef: 'description' },
      { id: 'targets', label: 'Managed VPS targets', kind: 'target', group: 'targets', position: [2, 0.45, 0.65], scale: [0.7, 1.25, 0.7], activationPhase: 'delivery', metadataRef: 'narrative.0' },
      { id: 'success', label: 'Predictable release', kind: 'outcome', group: 'targets', position: [2, 1.65, -0.35], activationPhase: 'delivery', metadataRef: 'outcome' },
    ],
    edges: [
      { id: 'ci-vault', source: 'ci', target: 'vault', direction: 'forward', style: 'flow', activationPhase: 'inputs', pulseDuration: 1.2 },
      { id: 'vault-entrypoint', source: 'vault', target: 'entrypoint', direction: 'forward', style: 'flow', activationPhase: 'inputs', pulseDuration: 1.4 },
      { id: 'inventory-entrypoint', source: 'inventory', target: 'entrypoint', direction: 'forward', style: 'flow', activationPhase: 'execution', pulseDuration: 1.15 },
      { id: 'entrypoint-container', source: 'entrypoint', target: 'container', direction: 'forward', style: 'flow', activationPhase: 'execution', pulseDuration: 1.1 },
      { id: 'container-ansible', source: 'container', target: 'ansible', direction: 'forward', style: 'flow', activationPhase: 'delivery', pulseDuration: 1.05 },
      { id: 'ansible-targets', source: 'ansible', target: 'targets', direction: 'forward', style: 'flow', activationPhase: 'delivery', pulseDuration: 0.95 },
      { id: 'targets-success', source: 'targets', target: 'success', direction: 'forward', style: 'flow', activationPhase: 'delivery', pulseDuration: 0.9 },
    ],
  },
  {
    id: 'agala-ai',
    title: 'Agala AI',
    outcome: 'Delivery roles made explicit.',
    materialTheme: 'glass-brass',
    staticCameraFrame: { position: [0, 3.2, 5], target: [0, 1, 0] },
    phases: [
      { id: 'roles', label: 'Bounded roles', start: 0, end: 0.34, annotation: 'Specialists receive explicit responsibility boundaries.', activeNodeGroups: ['roles'], activeEdgeGroups: ['handoff'], cameraEmphasis: [-0.8, 0.3, 0] },
      { id: 'contracts', label: 'Stack contracts', start: 0.34, end: 0.68, annotation: 'Nuxt, Vue, and Go contracts constrain implementation.', activeNodeGroups: ['roles', 'contracts'], activeEdgeGroups: ['handoff', 'contracts'], cameraEmphasis: [0, 0.6, 0] },
      { id: 'completion', label: 'Repair loop', start: 0.68, end: 1, annotation: 'QA and repair return the work to a completed delivery loop.', activeNodeGroups: ['roles', 'contracts', 'completion'], activeEdgeGroups: ['handoff', 'contracts', 'completion'], cameraEmphasis: [0.8, 0.45, 0] },
    ],
    nodes: [
      { id: 'product', label: 'Product planning', kind: 'role', group: 'roles', position: [-1.65, 0.75, 0.1], activationPhase: 'roles', metadataRef: 'approach.0' },
      { id: 'architecture', label: 'Architecture', kind: 'role', group: 'roles', position: [-0.85, 1.45, -0.25], activationPhase: 'roles', metadataRef: 'approach.0' },
      { id: 'implementation', label: 'Implementation', kind: 'role', group: 'roles', position: [0.15, 1.55, -0.4], activationPhase: 'roles', metadataRef: 'approach.0' },
      { id: 'qa', label: 'Quality assurance', kind: 'role', group: 'roles', position: [1.15, 1.25, -0.15], activationPhase: 'roles', metadataRef: 'approach.0' },
      { id: 'repair', label: 'Review and repair', kind: 'role', group: 'roles', position: [1.65, 0.45, 0.2], activationPhase: 'roles', metadataRef: 'approach.0' },
      { id: 'nuxt-contract', label: 'Nuxt contract', kind: 'contract', group: 'contracts', position: [-0.8, 0.25, 0.9], activationPhase: 'contracts', metadataRef: 'approach.2' },
      { id: 'go-vue-contract', label: 'Go and Vue contract', kind: 'contract', group: 'contracts', position: [0.65, 0.25, 0.9], activationPhase: 'contracts', metadataRef: 'approach.2' },
      { id: 'complete', label: 'Completed delivery loop', kind: 'outcome', group: 'completion', position: [0, 0.85, 0.1], scale: [0.9, 0.9, 0.9], activationPhase: 'completion', metadataRef: 'outcome' },
    ],
    edges: [
      { id: 'product-architecture', source: 'product', target: 'architecture', direction: 'forward', style: 'contract', activationPhase: 'roles', pulseDuration: 1.25 },
      { id: 'architecture-implementation', source: 'architecture', target: 'implementation', direction: 'forward', style: 'contract', activationPhase: 'roles', pulseDuration: 1.2 },
      { id: 'implementation-qa', source: 'implementation', target: 'qa', direction: 'forward', style: 'contract', activationPhase: 'roles', pulseDuration: 1.15 },
      { id: 'qa-repair', source: 'qa', target: 'repair', direction: 'forward', style: 'contract', activationPhase: 'roles', pulseDuration: 1.1 },
      { id: 'nuxt-implementation', source: 'nuxt-contract', target: 'implementation', direction: 'bidirectional', style: 'contract', activationPhase: 'contracts', pulseDuration: 1.4 },
      { id: 'go-implementation', source: 'go-vue-contract', target: 'implementation', direction: 'bidirectional', style: 'contract', activationPhase: 'contracts', pulseDuration: 1.35 },
      { id: 'repair-complete', source: 'repair', target: 'complete', direction: 'forward', style: 'contract', activationPhase: 'completion', pulseDuration: 1 },
      { id: 'complete-product', source: 'complete', target: 'product', direction: 'forward', style: 'contract', activationPhase: 'completion', pulseDuration: 1.05 },
    ],
  },
] satisfies EvidenceGraphDefinition[]

export const evidenceGraphById = Object.fromEntries(
  evidenceGraphs.map(graph => [graph.id, graph]),
) as Record<EvidenceGraphDefinition['id'], EvidenceGraphDefinition>
