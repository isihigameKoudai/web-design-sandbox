const menuItems = document.querySelectorAll('.menu__item');
let menuItemActive = document.querySelector('.menu__item--active');

// ---
// App
// ---

// for (var i = 0; i < menuItems.length; i++) {
//   menuItems[i].addEventListener('click', buttonClick);
// }

// ---------
// Functions
// ---------

// function buttonClick() {
//   if (!this.classList.contains('menu__item--active')) {
//     document.body.style.backgroundColor = `#${this.getAttribute('data-background')}`;

//     menuItemActive.classList.remove('menu__item--active');
//     this.classList.add('menu__item--active');

//     menuItemActive.classList.add('menu__item--animate');
//     this.classList.add('menu__item--animate');

//     menuItemActive = this;
//   }
// }

new Vue({
  el: '#app',
  data() {
    return {
      background: '#fffff',
      isShownMenu: false,
      isActiveMemo: true,
      isActiveLook: false,
      isActivePerson: false,
      isActiveSetting: false
    }
  },
  methods: {
    toggleMenu() {
      this.isShownMenu = !this.isShownMenu;
    },
    onClickMemo(color) {
      this.setBgColor(color);

      // this.resetAllCategory();
      this.isActiveMemo = true;
      this.isActivePerson = false;
      this.isActiveLook = false;
      this.isActiveSetting = false;
    },
    onClickPerson(color) {
      this.setBgColor(color);

      this.isActivePerson = true;
      this.isActiveLook = false;
      this.isActiveSetting = false;
      this.isActiveMemo = false;
    },
    onClickLook(color) {
      this.setBgColor(color);

      this.isActiveLook = true;
      this.isActiveSetting = false;
      this.isActiveMemo = false;
      this.isActivePerson = false;
    },
    onClickSetting(color) {
      this.setBgColor(color);

      // this.resetAllCategory();
      this.isActiveSetting = true;
      this.isActiveMemo = false;
      this.isActivePerson = false;
      this.isActiveLook = false;
    },
    setBgColor(color){
      const bg = document.querySelector('body');
      bg.style.background = color;
    },
    resetAllCategory() {
      this.isActiveMemo = false;
      this.isActivePerson = false;
      this.isActiveLook = false;
      this.isActiveSetting = false;
    }
  }
})
