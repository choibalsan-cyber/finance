// Дэлгэцтэй ажиллах контроллер
let uiController = (function () {
  let DOMStrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    incomeList: ".income__list",
    expenseList: ".expenses__list",
    budgetValue: ".budget__value",
    totalInc: ".budget__income--value",
    totalExp: ".budget__expenses--value",
    percentage: ".budget__expenses--percentage",
    addBtn: ".add__btn",
    container: ".container",
  };

  let nodeListForEach = function (nodeList, callback) {
    for (let i = 0; i < nodeList.length; i++) {
      callback(nodeList[i]);
    }
  };
  return {
    displayDelete: function (id) {
      let el = document.getElementById(id);
      el.parentNode.removeChild(el);
    },

    showBudget: function (budget) {
      if (budget.tusuv === 0) {
        document.querySelector(DOMStrings.budgetValue).textContent =
          budget.tusuv;
      } else {
        document.querySelector(
          DOMStrings.budgetValue
        ).textContent = `+ ${budget.tusuv}`;
      }
      if (budget.totalInc === 0) {
        document.querySelector(DOMStrings.totalInc).textContent =
          budget.totalInc;
      } else {
        document.querySelector(
          DOMStrings.totalInc
        ).textContent = `+ ${budget.totalInc}`;
      }
      if (budget.totalExp === 0) {
        document.querySelector(DOMStrings.totalExp).textContent =
          budget.totalExp;
      } else {
        document.querySelector(
          DOMStrings.totalExp
        ).textContent = `- ${budget.totalExp}`;
      }
      if (budget.huvi === 0) {
        document.querySelector(DOMStrings.percentage).textContent = budget.huvi;
      } else {
        document.querySelector(
          DOMStrings.percentage
        ).textContent = `${budget.huvi}%`;
      }
    },

    clearFields: function () {
      // Цэвэрлэх листүүд Nodelist
      let fields = document.querySelectorAll(
        `${DOMStrings.inputDescription}, ${DOMStrings.inputValue}`
      );

      // Листийг массив руу хөрвүүлэх
      let fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function (el) {
        el.value = "";
      });

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
        container: DOMStrings.container,
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
    deleteItem: function (type, id) {
      let ids = data.Items[type].map(function (el) {
        return el.id;
      });

      let index = ids.indexOf(id);
      data.Items[type].splice(index, 1);
    },

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

      if (data.total.exp === 0 || data.total.inc === 0) data.huvi = 0;
      else {
        data.huvi = Math.round((data.total.exp / data.total.inc) * 100);
      }
      data.tusuv = data.total.inc - data.total.exp;
    },

    getBudget: function () {
      return {
        tusuv: data.tusuv,
        totalInc: data.total.inc,
        totalExp: data.total.exp,
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

    if (input.description !== "" && input.value !== "") {
      // 2. Санхүүгийн модульд дамжуулаад тэнд хадгална
      item = fnCtrl.addItem(input.type, input.description, input.value);

      // 3. Орлого зарлагийн тохирох хэсэгт дэлгэцэнд үзүүлнэ
      uiCtrl.addListItem(input.type, item);
      uiCtrl.clearFields();
      update();
    }
  };

  let update = function () {
    // 4. Төсвийг тооцоолно
    fnCtrl.tusviigTootsooloh();
    // 5. Үлдэгдлийг тооцоолно
    let budget = fnCtrl.getBudget();
    // 6. Дэлгэцэнд үлдэгдлийг харуулна};
    uiCtrl.showBudget(budget);
  };

  let setupEventListeners = function () {
    let DOM = uiCtrl.getPublicDOM();
    // Delete
    document
      .querySelector(DOM.container)
      .addEventListener("click", function (event) {
        let nodeId =
          event.target.parentNode.parentNode.parentNode.parentNode.id;
        // nodeId дотор ямар нэгэн юм байвал true байхгүй бол false болгож хувиргана
        if (nodeId) {
          let arr = nodeId.split("-");
          let type = arr[0];
          // Convert String to Number;
          let id = parseInt(arr[1]);
          fnCtrl.deleteItem(type, id);
          uiCtrl.displayDelete(nodeId);
          update();
        }
      });
    // Дэлгэцний DOM
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
      uiCtrl.showBudget({
        tusuv: 0,
        totalInc: 0,
        totalExp: 0,
        huvi: 0,
      });
      setupEventListeners();
    },
  };
})(uiController, financeController);

appController.init();
