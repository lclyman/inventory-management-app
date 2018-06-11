<template>
  <div>
    <v-card>
      <v-card-title>
        Users<router-link to="/signup" class="addUser">Add new user</router-link>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="users"
        :pagination.sync="pagination"
        :rows-per-page-items="rppi"
      >
        <template slot="items" slot-scope="props">
          <td class="text-xs-left">{{ props.item.name }}</td>
          <td class="text-xs-left">{{ props.item.email }}</td>
          <td class="text-xs-center">{{ props.item.authLevel}}</td>
          <td class="text-xs-right">
            <!-- <router-link :to="{name: 'editUser',
              params: { user: props.item } }"
              tag="span"> -->
                <v-btn flat small class="mr-0"><v-icon>edit</v-icon></v-btn>
            <!-- </router-link> -->
            <v-icon @click="deleteItem">delete</v-icon>
          </td>
        </template>
      </v-data-table>
        <div class="text-xs-center pt-2">
          <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
        </div>
    </v-card>
  </div>
</template>

<script>
import { store } from "../store/index"
import computed from "../mixins/computed"

export default {
  mixins: [computed],
  data() {
    return {
      delete: false,
      pagination: {},
      rppi: [
        "20",
        {
          text: "All",
          value: -1
        }
      ],
      headers: [
        {
          text: "Name",
          align: "left",
          sortable: false,
          value: "name"
        },
        { text: "Email", value: "email", align: "left", sortable: false },
        {
          text: "Auth level",
          value: "authLevel",
          align: "center",
          sortable: false
        }
      ]
    }
  },
  computed: {
    users() {
      return this.$store.state.loadedUsers
    }
  },
  methods: {
    deleteItem() {
      // const str = "You can delete users from the Firebase Console!"
      const str = "Disabled for demo!"
      this.$dialog.confirm(str).then(() => "")
    }
  }
}
</script>

<style scoped>
.addUser {
  margin-left: 50px;
  font-size: 13px;
}
</style>