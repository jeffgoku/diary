import { ref, watchEffect } from "vue";

const isLoading = ref(true);

const loadingEl = document.querySelector('.preloading')

watchEffect(() => {
    loadingEl.style.display = isLoading.value ? null : 'none';
})

export default function useLoading() {
    return isLoading
}