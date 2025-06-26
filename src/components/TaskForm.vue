<template>
  <div class="container py-4">
    <!-- Task Form Button -->
    <button class="btn btn-primary mb-4" data-bs-toggle="modal" data-bs-target="#taskFormModal">
     Add Task
    </button>
    <div>
    <!-- Sorting and Filtering Controls -->
    <div class="mb-4 d-flex gap-3">
      <select v-model="statusFilter" @change="loadTasks" class="form-select w-25">
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      <select v-model="sortOrder" @change="loadTasks" class="form-select w-25">
        <option value="priority">Priority</option>
        <option value="due_date">Due Date</option>
      </select>
    </div>

    <!-- Task List -->
    <div v-if="tasks.length" class="table-responsive">
      <table class="table table-bordered table-striped">
        <thead class="table-dark">
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Due Date</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.id">
            <td>{{ task.title }}</td>
            <td>{{ task.description }}</td>
            <td>{{ task.due_date?.split('T')[0] }}</td>
            <td>{{ task.priority.replace('_', ' ').replace(/\b\w/g, char => char.toUpperCase()) }}</td>
            <td>{{ task.status.replace('_', ' ').replace(/\b\w/g, char => char.toUpperCase()) }}</td>
            <td>
              <button class="btn btn-sm btn-primary me-2" @click="editTask(task)" data-bs-toggle="modal" data-bs-target="#taskFormModal">Edit</button>
              <button class="btn btn-sm btn-danger" @click="deleteTask(task.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="text-center text-muted">No tasks found.</div>
  </div>
    <!-- Task Form Modal -->
    <div class="modal fade" id="taskFormModal" tabindex="-1" aria-labelledby="taskFormModalLabel" aria-hidden="true" @hidden="resetForm">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="taskFormModalLabel">{{ editingTaskId ? 'Edit Task' : 'Add Task' }}</h5>
            <button type="button" id="btn-close" data-bs-dismiss="modal" @click="resetForm" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <!-- Title -->
            <div class="mb-3">
              <input v-model="title" type="text" placeholder="Task Title" class="form-control" />
              <div v-if="errors.title" class="text-danger">
                {{ errors.title[0] }}
              </div>
            </div>

            <!-- Description -->
            <div class="mb-3">
              <textarea v-model="description" placeholder="Description" class="form-control"></textarea>
              <div v-if="errors.description" class="text-danger">
                {{ errors.description[0] }}
              </div>
            </div>

            <!-- Due Date -->
            <div class="mb-3">
              <input v-model="due_date" type="date" class="form-control" />
              <div v-if="errors.due_date" class="text-danger">
                {{ errors.due_date[0] }}
              </div>
            </div>

            <!-- Priority -->
            <div class="mb-3">
              <select v-model="priority" class="form-select">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <!-- Status -->
            <div class="mb-3">
              <select v-model="status" class="form-select">
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="resetForm">Cancel</button>
            <button type="button" class="btn btn-primary" @click="submitTask">
              {{ editingTaskId ? 'Update Task' : 'Add Task' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import API from '../api';

const tasks = ref([]);
const title = ref('');
const description = ref('');
const due_date = ref('');
const priority = ref('medium');
const status = ref('pending');
const errors = ref({});
const editingTaskId = ref(null);
const statusFilter = ref('');
const sortOrder = ref('priority');

const loadTasks = async () => {
  const params = new URLSearchParams();

  // Apply status filter if selected
  if (statusFilter.value) {
    params.append('status', statusFilter.value);
  }

  // Apply sorting if selected
  if (sortOrder.value) {
    params.append('ordering', sortOrder.value);
  }

  try {
    const res = await API.get(`tasks/?${params.toString()}`);
    tasks.value = res.data;
  } catch (error) {
    console.error('Error loading tasks:', error);
  }
};

const submitTask = async () => {
  errors.value = {};
  const payload = {
    title: title.value,
    description: description.value,
    due_date: due_date.value,
    priority: priority.value,
    status: status.value,
  };

  try {
    if (editingTaskId.value) {
      await API.put(`tasks/${editingTaskId.value}/`, payload);
      editingTaskId.value = null;
    } else {
      await API.post('tasks/', payload);
    }
    resetForm();
    await loadTasks();

    const modalElement = document.getElementById('btn-close');
    modalElement.click();
  } catch (err) {
    if (err.response && err.response.status === 400) {
      errors.value = err.response.data; // Capture the error messages
    }
  }
};

const editTask = (task) => {
  title.value = task.title;
  description.value = task.description;
  due_date.value = task.due_date?.split('T')[0];
  priority.value = task.priority;
  status.value = task.status;
  editingTaskId.value = task.id;
  errors.value = {}; // Clear the error messages
};

const deleteTask = async (id) => {
  await API.delete(`tasks/${id}/`);
  await loadTasks();
};

const resetForm = () => {
  title.value = '';
  description.value = '';
  due_date.value = '';
  priority.value = 'medium';
  status.value = 'pending';
  errors.value = {}; // Clear the error messages
  editingTaskId.value = null;
  errors.value = {};
};

onMounted(loadTasks);
</script>

<style scoped>
/* No custom styles needed, Bootstrap will handle it */
</style>
