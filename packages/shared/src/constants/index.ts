export const NotificationType = {
  TASK_ASSIGNED: 'TASK_ASSIGNED',
  PROJECT_INVITATION: 'PROJECT_INVITATION',
  PROJECT_CREATED: 'PROJECT_CREATED',
  TASK_STATUS_CHANGED: 'TASK_STATUS_CHANGED'
} as const;

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