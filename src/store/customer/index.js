import state from './state'
import * as getters from './getters'
import * as mutations from './mutations'
import * as actions from './actions'

export default {
  namespaced: true,
  // Because it's dynamically loaded, don't replace the existing store if it exists
  ignoreIfExists: true,
  state,
  getters,
  mutations,
  actions
}
