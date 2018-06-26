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
    },
    getData() {
      let arrItems = []
      if(this.productsDue) {
        this.productsDue.forEach(el => {
          arrItems.push({
            BrandName: el.brandName,
            ProductName: el.receiptAlias,
            Scancode: el.scancode,
            SellbyDate: el.SellbyDate
          })
        })
      } else {
        this.reorders.forEach(el => {
          arrItems.push({
            BrandName: el.brandName,
            ProductName: el.receiptAlias,
            Scancode: el.scancode,
          })
        })
      }

      return arrItems
    },
    getColumns() {
      return [{
          title: "Brand Name",
          dataKey: "BrandName"
        },
        {
          title: "Product name",
          dataKey: "ProductName"
        },
        {
          title: "Scancode",
          dataKey: "Scancode"
        },
        {
          title: "Sell By Date",
          dataKey: "SellbyDate"
        }
      ]
    },
    exportPdf() {
      let doc = new jsPDF("p", "pt")
      doc.autoTable(this.getColumns(), this.getData())
      doc.save("SellByDue.pdf")
    },
  }
}

export default methods;
