<template>
  <q-page class="row bg-red-200 items-center justify-evenly">

    <div>
      <q-btn color="secondary" label="+ Add Sales Wallet" class="q-mr-md" @click="addNewWallet()" />
      <q-btn color="secondary" label="Use Existing"
             @click="openUseExistingWalletDialog()" />
    </div>

    <q-dialog v-model="useExistingModal" persistent>
      <q-card style="min-width: 550px">
        <q-card-section>
          <div class="text-h6">Enter Wallet Seed</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="wallet_seed" color="teal"
                   autofocus @keyup.enter="useExistingModal = false"
                   placeholder="Wallet Seed"
          />

          <h6 v-if="emptySeed" class="q-my-none q-mt-md text-red-5 text-subtitle2">Seed is required</h6>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn color="blue-grey-13" flat label="Cancel" v-close-popup />
          <q-btn @click="submitForm()" color="teal" flat label="Add address" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default defineComponent({
  name: 'IndexPage',
  data() {
    let router = useRouter();
    return {
      router: router,
      useExistingModal: false,
      wallet_seed: '',
      submitted: false
    };
  },
  computed: {
    emptySeed() {
      return this.submitted ? this.wallet_seed.trim().length === 0 : false;
    }
  },
  methods: {
    async submitForm() {
      this.submitted = true;

      if (!this.emptySeed) {
        await this.router.push({
          path: `/${this.wallet_seed}/`
        });
      }
    },
    async addNewWallet() {
      try {
        let response = await axios.post('/add_wallet/');
        if (response.data.seed) {
          await this.router.push({
            path: `/${response.data.seed}/`
          });
        } else {
          alert('error');
        }
      } catch {
        await this.router.push({
          path: '/ascascascasc5a45485/'
        });
      }
    },
    openUseExistingWalletDialog() {
      this.submitted = false;
      this.useExistingModal = true;
    }
  }
});
</script>
