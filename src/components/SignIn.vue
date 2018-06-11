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
            <h2> Sign In</h2>
            <form @submit.prevent="onSignIn">

              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    name="email"
                    label="Email"
                    id="email"
                    type="email"
                    placeholder="enter: admin@admin.com"
                    v-model="email"
                    v-focus
                    required></v-text-field>
                </v-flex>
              </v-layout>

              <p v-show="pwd != ''" class="show" @click="switchVisibility">Show password</p>

              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    name="password"
                    label="Password"
                    placeholder= "enter: admin123"
                    id="pwd"
                    :type="passwordFieldType"
                    v-model="pwd"
                    required></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row no-wrap>
                <v-flex xs12>
                  <v-btn type="submit" :disabled="loading" :loading="loading" class="mt-4">Sign in
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
  created() {
    this.email = "";
    this.password = "";
  },
  data() {
    return {
      email: "",
      pwd: "",
      passwordFieldType: "password",
      alert: true
    };
  },
  computed: {
    errorMessage() {
      return this.$store.state.fbError;
    },
    loading() {
      return this.$store.state.loading;
    }
  },
  methods: {
    onSignIn() {
      const user = {
        email: this.email,
        password: this.pwd
      };
      this.$store.commit("setLoc", "/itemCheckin");
      this.$store.dispatch("signIn", user);
    },
    onDismissed() {
      this.$store.commit("clearError");
    },
    switchVisibility() {
      this.passwordFieldType =
        this.passwordFieldType === "password" ? "text" : "password";
      setTimeout(() => {
        this.passwordFieldType = "password";
      }, 1000);
    }
  }
};
</script>

<style scoped>
.show {
  font-size: 11px;
  text-decoration: underline;
  margin-bottom: 10px;
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