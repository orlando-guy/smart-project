export const ProjectPriority = {
    MUST: "MUST",
    SHOULD: "SHOULD",
    COULD: "COULD",
    WONT: "WONT",
} as const;

export const TaskStatus = {
  ACHIEVED: 'ACHIEVED',
  ONGOING: 'ONGOING',
  NOT_STARTED: 'NOT_STARTED'
} as const;

export const DocumentTypes = {
  DOCUMENT: 'DOCUMENT',
  IMAGE: 'IMAGE'
} as const;