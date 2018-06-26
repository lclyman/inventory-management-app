<template>
  <div>
    <v-card>
      <v-card-title>
        <h3>Restock list -- {{new Date() | formatDate}}</h3>
        <span class="printable mr-3"  @click="exportPdf">Print to pdf</span>
          <v-text-field
            v-model.trim="scancode"
            v-focus
            name="scancode"
            label="Enter scancode"
            id="scancode"
            >
          </v-text-field>
          <span class="msg">
            {{message}}{{messageSuccess}}
          </span>

        <span v-show="!printable">
          <v-btn small  class="primary ml-3 mr-3" :disabled="!formIsValid" @click="getInput">Save</v-btn>
          <v-btn v-show="reorders.length !== 0" small class="clear" @click="removeAll" :disabled="loading" :loading="loading" >Clear list</v-btn>
        </span>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="reorders"
        :pagination.sync="pagination"
        :rows-per-page-items="rppi"
      >
        <template slot="items" slot-scope="props">
          <td class="text-xs-left">{{ props.item.brandName }}</td>
          <td class="text-xs-left">{{ props.item.receiptAlias }}</td>
          <td class="text-xs-left">{{ props.item.scancode}}</td>
          <td v-show="!printable"  class="text-xs-left">
            <v-icon @click="remove(props.item)" class="ml-3" :disabled="loading" :loading="loading">remove_shopping_cart</v-icon>
          </td>
        </template>
       <span v-show="loading" slot="loader" class="custom-loader">
          <v-icon light>cached</v-icon>
        </span>
      </v-data-table>
        <div v-show="!printable" class="text-xs-center pt-2">
          <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
        </div>
    </v-card>
  </div>
</template>

<script>
import { store } from "../store/index"
import computed from "../mixins/computed"
import methods from "../mixins/printUtils"
import * as firebase from "firebase"
export default {
  mixins: [computed, methods],
  data() {
    return {
      pagination: {},
      scancode: "",
      txtPrintable: "Printable version",
      rppi: ["50", { text: "All", value: -1 }],
      headers: [
        {
          text: "Brand name",
          align: "left",
          sortable: false,
          value: "brandName"
        },
        {
          text: "Product name",
          align: "left",
          sortable: false,
          value: "receiptAlias"
        },
        { text: "Scancode", value: "scancode", align: "left", sortable: false }
      ]
    }
  },
  mounted() {
    this.$store.commit("setMessageSuccess", "")
    this.$store.commit("setMessage", "")
    this.$store.commit("setLoading", false)
  },
  computed: {
    reorders() {
      return this.$store.getters.reorderedItems
    },
    message() {
      return this.$store.state.message
    },
    messageSuccess() {
      return this.$store.state.messageSuccess
    },
    formIsValid() {
      return this.scancode !== ""
    },
    loading() {
      return this.$store.state.loading
    }
  },
  methods: {
    getInput() {
      let scancodeFound = this.$store.state.products.find(el => el.scancode === this.scancode)
      let obj = {sc: this.scancode, scancodeFound}
      this.$store.commit("clearMessage")
      this.$store.state.loc = "/reorders"
      this.$store.dispatch("addOrder", obj)
      this.scancode = ""
      document.getElementById("scancode").focus()
    },
    remove(item) {
      const str =
        '<b style="color:"green;">Remove ' +
        item.receiptAlias +
        " from restock list ?</b>"
      this.$dialog.confirm(str).then(() => {
        this.scancode = ""
        document.getElementById("scancode").value = ""
        let objItem = { itemId: item.id, action: "remove" }
        this.$store.commit("setLoc", "/reorders")
        this.$store.dispatch("setRestockStatus", objItem)
      })
    },
    removeAll() {
      const str = '<b style="color:"green;">Clear the restock list ?</b>'
      this.$dialog.confirm(str).then(() => {
        this.scancode = ""
        document.getElementById("scancode").value = ""
        this.$store.commit("setLoc", "/reorders")
        this.$store.dispatch("clearRestockList")
      })
    },
    clear() {
      this.scancode = ""
      document.getElementById("scancode").focus()
    }
  }
}
</script>

<style scoped>
.printable {
  font-size: 13px;
  margin-left: 20px;
  text-decoration: underline;
  cursor: pointer;
}

.msg {
  font-size: 13px;
  font-weight: 500;
  font-style: italic;
  margin-top: 0;
}

.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
