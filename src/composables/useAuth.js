import { ref } from 'vue'

const isAuthenticated = ref(!!localStorage.getItem('access'))

const setAuth = (value) => {
  isAuthenticated.value = value
}

const checkAuth = () => {
  isAuthenticated.value = !!localStorage.getItem('access')
}

const logout = (router) => {
  localStorage.removeItem('access')
  localStorage.removeItem('refresh')
  isAuthenticated.value = false
  router.push('/login')
}

export function useAuth() {
  return {
    isAuthenticated,
    setAuth,
    checkAuth,
    logout,
  }
}
