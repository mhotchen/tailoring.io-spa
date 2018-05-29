import { STATUS_AWAITING_PASSWORD_RESET, STATUS_AWAITING_EMAIL_VERIFICATION, STATUS_ACTIVE } from './statuses'

export const userCompanyId = state => state.loaded ? state.user.data.companies[0].data.id : ''
export const userCompanyName = state => state.loaded ? state.user.data.companies[0].data.name : '...'
export const userIsActive = state => state.user.data.status === STATUS_ACTIVE
export const userIsAwaitingEmailVerification = state => state.user.data.status === STATUS_AWAITING_EMAIL_VERIFICATION
export const userIsAwaitingPasswordReset = state => state.user.data.status === STATUS_AWAITING_PASSWORD_RESET
export const userIsLoaded = state => state.loaded
export const userIsLoading = state => state.loading
