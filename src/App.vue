<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld @click="handleClick" msg="Vite + Vue" :value="count" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import HelloWorld from './components/HelloWorld.vue'
import { useEventStore } from './domain/stores/event-store/EventStore';

const store = useEventStore();
const aggregateId = '1';
const count = ref(0);

onMounted(async () => {
  const events = await store.findAll(aggregateId);
  const cancel = setInterval(() => {
    if (events.done()) {
      clearInterval(cancel);
      return;
    }
    const next = events.next();
    count.value = next.data;
  }, 500);
});

function handleClick(count: number) {
  console.log('clicked');

  store.create(
    {
      aggregateId: aggregateId,
      data: count
    }
  )
}
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
