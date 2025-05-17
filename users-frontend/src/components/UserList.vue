<template>
  <div class="q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <h5>Users</h5>
      <q-btn color="primary" icon="add" label="Add User" @click="openDialog(null)" />
    </div>

    <q-input
      v-model="filter"
      label="Search users..."
      filled
      debounce="300"
      class="q-mb-md"
    />

    <q-table
      :rows="filtered"
      :columns="columns"
      row-key="id"
    >
      <template #body-cell-actions="{ row }">
        <q-td class="text-center">
          <q-btn flat round icon="edit" @click="openDialog(row)" />
          <q-btn flat round icon="delete" color="negative" @click="onDelete(row.id)" />
        </q-td>
      </template>
    </q-table>

    <UserDialog
      v-model="showDialog"
      :user="selectedUser"
      @saved="reload"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { User } from 'src/interfaces/User'
import { useUsers } from 'src/composables/useUsers'
import UserDialog from './UserDialog.vue'
import type { QTableProps } from 'quasar'

const { getUsers, deleteUser } = useUsers()
const users = ref<User[]>([])
const filter = ref('')
const showDialog = ref(false)
const selectedUser = ref<User | null>(null)

const columns: QTableProps['columns'] = [
  { name: 'name', label: 'Name', field: 'name', sortable: true, align: 'left' },
  { name: 'email', label: 'Email', field: 'email', sortable: true, align: 'left' },
  { name: 'role', label: 'Role', field: 'role', sortable: true, align: 'left' },
  {
    name: 'address',
    label: 'Address',
    field: (row: User) => `${row.address.city}, ${row.address.state}`,
    align: 'left'
  },
  { name: 'actions', label: 'Actions', field: 'actions', sortable: false, align: 'center' }
]

const filtered = computed(() => {
  const term = filter.value?.toLowerCase() ?? ''
  return users.value.filter(u => {
    const name = u.name ?? ''
    const email = u.email ?? ''
    return (
      name.toLowerCase().includes(term) ||
      email.toLowerCase().includes(term)
    )
  })
})

function openDialog(user: User | null) {
  selectedUser.value = user
  showDialog.value = true
}

async function onDelete(id: number) {
  if (confirm('Delete this user?')) {
    await deleteUser(id)
    await reload()
  }
}

async function reload() {
  users.value = await getUsers()
}

onMounted(async () => {
  await reload()
})
</script>