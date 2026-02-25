export interface MonitoringRequest {
  info: Record<string, string>
  event: MonitoringRequestEvent
}

export interface IdpConnectivity {
  url: string
  connected: boolean
}

export enum MonitoringRequestEvent {
  IDP_CONNECTIVITY_CHECK = 'IDP_CONNECTIVITY_CHECK',
}
