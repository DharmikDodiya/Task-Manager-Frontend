<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-indigo-600">
    <div class="container-fluid">
      <!-- Brand / App Name -->
      <router-link v-if="!isAuthenticated" to="/login" class="navbar-brand">Task App</router-link>

      <!-- Navbar Toggler for mobile view -->
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navbar Links -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <!-- Login/Register links when not authenticated -->
          <li v-if="!isAuthenticated" class="nav-item">
            <router-link to="/login" class="nav-link">Login</router-link>
          </li>
          <li v-if="!isAuthenticated" class="nav-item">
            <router-link to="/register" class="nav-link">Register</router-link>
          </li>

          <!-- Dashboard and Logout when authenticated -->
          <li v-if="isAuthenticated" class="nav-item">
            <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
          </li>
          <li v-if="isAuthenticated" class="nav-item">
            <button @click="logout" class="btn btn-outline-light nav-link">Logout</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
  import { onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuth } from '../composables/useAuth'

  const router = useRouter()
  const { isAuthenticated, checkAuth } = useAuth()

  onMounted(() => {
    checkAuth()
  })
  
  const logout = () => {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    isAuthenticated.value = false
    router.push('/login')
  }
</script>

<style scoped>
  /* Optional: Customize navbar colors or styles as needed */
  .navbar-dark {
    background-color: #6368c6; /* Customize the navbar color */
  }

  .nav-link {
    font-size: 1rem; /* Customize the font size */
  }
</style>
