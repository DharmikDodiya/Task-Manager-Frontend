<template>
  <div class="container py-4">
    <!-- Task Form Button -->
    <button class="btn btn-primary mb-4" data-bs-toggle="modal" data-bs-target="#taskFormModal">
      {{ editingTaskId ? 'Update Task' : 'Add Task' }}
    </button>

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
            <td>{{ task.priority.replace('_', ' ').replace(/\b\w/g, char => char.toUpperCase()) }}</td> <!-- Inline transformation -->
            <td>{{ task.status.replace('_', ' ').replace(/\b\w/g, char => char.toUpperCase()) }}</td> <!-- Inline transformation -->
            <td>
              <button class="btn btn-sm btn-primary me-2" @click="editTask(task)" data-bs-toggle="modal" data-bs-target="#taskFormModal">Edit</button>
              <button class="btn btn-sm btn-danger" @click="deleteTask(task.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="text-center text-muted">No tasks found.</div>

    <!-- Task Form Modal -->
    <div class="modal fade" id="taskFormModal" tabindex="-1" aria-labelledby="taskFormModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="taskFormModalLabel">{{ editingTaskId ? 'Edit Task' : 'Add Task' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <input v-model="title" type="text" placeholder="Task Title" class="form-control" />
            </div>
            <div class="mb-3">
              <textarea v-model="description" placeholder="Description" class="form-control"></textarea>
            </div>
            <div class="mb-3">
              <input v-model="due_date" type="date" class="form-control" />
            </div>
            <div class="mb-3">
              <select v-model="priority" class="form-select">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div class="mb-3">
              <select v-model="status" class="form-select">
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="submitTask">{{ editingTaskId ? 'Update Task' : 'Add Task' }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import API from '../api';
import { Modal } from 'bootstrap'; // Import Bootstrap modal

const tasks = ref([]);
const title = ref('');
const description = ref('');
const due_date = ref('');
const priority = ref('medium');
const status = ref('pending');
const errors = ref({});
const editingTaskId = ref(null);

const loadTasks = async () => {
  const res = await API.get('tasks/');
  tasks.value = res.data;
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

    // Close the modal after submission
    const modalElement = document.getElementById('taskFormModal');
    const modalInstance = Modal.getInstance(modalElement); // Get the Bootstrap modal instance
    modalInstance.hide(); // Hide the modal
  } catch (err) {
    if (err.response && err.response.status === 400) {
      errors.value = err.response.data;
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
  editingTaskId.value = null;
};

onMounted(loadTasks);
</script>

<style scoped>
/* No custom styles needed, Bootstrap will handle it */
</style>
