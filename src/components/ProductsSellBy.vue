<template>
  <div>
    <v-card>
      <v-card-title>
        <h4>Upcoming Sell By dates</h4>
        <span v-show="!$store.state.hideNav" class="printable" @click="changeView">{{txtView}}</span>
        <!-- <span class="printable" @click="makePrintable">{{ txtPrintable }}</span> -->
        <span class="printable"  @click="exportPdf">Print to pdf</span>
        <v-spacer></v-spacer>
        <v-text-field
        v-show="!printable"
          append-icon="search"
          label="Search"
          single-line
          id="search"
          hide-details
          v-focus
          v-model="search"
        ></v-text-field>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="productsDue"
        :search="search"
        :pagination.sync="pagination"
        :rows-per-page-items="rppi"
      >
        <template slot="items" slot-scope="props">
          <td class="text-xs-left">{{ props.item.brandName }}</td>
          <td class="text-xs-left">{{ props.item.receiptAlias }}</td>
          <td class="text-xs-left">{{ props.item.scancode }}</td>
          <td class="text-xs-left">{{ props.item.SellbyDate | formatDateShort}}</td>
          <td v-show="user.authLevel==='1' && !printable" class="text-xs-left">
            <router-link :to="{name: 'editItem',
              params: { item: props.item, from: '/productsSellBy' } }"
              tag="span">
              <v-icon class="mr-3">edit</v-icon>
            </router-link>
            <v-icon @click="returnItem(props.item)" class="mr-0">update</v-icon>
            <v-icon v-show="!props.item.onReorderList" @click="reorder(props.item)" class="ml-3">add_shopping_cart</v-icon>
          </td>
        </template>
        <v-alert slot="no-results" :value="true" color="error" icon="warning">
          Your search for "{{ search }}" found no results.
        </v-alert>
      </v-data-table>

        <div v-show="!printable" class="text-xs-center pt-2">
          <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
        </div>
    </v-card>
  </div>
</template>

<script>
import { store } from "../store/index"
import format from "date-fns/format"
import computed from "../mixins/computed"
import methods from "../mixins/printUtils"
export default {
  mixins: [computed, methods],
  created() {
    this.txtView = "Month view"
    this.$store.state.showMonth = false
  },
  data() {
    return {
      today: new Date(),
      txtPrintable: "Printable version",
      txtView: "Month view",
      search: "",
      selected: [],
      pagination: {},
      items: this.$store.getters.getSellBySoon,
      rppi: [
        "300",
        {
          text: "All",
          value: -1
        }
      ],
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
        { text: "Scancode", value: "scancode", align: "left", sortable: false },
        {
          text: "Sell By Date",
          value: "SellbyDate",
          sortable: false,
          align: "left"
        }
      ]
    }
  },
  computed: {
    showMonth() {
      return this.$store.state.showMonth
    },
    user() {
      return this.$store.state.user
    },
    productsDue() {
      if (!this.showMonth) {
        return this.$store.getters.getSellBySoon.sort(
          (a, b) => new Date(a.SellbyDate) - new Date(b.SellbyDate)
        )
      } else {
        return this.$store.getters.getSellBySoonMonth.sort(
          (a, b) => new Date(a.SellbyDate) - new Date(b.SellbyDate)
        )
      }
    }
  },
  methods: {
    getData() {
      let arrItems = []
      this.productsDue.forEach(el => {
        arrItems.push({
          BrandName: el.brandName,
          ProductName: el.receiptAlias,
          Scancode: el.scancode,
          SellbyDate: el.SellbyDate
        })
      })
      return arrItems
    },
    getColumns() {
      return [
        { title: "Brand Name", dataKey: "BrandName" },
        { title: "Product name", dataKey: "ProductName" },
        { title: "Scancode", dataKey: "Scancode" },
        { title: "Sell By Date", dataKey: "SellbyDate" }
      ]
    },
    exportPdf() {
      let doc = new jsPDF("p", "pt")
      doc.autoTable(this.getColumns(), this.getData())
      doc.save("SellByDue.pdf")
    },
    returnItem(item) {
      const today = new Date()
      let creatorId = ""

      if (item.creatorId === "") {
        creatorId = this.$store.state.user.userId
      } else {
        creatorId = item.creatorId
      }

      const editedItem = {
        id: item.id,
        brd_name: item.brandName,
        inv_receiptalias: item.receiptAlias,
        inv_scancode: item.scancode,
        SellbyDate: "",
        creatorId: creatorId,
        editedBy: item.editedBy,
        lastEditDate: today
      }

      const str =
        '<b style="color:"green;">Delete sell by date and return ' +
        item.receiptAlias +
        " to the database ?</b>"
      this.$dialog.confirm(str).then(() => {
        this.$store.state.loc = "/productsSellBy"
        this.$store.dispatch("editItem", editedItem)
      })
    },
    reorder(item) {
      const today = new Date()
      let creatorId = ""

      if (item.creatorId === "") {
        creatorId = this.$store.state.user.userId
      } else {
        creatorId = item.creatorId
      }

      const reorderedItem = {
        id: item.id,
        brd_name: item.brandName,
        inv_receiptalias: item.receiptAlias,
        inv_scancode: item.scancode,
        SellbyDate: "",
        onReorderList: true,
        creatorId: creatorId,
        editedBy: item.editedBy,
        lastEditDate: today
      }

      const str =
        '<b style="color:"green;">Place ' +
        item.receiptAlias +
        " on restock list?</b>"
      this.$dialog.confirm(str).then(() => {
        this.$store.state.loc = "/reorders"
        this.$store.dispatch("reorderItem", reorderedItem)
      })
    },
    changeView() {
      this.$store.commit("changeView")
      this.txtView === "Month view"
        ? (this.txtView = "10 day view")
        : (this.txtView = "Month view")
    }
  }
}
</script>

<style scoped>
.icon {
  margin-left: 0px;
  margin-right: 15px;
}

.printable {
  font-size: 13px;
  margin-left: 20px;
  text-decoration: underline;
  cursor: pointer;
}
</style>
