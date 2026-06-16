import { ref } from 'vue';

const toasts = ref([]);
let id = 0;

export function useToast() {
  function show(message, type = 'success', duration = 3000) {
    const toastId = ++id;
    toasts.value.push({ id: toastId, message, type });
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== toastId);
    }, duration);
  }

  return { toasts, show };
}
