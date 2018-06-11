<template>
  <v-layout>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-layout row class="primary" wrap>
          <v-flex xs12 sm6 offset-sm3>
            <h3 class="mt-2  mb-2 white--text">Duplicate item</h3>
          </v-flex>
        </v-layout>
        <v-divider class="mb-3"></v-divider>

          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field
                v-model="this.item.Brand"
                name="brandName"
                label="Brand Name"
                id="brandName"
                disabled></v-text-field>
            </v-flex>
          </v-layout>

        <v-layout row>
          <v-flex xs12>
            <form @submit.prevent="addItem">
              <v-layout row>
                <v-flex xs12 sm6 offset-sm3>
                  <v-text-field
                    v-model="item.ReceiptAlias"
                    name="receiptAlias"
                    label="Receipt Alias"
                    id="receiptAlias"
                    disabled></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12 sm6 offset-sm3>
                  <v-text-field
                    v-model="item.Scancode"
                    name="scancode"
                    label="Scancode"
                    id="scancode"
                    disabled></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row class="mb-2">
                <v-flex xs12 sm6 offset-sm3 >
                <v-dialog
                    persistent
                    lazy
                    full-width
                    width="290px"
                  >
                    <v-text-field
                      slot="activator"
                      label="SellBy date"
                      v-model="sellByDate"
                      id="sellByDate"
                      readonly
                      v-focus
                    ></v-text-field>
                    <v-date-picker v-model="sellByDate" scrollable actions required>
                      <template slot-scope="{ save, cancel }">
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
                          <v-btn flat color="primary" @click="save">OK</v-btn>
                        </v-card-actions>
                      </template>
                    </v-date-picker>
                  </v-dialog>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12 sm6 offset-sm3 mb-3>
                  <v-btn small class="primary" type="submit">Save</v-btn>
                  <v-btn small class="secondary" @click="cancel">Cancel</v-btn>
                </v-flex>
              </v-layout>
            </form>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import format from "date-fns/format";
export default {
  computed: {
    item () {
      return this.$store.state.loadedProduct
    },
    sellByDate: {
      get () {
        return this.$store.state.loadedProduct.SellbyDate
      },
      set (value) {
        this.$store.commit('updateLoadedProduct', value)
      }
    }
  },
  methods: {
    addItem() {
      const today = new Date();
      const newItem = {
        Scancode: this.item.Scancode,
        ReceiptAlias: this.item.ReceiptAlias,
        Brand: this.item.Brand,
        SellbyDate: this.sellByDate,
        creatorId: this.item.creatorId,
        editedBy: this.$store.state.user.userId,
        lastEditDate: format(today, "MMM Do YYYY h:mm A"),
        reorderDate: this.item.reorderDate
      };

      if (this.sellByDate === "") {
        alert("Please enter a SellBy date!");
      } else {
        this.$store.state.loc = "/products";
        this.$store.dispatch("addNewItem", newItem);
      }
    },
    format(val) {
      return format(val, "MM-DD-YYYY");
    },
    cancel() {
      this.$store.commit('clearLoadedProduct')
      this.$router.replace('/products')
    }
  }
};
</script>

<style scoped>

</style>