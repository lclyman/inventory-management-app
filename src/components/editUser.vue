<template>
<v-container>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-card-text>
          <v-container>
            <h2 class="mb-2"> Edit User</h2>
            <form @submit.prevent="onEditUser">

              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    name="name"
                    label="Name"
                    id="name"
                    type="text"
                    v-model="user.name"
                    disabled></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    name="email"
                    label="Email"
                    id="email"
                    type="email"
                    v-model="user.email"
                    disabled></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    name="authLevel"
                    label="Auth Level"
                    id="authLevel"
                    type="text"
                    v-model="user.authLevel"
                    required></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-btn small class="primary" type="submit">Save changes</v-btn>
                  <v-btn small class="secondary" @click="$router.push('/users')">Cancel</v-btn>
                </v-flex>
              </v-layout>
            </form>
          </v-container>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
export default {
  props: ["user"],
  data() {
    return {
      name: "",
      email: "",
      authLevel: ""
    };
  },
  methods: {
    onEditUser() {
      const editedUser = {
        name: this.user.name,
        authLevel: document.getElementById("authLevel").value,
        email: this.user.email,
        userId: this.user.userId
      };
      this.$store.state.loc = "/users";
      this.$store.dispatch("editUser", editedUser);
    }
  }
};
</script>

<style scoped>

</style>