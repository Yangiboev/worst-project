<template>
  <q-page style="max-width: 1200px" class="q-mx-auto q-px-lg q-py-lg">
    <h1 class="text-h3 text-weight-medium">Sales Overview</h1>

    <div class="flex justify-end items-center q-mb-lg">
      <AddSalesDialog @created="getSales()" />
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
        <tr>
          <td class="text-left">Frozen Yogurt</td>
          <td class="text-right">159</td>
          <td class="text-right">6</td>
          <td class="text-right">USD</td>
        </tr>
        </tbody>
      </q-markup-table>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';
import AddSalesDialog from '../../components/dialogs/AddSales.vue';
import axios from 'axios';

export default defineComponent({
  name: 'IndexPage',
  data() {
    let route = useRoute();
    return {
      route: route,
      sales: []
    };
  },
  methods: {
    async getSales() {
      try {
        let response = await axios.get('/sales_list/');
        this.sales = response.data.results;
      } catch {
        alert('Could not get the api list');
      }
    },
    async submitSales() {
      this.$router.push({
        path: '/submit-sales'
      });
    }
  },
  components: {
    AddSalesDialog
  },
  computed: {
    wallet_seed() {
      return this.route.params.wallet_seed || null;
    }
  },
  mounted() {
    this.getSales();
  }
});
</script>
