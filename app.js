// Дэлгэцтэй ажиллах контроллер
let uiController = (function () {
  let DOMStrings = {
    addBtn: ".add__btn",
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
  };

  return {
    getDOMStrings: function () {
      return DOMStrings;
    },
    getInput: function () {
      return {
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: document.querySelector(DOMStrings.inputValue).value,
      };
    },
  };
})();

// Санхүүтэй ажиллах контроллер
let financeController = (function () {})();

// Холбогч контроллер, Хоёр контроллерыг хооронд нь холбох үүрэгтэй
let appController = (function (uiCtrl, fnCtrl) {
  let DOM = uiCtrl.getDOMStrings();
  let ctrlAddItem = function () {
    // 1. Дэлгэцнээс өгөгдлүүдийг авна.
    let input = uiCtrl.getInput();
    console.log(input);
    // 2. Санхүүгийн модульд дамжуулаад тэнд хадгална
    // 3. Орлого зарлагийн тохирох хэсэгт дэлгэцэнд үзүүлнэ
    // 4. Үлдэгдлийг тооцоолно
    // 5. Дэлгэцэнд үлдэгдлийг харуулна};
  };

  let setupEventListeners = function () {
    document.querySelector(DOM.addBtn).addEventListener("click", function () {
      ctrlAddItem();
    });

    document.addEventListener("keypress", function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };

  return {
    init: function () {
      setupEventListeners();
    },
  };
})(uiController, financeController);

appController.init();
