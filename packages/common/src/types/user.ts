export interface User {
  hsaId: string
  name: string
  role: string
  loggedInUnit: string
  loggedInCareProvider: string
  //TODO: This is filled at login in backend. It looks like below in the user-object. It makes it easier to fetch data if preference is a map.
  //"anvandarPreference": {
  //  "wc.dontShowFornyaDialog":"false",
  //  "wc.sidebarMinimized":"false"
  //  }
  preferences: { [key: string]: string } | null
}

export interface UserProperty {
  key: string
  value: string
}

export interface FakeLogin {
  hsaId: string
}
