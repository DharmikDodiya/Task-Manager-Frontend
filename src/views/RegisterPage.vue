<!-- <template>
  <div class="max-w-md mx-auto mt-10 p-4 shadow bg-white rounded">
    <h2 class="text-2xl mb-4">Register</h2>
    <form @submit.prevent="register">
      <input
        v-model="username"
        placeholder="Username"
        class="input mb-2 w-full border rounded p-2"
      />
      <input
        type="password"
        v-model="password"
        placeholder="Password"
        class="input mb-2 w-full border rounded p-2"
      />
      <input
        type="password"
        v-model="confirmPassword"
        placeholder="Confirm Password"
        class="input mb-4 w-full border rounded p-2"
      />
      <div v-if="error" class="text-red-500 text-sm mb-2">{{ error }}</div>
      <button class="btn bg-blue-500 text-white px-4 py-2 rounded">Register</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import API from '../api'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const router = useRouter()

const register = async () => {
  error.value = ''
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }

  try {
    await API.post('register/', {
      username: username.value,
      password: password.value,
      password2: confirmPassword.value,
    })
    router.push('/login')
  } catch (err) {
    error.value = err.response?.data?.message || 'Registration failed'
  }
}
</script> -->

<template>
  <div class="container max-w-md mx-auto mt-5 p-4 bg-white shadow-sm rounded">
    <h2 class="text-center mb-4">Register</h2>
    <form @submit.prevent="register">
      <div class="mb-3">
        <input
          v-model="username"
          type="text"
          class="form-control"
          id="username"
          placeholder="Username"
        />
      </div>
      <div class="mb-3">
        <input
          v-model="password"
          type="password"
          class="form-control"
          id="password"
          placeholder="Password"
        />
      </div>
      <div class="mb-3">
        <input
          v-model="confirmPassword"
          type="password"
          class="form-control"
          id="confirmPassword"
          placeholder="Confirm Password"
        />
      </div>
      <div v-if="error" class="text-danger text-sm mb-2">{{ error }}</div>
      <div class="text-center">
        <button type="submit" class="btn btn-primary w-100">
          Register
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import API from '../api'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const router = useRouter()

const register = async () => {
  error.value = ''
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }

  try {
    await API.post('register/', {
      username: username.value,
      password: password.value,
      password2: confirmPassword.value,
    })
    router.push('/login')
  } catch (err) {
    error.value = err.response?.data?.message || 'Registration failed'
  }
}
</script>

<style scoped>
.container {
  max-width: 400px;
}
</style>
