import { STATUS_AWAITING_PASSWORD_RESET, STATUS_AWAITING_EMAIL_VERIFICATION, STATUS_ACTIVE } from './statuses'

export const userCompanyId = state => state.loaded ? state.user.data.companies[0].data.id : ''
export const userCompanyName = state => state.loaded ? state.user.data.companies[0].data.name : '...'
export const userIsActive = state => state.loaded ? state.user.data.status === STATUS_ACTIVE : false

export const userIsAwaitingEmailVerification = state =>
  state.loaded
    ? state.user.data.status === STATUS_AWAITING_EMAIL_VERIFICATION
    : false

export const userIsAwaitingPasswordReset = state =>
  state.loaded
    ? state.user.data.status === STATUS_AWAITING_PASSWORD_RESET
    : false

export const userIsLoaded = state => state.loaded
export const userIsLoading = state => state.loading
