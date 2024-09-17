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
  <button @click="reset">Reset</button>
  <button @click="replay">Replay</button>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import HelloWorld from "./components/HelloWorld.vue";
import { useEventStore } from "./domain/stores/event-store/EventStore";
import { EventHandler } from "./domain/services/event-handler/EventHandler.ts";
import { Event } from "./domain/events/Event.ts";

const store = useEventStore();
const eventHandler = new EventHandler(store);

const aggregateId = "1";
const count = ref(0);
let countValue = 0;

const countHandler = (event: Event<number>) => {
  console.log("Count Handler Triggered", event.data);
  count.value = event.data;
};

onMounted(async () => {
  eventHandler.register("count", countHandler);
});

onUnmounted(() => {
  eventHandler.unregister("count", countHandler);
});

function handleClick() {
  console.log("Click Triggered");

  eventHandler.event({
    aggregateId: aggregateId,
    type: "count",
    data: ++countValue,
  });
}

function reset() {
  count.value = 0;
  countValue = 0;
  eventHandler.event({
    aggregateId: aggregateId,
    type: "count",
    data: countValue,
  });
}

async function replay() {
  const events = await store.findAll("count", aggregateId);
  const cancel = setInterval(() => {
    const next = events.next();
    if (events.done()) {
      clearInterval(cancel);
      return;
    }

    count.value = next!.data;
  }, 300);
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
