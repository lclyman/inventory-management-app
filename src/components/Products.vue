<template>
  <div>
    <v-card>
      <v-card-title>
        <h3>Products</h3> &nbsp;&nbsp;&nbsp; (click on any item icons to demo)
        <v-spacer></v-spacer>
        <v-text-field
          append-icon="search"
          label="Scan/Search"
          single-line
          id="search"
          hide-details
          v-model="search"
          v-focus
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="products"
        :search="search"
        :pagination.sync="pagination"
        :rows-per-page-items="rppi"
      >
        <template slot="items" slot-scope="props">
          <td class="text-xs-left">{{ props.item.brandName }}</td>
          <td class="text-xs-left">{{ props.item.receiptAlias }}</td>
          <td class="text-xs-left">{{ props.item.scancode }}</td>
          <td v-if="props.item.sellByDate!==tmpSellByDate" class="text-xs-left">{{ props.item.sellByDate | formatDateShort}}</td>
          <td v-else class="text-xs-left"></td>
          <td class="text-xs-left">
            <router-link :to="{name: 'editItem',
              params: { item: props.item, from: '/products'} }"
              tag="span">
              <v-icon class="mr-3">edit</v-icon>
            </router-link>
            <v-icon v-show="props.item.sellByDate !== tmpSellByDate" @click="returnItem(props.item)" class="mr-0">update</v-icon>
            <v-icon v-show="!props.item.onReorderList" @click="reorder(props.item)" class="ml-3">add_shopping_cart</v-icon>
          </td>
        </template>
        <v-alert slot="no-results" :value="true" color="error" icon="warning">
          Your search for "{{ search }}" found no results.
        </v-alert>
      </v-data-table>
        <div class="text-xs-center pt-2">
          <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
        </div>
    </v-card>
  </div>
</template>

<script>
import { store } from "../store/index";
import format from "date-fns/format";
import addWeeks from "date-fns/add_weeks";
import computed from "../mixins/computed";
export default {
  mixins: [computed],
  data() {
    return {
      search: "",
      // tmpSellByDate: format(addWeeks(new Date(), 520), "YYYY-MM-DD"),
      selected: [],
      pagination: {},
      rppi: [
        "25",
        "50",
        "75",
        "100",
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
          value: "sellByDate",
          sortable: false,
          align: "left"
        }
      ]
    };
  },
  computed: {
    products() {
      if (this.user.authLevel !== "1") {
        return this.$store.getters.productsMissingSellBy;
      } else {
        return this.$store.getters.products.sort(
          (a, b) => new Date(a.sellByDate) - new Date(b.sellByDate)
        );
      }
    },
    user() {
      return this.$store.state.user;
    },
    tmpSellByDate() {
      return this.$store.state.defaultSellByDate
    }
  },
  methods: {
    returnItem(item) {
      const today = new Date();
      let creatorId = "";

      if (item.creatorId === "") {
        creatorId = this.$store.state.user.userId;
      } else {
        creatorId = item.creatorId;
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
      };
      const str =
        '<b style="color:"green;">Delete sell by date and return ' +
        item.receiptAlias +
        " to the database ?</b>";
      this.$dialog.confirm(str).then(() => {
        this.$store.state.loc = "/products";
        this.$store.dispatch("editItem", editedItem);
        this.search = "";
      });
    },
    reorder(item) {
      const today = new Date();
      let creatorId = "";

      if (item.creatorId === "") {
        creatorId = this.$store.state.user.userId;
      } else {
        creatorId = item.creatorId;
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
      };

      const str =
        '<b style="color:"green;">Place ' +
        item.receiptAlias +
        " on restock list?</b>";
      this.$dialog.confirm(str).then(() => {
        this.$store.state.loc = "/reorders";
        this.$store.dispatch("reorderItem", reorderedItem);
      });
    }
  }
};
</script>

<style scoped>
.icon {
  margin-left: 0px;
  margin-right: 15px;
}
</style>