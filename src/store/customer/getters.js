export const getCustomer = (state) => state.loaded ? state.customer : {}
export const getCustomerName = (state) => state.loaded ? state.customer.data.name : null
export const getCustomerEmail = (state) => state.loaded ? state.customer.data.email : null
export const getCustomerTelephone = (state) => state.loaded ? state.customer.data.telephone : null
export const getCustomerNotes = (state) => state.loaded ? state.customer.data.notes : null

export const hasCustomerNotes = (state) => state.loaded ? state.customer.data.notes.length > 0 : false

export const getCustomerNoteValue = (state) => (note) => note.data.note
export const getCustomerNoteCreatedAt = (state) => (note) => new Date(note.data.created_at)
