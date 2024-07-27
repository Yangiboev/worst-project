<template>
  <q-page class="q-pa-md">
    <div class="text-h4">Congratulations!</div>
    <div class="text-h6 q-mt-md">
      Your sale has been successfully recorded with the following details:
    </div>
    <div class="text-h6 q-mt-md">
      Transaction ID: {{ transactionId }}

      Block: {{ block }}
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'ConfirmationPage',
  setup() {
    const route = useRoute();
    const transactionId = route.query.id as string;
    const block = route.query.block as string;
    return {
      transactionId,
      block
    };
  }
});
</script>
