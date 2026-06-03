<template>
  <Teleport to="body">
    <TransitionGroup name="toast" tag="div" class="toast-container">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="toast-item"
        :class="t.type"
        @click="dismiss(t.id)"
      >
        <span class="toast-icon">{{ t.type === 'error' ? '&#10060;' : '&#8505;' }}</span>
        <span class="toast-msg">{{ t.message }}</span>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { toasts, dismiss } = useToast()
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
}

.toast-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  border-radius: 8px;
  min-width: 260px;
  max-width: 400px;
  font-size: 13px;
  backdrop-filter: blur(12px);
  cursor: pointer;
  pointer-events: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.toast-item.error {
  background: rgba(180, 40, 40, 0.85);
  border: 1px solid rgba(255, 80, 80, 0.3);
  color: #fdd;
}

.toast-item.info {
  background: rgba(40, 80, 140, 0.85);
  border: 1px solid rgba(80, 140, 220, 0.3);
  color: #dde;
}

.toast-icon { flex-shrink: 0; font-size: 14px; }
.toast-msg { flex: 1; line-height: 1.4; }

.toast-enter-active { animation: toast-in 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
.toast-leave-active { animation: toast-out 0.25s ease-in forwards; }

@keyframes toast-in {
  from { opacity: 0; transform: translateX(60px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes toast-out {
  from { opacity: 1; transform: translateX(0); }
  to   { opacity: 0; transform: translateX(60px); }
}
</style>
