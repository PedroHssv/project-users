<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar><q-toolbar-title>User Admin</q-toolbar-title></q-toolbar>
    </q-header>

    <q-page-container>
      <q-page padding>
        <UserList />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import UserList from 'src/components/UserList.vue'
</script>
