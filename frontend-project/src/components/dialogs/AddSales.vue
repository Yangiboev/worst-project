<template>
  <q-btn color="secondary" label="+ Add Sales Wallet" class="q-mr-md" @click="openDialog()" />

  <q-dialog v-model="showDialog" persistent>
    <q-card style="min-width: 550px">
      <q-card-section>
        <div class="text-h6">Enter Sale Details</div>
      </q-card-section>

      <q-card-section class="q-pt-none column q-gutter-lg">
        <q-input dense v-model="new_wallet.client_name" color="teal" autofocus placeholder="Client Name" stack-label />
        <q-input dense v-model="new_wallet.product_name" color="teal" placeholder="Product Name" stack-label />
        <q-input type="number" dense v-model="new_wallet.sale_amount" color="teal" placeholder="Sale Amount" stack-label />
        <q-select v-model="new_wallet.currency" :options="currencies" label="Choose Currency" />

        <div v-if="submitted">
          <h6 v-if="!addNewWalletIsValid" class="q-my-none q-mt-md text-red-5 text-subtitle2">
            Fill all the fields
          </h6>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn color="blue-grey-13" flat label="Cancel" v-close-popup />
        <q-btn @click="submitNewWalletForm()" color="teal" flat label="Add Sale" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AddSalesDialog',
  emits: ['created'],
  data() {
    return {
      showDialog: false,
      submitted: false,

      new_wallet: {
        client_name: '',
        product_name: '',
        sale_amount: 0,
        currency: ''
      },

      currencies: [
        'USD',
        'EUR',
        'GBP',
        'JPY',
        'CNY',
        'HKD',
        'ADA',
        'USDM'
      ]
    };
  },
  computed: {
    addNewWalletIsValid() {
      return this.submitted
        ? this.new_wallet.client_name.trim().length > 0
        && this.new_wallet.product_name.trim().length > 0
        && this.new_wallet.sale_amount.toString().trim().length > 0
        && this.new_wallet.currency.trim().length > 0
        : false;
    }
  },
  methods: {
    async submitNewWalletForm() {
      this.submitted = true;
      if (!this.addNewWalletIsValid) return;

      // Emit the new sale data
      this.$emit('created', { ...this.new_wallet });

      // Reset and close dialog
      this.new_wallet = {
        client_name: '',
        product_name: '',
        sale_amount: 0,
        currency: ''
      };
      this.showDialog = false;
    },
    openDialog() {
      this.submitted = false;
      this.showDialog = true;
    }
  }
});
</script>
