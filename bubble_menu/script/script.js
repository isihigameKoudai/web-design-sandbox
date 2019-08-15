var vue = new Vue({
  el: '#app',
  data() {
    return {
      formOpen: false,
      productData: {
        title: '',
        rating: '',
        price: '',
        list_price: '',
        is_featured: false
      }
    }
  },
  methods: {
    resetForm() {
      this.productData = {
        title: '',
        rating: '',
        price: '',
        list_price: '',
        is_featured: false
      }
    },
    cancel() {
      this.formOpen = false;
      this.resetForm();
    }
  }
})
