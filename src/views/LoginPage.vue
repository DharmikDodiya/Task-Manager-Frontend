<template>
  <!-- Login Modal -->
  <div class="container max-w-md mx-auto mt-5 p-4 bg-white shadow-sm rounded">
    <h2 class="text-center mb-4">Login</h2>
    <form @submit.prevent="login">
      <div class="mb-3">
        <input
          type="text"
          id="username"
          v-model="username"
          class="form-control"
          placeholder="Enter your username"
        />
        <div v-if="errors.username" class="text-danger">
          {{ errors.username[0] }}
        </div>
      </div>

      <div class="mb-3">
        <input
          type="password"
          id="password"
          v-model="password"
          class="form-control"
          placeholder="Enter your password"
        />
        <div v-if="errors.password" class="text-danger">
          {{ errors.password[0] }}
        </div>
      </div>

      <div v-if="errors.non_field_errors" class="text-danger mb-3">
        {{ errors.non_field_errors }}
      </div>

      <div class="text-center">
        <button type="submit" class="btn btn-primary w-100">
          Login
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import API from '../api'

const router = useRouter()
const { setAuth } = useAuth()

const username = ref('')
const password = ref('')
const errors = ref({})

const login = async () => {
  try {
    const response = await API.post('login', {
      username: username.value,
      password: password.value,
    })

    if (response?.data?.access && response?.data?.refresh) {
      const { access, refresh } = response.data
      localStorage.setItem('access', access)
      localStorage.setItem('refresh', refresh)
      setAuth(true)
      router.push('/dashboard')
    }
  } catch (error) {
    if (error.response) {
      errors.value = error.response.data
    } else {
      errors.value.non_field_errors = ['An unexpected error occurred.']
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 400px;
}
</style>
