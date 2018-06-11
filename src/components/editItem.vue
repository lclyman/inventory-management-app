<template>
  <v-layout>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-layout row class="primary" wrap>
          <v-flex xs12 sm6 offset-sm3>
            <h3 class="mt-2  mb-2 white--text">Edit item</h3>
          </v-flex>
        </v-layout>
        <v-divider class="mb-3"></v-divider>

          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field
                v-model="item.brandName"
                name="brandName"
                label="Brand Name"
                id="brandName"
                required></v-text-field>
            </v-flex>
          </v-layout>

        <v-layout row>
          <v-flex xs12>
            <form @submit.prevent="editItem">
              <v-layout row>
                <v-flex xs12 sm6 offset-sm3>
                  <v-text-field
                    v-model="item.receiptAlias"
                    name="receiptAlias"
                    label="Receipt Alias"
                    id="receiptAlias"
                    required></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12 sm6 offset-sm3>
                  <v-text-field
                    v-model="item.scancode"
                    name="scancode"
                    label="Scancode"
                    id="scancode"
                    required></v-text-field>
                </v-flex>
              </v-layout>

            <!-- compare data()'tmpSellByDate' (created when app loads products)
              to 'item.sellByDate' to display existing sellBy date -->

              <v-layout row class="mb-2">
                <v-flex xs12 sm6 offset-sm3 >
                <v-dialog v-if="item.sellByDate !== tmpSellByDate"
                    persistent
                    lazy
                    full-width
                    width="290px"
                  >
                    <v-text-field
                      slot="activator"
                      :label="'SellBy date: ' +format(itemSellByDate,'MM-DD-YYYY')"
                      v-model="itemSellByDate"
                      id="sellByDate"
                      readonly
                    ></v-text-field>
                    <v-date-picker v-model="itemSellByDate" scrollable actions>
                      <template slot-scope="{ save, cancel }">
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
                          <v-btn flat color="primary" @click="save">OK</v-btn>
                        </v-card-actions>
                      </template>
                    </v-date-picker>
                  </v-dialog>

           <!-- display defaults and bind to data() 'sellByDate'  -->

                  <v-dialog v-else
                      persistent
                      lazy
                      full-width
                      width="290px"
                    >
                      <v-text-field
                        slot="activator"
                        label="SellBy Date"
                        v-model="sellByDate"
                        id="sellByDate"
                        readonly
                      ></v-text-field>
                      <v-date-picker v-model="sellByDate" scrollable actions>
                        <template slot-scope="{ save, cancel }">
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
                            <v-btn flat color="primary" @click="save">OK</v-btn>
                          </v-card-actions>
                        </template>
                      </v-date-picker>
                    </v-dialog>
                  <!-- <p v-show="item.lastEditDate !== ''"><em>Last edited: {{item.lastEditDate | formatDateShort}}</em></p> -->
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12 sm6 offset-sm3 mb-3>
                  <v-btn small class="primary mr-4" type="submit">Save</v-btn>
                  <v-btn small class="secondary" @click="$router.go(-1)">Cancel</v-btn>
                  <v-btn small flat class="info mt-3" @click="duplicate">Duplicate</v-btn>
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
import addWeeks from "date-fns/add_weeks";
export default {
  props: ["item", "from"],
  data() {
    return {
      sellByDate: "",
      itemSellByDate: format(this.item.sellByDate, "YYYY-MM-DD"),
      tmpSellByDate: format(addWeeks(new Date(), 520), "YYYY-MM-DD")
    };
  },
  methods: {
    editItem() {
      const today = new Date();
      const editedItem = {
        id: this.item.id,
        Scancode: document.getElementById("scancode").value,
        ReceiptAlias: document.getElementById("receiptAlias").value,
        Brand: document.getElementById("brandName").value,
        SellbyDate: document.getElementById("sellByDate").value,
        creatorId: this.item.creatorId,
        editedBy: this.$store.state.user.userId,
        lastEditDate: format(today, "MMM Do YYYY h:mm A")
      };
      this.$store.state.loc = this.from;
      this.$store.dispatch("editItem", editedItem);
    },
    duplicate() {
      const today = new Date();
      const duplicateItem = {
        Scancode: document.getElementById("scancode").value,
        ReceiptAlias: document.getElementById("receiptAlias").value,
        Brand: document.getElementById("brandName").value,
        SellbyDate: "",
        creatorId: this.item.creatorId,
        editedBy: this.$store.state.user.userId,
        lastEditDate: format(today, "MMM Do YYYY h:mm A"),
        reorderDate: ""
      };
      this.$store.commit("clearLoadedProduct");
      this.$store.commit("loadProduct", duplicateItem);
      this.$router.push('/duplicateItem')
    },
    format(val) {
      return format(val, "MM-DD-YYYY");
    }
  }
};
</script>

<style scoped>

</style>