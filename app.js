// Дэлгэцтэй ажиллах контроллер
let uiController = (function () {
  let DOMStrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    incomeList: ".income__list",
    expenseList: ".expenses__list",
    addBtn: ".add__btn",
  };

  let nodeListForEach = function (nodeList, callback) {
    for (let i = 0; i < nodeList.length; i++) {
      callback(nodeList[i]);
    }
  };
  return {
    clearFields: function () {
      // Цэвэрлэх листүүд Nodelist
      let fields = document.querySelectorAll(
        `${DOMStrings.inputDescription}, ${DOMStrings.inputValue}`
      );

      // Листийг массив руу хөрвүүлэх
      let fieldsArr = Array.prototype.slice.call(fields);
      console.log(fieldsArr);

      fieldsArr.forEach(function (el) {
        el.value = "";
      });
      console.log(fieldsArr);
      fieldsArr[0].focus();
    },

    addListItem: function (type, item) {
      let html, list;
      if (type === "inc") {
        list = DOMStrings.incomeList;
        html = `<div class="item clearfix" id="inc-$$ID$$">
            <div class="item__description">$$DESC$$</div>
            <div class="right clearfix">
                <div class="item__value">$$VAL$$</div>
                <div class="item__delete">
                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                </div>
            </div>
        </div>`;
      } else {
        list = DOMStrings.expenseList;
        html = `<div class="item clearfix" id="exp-$$ID$$">
          <div class="item__description">$$DESC$$</div>
          <div class="right clearfix">
            <div class="item__value">$$VAL$$</div>
            <div class="item__percentage">21%</div>
            <div class="item__delete">
              <button class="item__delete--btn">
                <i class="ion-ios-close-outline"></i>
              </button>
            </div>
          </div>
        </div>`;
      }
      html = html.replace("$$ID$$", item.id);
      html = html.replace("$$DESC$$", item.desc);
      html = html.replace("$$VAL$$", item.val);
      document.querySelector(list).insertAdjacentHTML("beforeend", html);
    },

    getInput: function () {
      return {
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.inputDescription).value,
        // parseInt---бүхэл тоо руу хөрвүүлэх

        value: document.querySelector(DOMStrings.inputValue).value,
      };
    },
    getPublicDOM: function () {
      return {
        addBtn: DOMStrings.addBtn,
      };
    },
  };
})();

// Санхүүтэй ажиллах контроллер
let financeController = (function () {
  let Income = function (id, desc, val) {
    this.id = id;
    this.desc = desc;
    // String to number;
    this.val = parseInt(val);
  };

  let Expense = function (id, desc, val) {
    this.id = id;
    this.desc = desc;
    // String to number;
    this.val = parseInt(val);
  };

  let calculateTotal = function (type) {
    let sum = 0;
    data.Items[type].forEach(function (el) {
      sum += el.val;
    });
    data.total[type] = sum;
  };

  let data = {
    Items: {
      inc: [],
      exp: [],
    },
    total: {
      inc: 0,
      exp: 0,
    },
    huvi: 0,
    tusuv: 0,
  };

  return {
    addItem: function (type, desc, val) {
      let id, item;
      if (data.Items[type].length === 0) id = 1;
      else {
        id = data.Items[type][data.Items[type].length - 1].id + 1;
      }
      item =
        type === "inc" ? new Income(id, desc, val) : new Expense(id, desc, val);
      data.Items[type].push(item);
      return item;
    },

    tusviigTootsooloh: function () {
      calculateTotal("inc");
      calculateTotal("exp");

      data.huvi = Math.round((data.total.exp / data.total.inc) * 100);
      data.tusuv = data.total.inc - data.total.exp;
    },

    getBudget: function () {
      return {
        totalInc: data.total.inc,
        totalExp: data.total.exp,
        tusuv: data.tusuv,
        huvi: data.huvi,
      };
    },

    seeData: function () {
      return data;
    },
  };
})();

// Холбогч контроллер, Хоёр контроллерыг хооронд нь холбох үүрэгтэй
let appController = (function (uiCtrl, fnCtrl) {
  let ctrlAddItem = function () {
    // 1. Дэлгэцнээс өгөгдлүүдийг авна.
    let input = uiCtrl.getInput();
    console.log(input.description === "");
    console.log(typeof input.value);
    if (input.description !== "" && input.value !== "") {
      // 2. Санхүүгийн модульд дамжуулаад тэнд хадгална
      item = fnCtrl.addItem(input.type, input.description, input.value);

      // 3. Орлого зарлагийн тохирох хэсэгт дэлгэцэнд үзүүлнэ
      uiCtrl.addListItem(input.type, item);
      uiCtrl.clearFields();
      // 4. Төсвийг тооцоолно
      fnCtrl.tusviigTootsooloh();
      // 5. Үлдэгдлийг тооцоолно
      let budget = fnCtrl.getBudget();
      // 6. Дэлгэцэнд үлдэгдлийг харуулна};
      console.log(budget);
    }
  };

  let setupEventListeners = function () {
    // Дэлгэцний DOM
    let DOM = uiCtrl.getPublicDOM();
    // Correct товчин дээр дарахад үүсэх эвент листенер
    document.querySelector(DOM.addBtn).addEventListener("click", function () {
      ctrlAddItem();
    });

    // Enter дарахад үүсэх эвент листенер
    document.addEventListener("keypress", function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };

  return {
    init: function () {
      console.log("Application started...");
      setupEventListeners();
    },
  };
})(uiController, financeController);

appController.init();
