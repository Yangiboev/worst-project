<template>
  <q-page style="max-width: 1200px" class="q-mx-auto q-px-lg q-py-lg">
    <h1 class="text-h3 text-weight-medium">Sales Overview</h1>

    <div class="flex justify-end items-center q-mb-lg">
      <AddSalesDialog @created="addSale" />
      <q-btn @click="submitSales()" color="secondary" label="Submit Sale" class="q-mr-md" />
    </div>

    <div class="q-mt-lg">
      <q-markup-table class="" flat>
        <thead>
          <tr>
            <th class="text-left">Client Name</th>
            <th class="text-right">Product Name</th>
            <th class="text-right">Sales Amount</th>
            <th class="text-right">Currency</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sale in sales" :key="sale.id">
            <td class="text-left">{{ sale.client_name }}</td>
            <td class="text-right">{{ sale.product_name }}</td>
            <td class="text-right">{{ sale.sale_amount }}</td>
            <td class="text-right">{{ sale.currency }}</td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AddSalesDialog from '../../components/dialogs/AddSales.vue';

interface Sale {
  id: number;
  client_name: string;
  product_name: string;
  sale_amount: number;
  currency: string;
}

export default defineComponent({
  name: 'IndexPage',
  components: {
    AddSalesDialog
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const sales = ref<Sale[]>([]);

    const addSale = (newSale: Omit<Sale, 'id'>) => {
      const id = sales.value.length + 1;
      sales.value.push({ ...newSale, id });

      // Navigate to confirmation page with the transaction ID
      router.push({ path: '/confirmation', query: { id: id.toString(), block: '123' } });
    };

    const submitSales = () => {
      // Handle submission logic if needed
      console.log('Submit Sales clicked');
    };

    return {
      route,
      sales,
      addSale,
      submitSales
    };
  },
  computed: {
    wallet_seed() {
      return this.route.params.wallet_seed || null;
    }
  }
});
</script>
