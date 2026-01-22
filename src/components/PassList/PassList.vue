<script setup lang="ts">
import PassListItem from '@/components/PassList/PassListItem.vue';
import { usePassesStore } from '@/stores/passes';
import { onBeforeMount } from 'vue';

const passesStore = usePassesStore();
onBeforeMount(() => passesStore.loadPasses());
</script>

<template>
    <div class="pass-list">
        <PassListItem v-for="pass in passesStore.passes" :key="pass.id" :pass />
    </div>
</template>

<style scoped>
.pass-list {
    padding: 0 .5rem;
}
</style>
