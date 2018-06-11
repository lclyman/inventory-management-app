<template>
<v-container>
  <v-layout row v-show="errorMessage">
    <v-flex xs12 sm6 offset-sm3>
      <app-alert @dismissed="onDismissed" :msg="errorMessage" type="error"/>
    </v-flex>
  </v-layout>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-card-text>
          <v-container>
            <h2 class="mb-3"> Add new user</h2>
            <p class="disabled">(Disabled on demo)</p>
            <form @submit.prevent="onSignUp">
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    name="fname"
                    label="First name"
                    id="fname"
                    type="text"
                    v-model="fname"
                    required></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    name="lname"
                    label="Last name"
                    id="lname"
                    type="text"
                    v-model="lname"
                    required></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    name="email"
                    label="Email"
                    id="email"
                    type="email"
                    v-model="email"
                    required></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    name="password"
                    label="Password"
                    id="pwd"
                    type="password"
                    v-model="pwd"
                    required></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row wrap class="mb-3">
                <v-flex xs12>
                  <v-text-field
                    name="confirmPassword"
                    label="Confirm Password"
                    id="cpwd"
                    type="password"
                    v-model="cpwd"
                    required
                    ></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row no-wrap>
                <v-flex xs12>
                  <!-- <v-btn small type="submit" :disabled="loading" :loading="loading">Add user -->
                  <v-btn small type="submit" disabled>Add user
                    <span slot="loader" class="custom-loader">
                      <v-icon light>cached</v-icon>
                    </span>
                  </v-btn>
                <v-btn small :disabled="loading" :loading="loading" @click="$router.replace('/users')">Cancel
                    <span slot="loader" class="custom-loader">
                      <v-icon light>cached</v-icon>
                    </span>
                  </v-btn>
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
  data() {
    return {
      fname: "",
      lname: "",
      email: "",
      pwd: "",
      cpwd: ""
    };
  },
  computed: {
    comparePasswords() {
      return this.pwd !== this.cpwd;
    },
    errorMessage() {
      return this.$store.state.fbError;
    },
    user() {
      return this.$store.state.user;
    },
    loading() {
      return this.$store.getters.loading;
    }
  },
  watch: {
    user(value) {
      if (value !== null && value !== undefined) {
        this.$router.replace("/");
      }
    }
  },
  methods: {
    onSignUp() {
      let fullName = this.fname.trim() + " " + this.lname.trim();
      const newUser = {
        email: this.email,
        password: this.pwd,
        name: fullName,
        authLevel: "3"
      };
      if (this.comparePasswords) {
        alert("Passwords don't match!");
      } else {
        this.$store.state.loc = "/";
        this.$store.dispatch("signUp", newUser);
      }
    },
    onDismissed() {
      this.$store.commit("clearError");
    }
  }
};
</script>

<style scoped>

.disabled {
  font-style: italic;
  margin-bottom: 0;
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