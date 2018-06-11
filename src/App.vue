<template>
  <v-app>
    <v-toolbar v-if="!hideNav" class="primary">

      <v-toolbar-side-icon @click.stop="sideNav = !sideNav" class="hidden-sm-and-up"/>
      <v-toolbar-title class="white--text ml-0">
          <router-link v-if="userIsAuthenticated && $store.state.user.authLevel === '1'"
            to='/itemCheckin'
            tag="span"
            style="cursor: pointer">
              <v-btn flat class="white--text ml-0">Sell By Date Demo</v-btn>
          </router-link>
          <v-btn v-else flat class="white--text ml-0">Sell By Date Demo</v-btn>
      </v-toolbar-title>

      <v-spacer/>

      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat v-for="item in menuItems" :key="item.title" :to="item.link" class="white--text">
          {{item.title}}
        </v-btn>
        <v-btn v-if="userIsAuthenticated && $store.state.products.length > 0" flat class="white--text" @click="$router.push('/reorders')">
            Restock
        </v-btn>
        <v-btn v-if="userIsAuthenticated && $store.state.products.length > 0" flat class="white--text" @click="logOut">
            Log out
        </v-btn>
      </v-toolbar-items>

    </v-toolbar>

    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>

  </v-app>
</template>

<script>
export default {
  data() {
    return {
      sideNav: false
    };
  },
  computed: {
    menuItems() {
      let menuItems = [];

      if (
        this.$store.state.user &&
        this.$store.state.user.authLevel === "1" &&
        this.$store.state.products.length > 0
      ) {
        menuItems = [
          { icon: "home", title: "Check in", link: "/itemCheckIn" },
          { icon: "view_list", title: "Products", link: "/products" },
          { icon: "note_add", title: "Add Item", link: "/addNewItem" },
          { icon: "supervisor_account", title: "Users", link: "/users" }
        ];
      } else {
        this.$router.replace("/signin");
      }

      return menuItems;
    },
    userIsAuthenticated() {
      return this.$store.state.user
    },
    user() {
      return this.$store.state.user;
    },
    hideNav() {
      return this.$store.state.hideNav
    }
  },
  methods: {
    logOut() {
      this.$store.commit("clearAll");
    }
  }
};
</script>