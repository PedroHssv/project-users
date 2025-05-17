<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card style="min-width: 400px">
      <q-card-section>
        <div class="text-h6">
          {{ isEdit ? 'Edit User' : 'Add User' }}
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-gutter-md">
        <q-input
          v-model="form.name"
          label="Name"
          :rules="[v => !!v || 'Name is required']"
          dense
        />
        <q-input
            v-model="form.email"
            label="Email"
            type="email"
            dense
            :rules="[
                v => !!v || 'Email is required',
                v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Invalid email'
            ]"
        />
        <q-input
          v-if="!isEdit"
          v-model="form.password"
          label="Password"
          type="password"
          :rules="[v => !!v || 'Password is required']"
          dense
        />

        <q-select
          v-model="form.role"
          :options="roles"
          label="Role"
          dense
        />
        <q-select
          v-model="form.status"
          :options="statuses"
          label="Status"
          dense
        />

        <q-input
          v-model="form.address.street"
          label="Street"
          dense
        />
        <div class="row q-gutter-sm">
          <q-input
            v-model="form.address.city"
            label="City"
            class="col"
            dense
          />
          <q-input
            v-model="form.address.state"
            label="State"
            class="col"
            dense
          />
          <q-input
            v-model="form.address.zipCode"
            label="ZIP"
            class="col"
            dense
          />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat label="Cancel" @click="close" />
        <q-btn
          color="primary"
          label="Save"
          @click="save"
          :disable="!canSave"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
    import { ref, watch, computed } from 'vue'
    import type { User } from 'src/interfaces/User'
    import type { UserPayload } from 'src/composables/useUsers'
    import { useUsers } from 'src/composables/useUsers'


    interface AddressForm {
        street: string
        city: string
        state: string
        zipCode: string
    }

    interface UserForm {
        name: string
        email: string
        password: string
        role: 'admin' | 'user'
        status: 'active' | 'inactive'
        address: AddressForm
    }

    const props = defineProps<{
        modelValue: boolean
        user: User | null
    }>()

    const emit = defineEmits<{
        (e: 'update:modelValue', v: boolean): void
        (e: 'saved'): void
    }>()

    const isOpen = ref(props.modelValue)
    watch(() => props.modelValue, v => (isOpen.value = v))
    watch(isOpen, v => emit('update:modelValue', v))

    function defaultForm(): UserForm {
        return {
            name: '',
            email: '',
            password: '',
            role: 'user',
            status: 'active',
            address: { street: '', city: '', state: '', zipCode: '' }
        }
    }

    const form = ref<UserForm>(defaultForm())

    const isEdit = computed(() => !!props.user?.id)

    watch(
        () => props.user,
        user => {
            if (user) {
            form.value = {
                name:  user.name,
                email: user.email,
                password: '',
                role:   user.role,
                status: user.status,
                address: {
                    street:  user.address.street,
                    city:    user.address.city,
                    state:   user.address.state,
                    zipCode: user.address.zipCode
                }
            }
            } else {
            form.value = defaultForm()
            }
        },
        { immediate: true }
    )

    const roles    = ['admin', 'user']
    const statuses = ['active', 'inactive']

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    const canSave = computed(() => {
            const nameValid = !!form.value.name
            const emailValid = !!form.value.email && emailRegex.test(form.value.email)

            if (!isEdit.value) {
                const passwordValid = !!form.value.password
                return nameValid && emailValid && passwordValid
            }

            return nameValid && emailValid
        }
    )

    const { createUser, updateUser } = useUsers()

    async function save() {
        const payload: UserPayload = {
            name:     form.value.name,
            email:    form.value.email,
            status:   form.value.status,
            role:     form.value.role,
            street:   form.value.address.street,
            city:     form.value.address.city,
            state:    form.value.address.state,
            zipCode:  form.value.address.zipCode,
            ...( !isEdit.value || form.value.password
                ? { password: form.value.password }
                : {} )
        }

        if (isEdit.value && props.user!.id) {
            await updateUser(props.user!.id, payload)
        } else {
            await createUser(payload)
        }

        emit('saved')
        close()
    }

    function close() {
        isOpen.value = false
    }
</script>
