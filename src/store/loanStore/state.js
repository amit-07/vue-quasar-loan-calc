export const STORAGE_KEY = 'vue-loan-queue'

export default () => {
  return {
    activeLoans: JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
  }
}
