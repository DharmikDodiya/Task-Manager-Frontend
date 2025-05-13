<template>
    <div class="max-w-3xl mx-auto mt-10">
      <TaskForm @task-added="fetchTasks" />
      <TaskList :tasks="tasks" @updated="fetchTasks" />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import TaskForm from '../components/TaskForm.vue'
  import TaskList from '../components/TaskList.vue'
  import API from '../api'
  
  const tasks = ref([])
  
  const fetchTasks = async () => {
    const res = await API.get('tasks/')
    tasks.value = res.data
  }
  
  onMounted(fetchTasks)
  </script>
  