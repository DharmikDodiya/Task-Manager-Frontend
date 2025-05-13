<template>
    <div>
      <div v-for="task in tasks" :key="task.id" class="p-4 border mb-2 rounded">
        <h3 class="font-bold">{{ task.title }}</h3>
        <p>{{ task.description }}</p>
        <p class="text-sm text-gray-500">Due: {{ task.due_date }} | Priority: {{ task.priority }}</p>
        <p>Status: <span :class="task.completed ? 'text-green-500' : 'text-red-500'">{{ task.completed ? 'Done' : 'Pending' }}</span></p>
        <button class="btn-sm mt-1 mr-2" @click="toggle(task)">Mark {{ task.completed ? 'Pending' : 'Done' }}</button>
        <button class="btn-sm bg-red-500 hover:bg-red-600" @click="remove(task.id)">Delete</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import API from '../api'
  // eslint-disable-next-line
  const props = defineProps(['task']);
  // eslint-disable-next-line
  const emit = defineEmits(['updated'])
  
  const toggle = async (task) => {
    await API.put(`tasks/${task.id}/`, { ...task, completed: !task.completed })
    emit('updated')
  }
  
  const remove = async (id) => {
    await API.delete(`tasks/${id}/`)
    emit('updated')
  }
  </script>
  