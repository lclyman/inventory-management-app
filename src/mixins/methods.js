const methods = {
  methods: {
    makePrintable() {
      if (!this.printable) {
        this.$store.commit('makePrintable')
        this.txtPrintable = '<<<'
      } else {
        this.$store.commit('showNavbar')
        this.txtPrintable = 'Printable version'
      }
    }
  }
}

export default methods;