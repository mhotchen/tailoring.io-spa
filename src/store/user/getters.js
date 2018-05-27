import { STATUS_AWAITING_PASSWORD_RESET, STATUS_AWAITING_EMAIL_VERIFICATION, STATUS_ACTIVE } from './statuses'

export const getUser = state => state.user
export const userCompanyId = state => state.user.companies.length > 0 ? state.user.companies[0].id : ''
export const userCompanyName = state => state.user.companies.length > 0 ? state.user.companies[0].name : '...'
export const userIsActive = state => state.user.status === STATUS_ACTIVE
export const userIsAwaitingEmailVerification = state => state.user.status === STATUS_AWAITING_EMAIL_VERIFICATION
export const userIsAwaitingPasswordReset = state => state.user.status === STATUS_AWAITING_PASSWORD_RESET
export const userIsLoggedIn = state => !!state.user.id
export const userIsLoading = state => state.isLoading
