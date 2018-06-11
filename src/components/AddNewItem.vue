<template>
  <v-layout>
    <v-flex xs10 offset-xs1>
      <v-card>
        <v-layout row class="primary mt-2">
          <v-flex xs8 offset-xs2>
            <h2 class="mt-2 mb-2 white--text">Add New Item</h2>
          </v-flex>
        </v-layout>
        <v-layout row mt-2>
          <v-flex >
            <form>
              <v-layout row>
                <v-flex xs8 offset-xs2>
                  <v-text-field
                    v-model="scancode"
                    v-focus
                    name="scancode"
                    label="Scancode"
                    id="scancode"
                    :disabled="this.$store.state.addItem"
                    required></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs8 offset-xs2>
                  <p>{{messageSuccess}}</p>
                  <v-text-field
                    v-model="brandName"
                    name="brandName"
                    label="Brand name"
                    id="brandName"
                    required></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs8 offset-xs2>
                  <v-text-field
                    v-model="receiptAlias"
                    name="receiptAlias"
                    label="Receipt Alias"
                    id="receiptAlias"
                    required></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row class="mb-2">
                <v-flex xs8 offset-xs2>
                <v-dialog
                    persistent
                    lazy
                    full-width
                    width="290px"
                  >
                    <v-text-field
                      slot="activator"
                      label="SellBy Date"
                      v-model="sellByDate"
                      readonly
                    ></v-text-field>
                    <v-date-picker v-model="sellByDate" scrollable actions>
                      <template slot-scope="{ save, cancel }">
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
                          <v-btn flat color="secondary" @click="save">OK</v-btn>
                        </v-card-actions>
                      </template>
                    </v-date-picker>
                  </v-dialog>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs8 offset-xs2 mb-3>
                  <v-btn small class="primary mr-2" :disabled="!formIsValid" @click="addItem('/products')">Save</v-btn>
                  <v-btn small class="primary mr-2" :disabled="!formIsValid" @click="addItem('/addNewItem')">Save + add another</v-btn>
                  <v-btn small class="info mr-2" @click="clear">Clear</v-btn>
                  <v-btn small class="secondary" @click="cancel">cancel</v-btn>
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
  data() {
    return {
      brandName: "",
      receiptAlias: "",
      scancode: "",
      sellByDate: ""
    };
  },
  created() {
    if (!this.$store.state.addItem) {
      this.$store.commit('clearLoadedScancode')
    } else {
      this.scancode = this.$store.state.loadedScancode
    }
  },
  computed: {
    formIsValid() {
      return (
        this.loadedScancode !== "" &&
        this.receiptAlias !== "" &&
        this.brandName !== ""
      );
    },
    messageSuccess() {
      return this.$store.state.messageSuccess
    }
  },
  methods: {
    addItem(dest) {
      const today = new Date();
      const newItem = {
        Brand: this.brandName,
        ReceiptAlias: this.receiptAlias,
        Scancode: this.scancode,
        SellbyDate: this.sellByDate,
        creatorId: this.$store.state.user.userId,
        editedBy: "",
        lastEditDate: "",
        reorderDate: ""
      };
      this.$store.commit("setLoc", dest)
      this.$store.dispatch("addNewItem", newItem)
      this.$store.commit("setAddItem", false)
      this.scancode = ""
      this.brandName = ""
      this.receiptAlias = ""
      this.sellByDate = ""
      if(dest == '/addNewItem') {
        document.getElementById('scancode').focus()
      }

    },
    clear() {
      this.scancode = "";
      this.$store.commit("setLoadedScancode", "")
      this.$store.commit("setAddItem", false)
      this.brandName = ""
      this.receiptAlias = ""
      this.sellByDate = ""
    },
    cancel() {
      this.$router.go(-1)
      this.$store.commit("setAddItem", false)
    }
  }
};
</script>

<style scoped>
</style>