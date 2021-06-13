export const SET_LOAN = (state, payload) => {
  state.activeLoans.push({
    loan: payload.load,
    term: payload.term,
    id: payload.id
  })
}

// export const setLoanTerm = (state, payload) => {
//   state.currentLoan.term = payload.term
// }

// export const setLoanId = (state, payload) => {
//   state.currentLoan.id = payload.id
// }

// export { updateField } from 'vuex-map-fields'
