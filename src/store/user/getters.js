import { STATUS_AWAITING_PASSWORD_RESET, STATUS_AWAITING_EMAIL_VERIFICATION, STATUS_ACTIVE } from './statuses'

export const get = state => state
export const companyName = state => state.companies[0].name
export const isActive = state => state.status === STATUS_ACTIVE
export const isAwaitingEmailVerification = state => state.status === STATUS_AWAITING_EMAIL_VERIFICATION
export const isAwaitingPasswordReset = state => state.status === STATUS_AWAITING_PASSWORD_RESET
export const isLoggedIn = state => state.access_token !== null
