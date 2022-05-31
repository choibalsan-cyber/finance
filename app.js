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
    expPercentage: ".item__percentage",
    dateMonth: ".budget__title--month",
  };

  let nodeListForEach = function (list, callback) {
    for (let i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };

  let formatMoney = function (num, type) {
    num += "";
    let a = num.split("").reverse().join("");
    let b = "";
    let count = 1;
    for (let i = 0; i < a.length; i++) {
      b += a[i];
      if (count % 3 === 0) {
        b += ",";
      }
      count++;
    }
    b = b.split("").reverse().join("");
    if (b[0] === ",") b = b.substr(1, b.length - 1);
    b = type === "inc" ? "+ " + b : "- " + b;

    return b;
  };

  return {
    displayDate: function () {
      document.querySelector(DOMStrings.dateMonth).textContent =
        new Date().getMonth() + 1 + "-р сар";
    },
    displayPercentages: function (allPercentages) {
      let elements = document.querySelectorAll(DOMStrings.expPercentage);
      nodeListForEach(elements, function (el, index) {
        el.textContent = `${allPercentages[index]}%`;
      });
    },

    displayDelete: function (id) {
      let el = document.getElementById(id);
      el.parentNode.removeChild(el);
    },

    showBudget: function (budget) {
      let type = budget.tusuv > 0 ? "inc" : "exp";
      if (budget.tusuv <= 0) {
        document.querySelector(DOMStrings.budgetValue).textContent =
          budget.tusuv;
      } else {
        document.querySelector(DOMStrings.budgetValue).textContent =
          formatMoney(budget.tusuv, type);
      }
      if (budget.totalInc === 0) {
        document.querySelector(DOMStrings.totalInc).textContent =
          budget.totalInc;
      } else {
        document.querySelector(DOMStrings.totalInc).textContent = formatMoney(
          budget.totalInc,
          type
        );
      }
      if (budget.totalExp === 0) {
        document.querySelector(DOMStrings.totalExp).textContent =
          budget.totalExp;
      } else {
        document.querySelector(DOMStrings.totalExp).textContent = formatMoney(
          budget.totalExp,
          type
        );
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
      html = html.replace("$$VAL$$", formatMoney(item.val, type));
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
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function (totalIncome) {
    if (totalIncome > 0)
      this.percentage = Math.round((this.val / totalIncome) * 100);
    else totalIncome = 0;
  };

  Expense.prototype.getPercentage = function () {
    return this.percentage;
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
    calcPercentages: function () {
      data.Items.exp.forEach(function (el) {
        el.calcPercentage(data.total.inc);
      });
    },

    getPercentages: function () {
      allPercentages = data.Items.exp.map(function (el) {
        return el.getPercentage();
      });
      return allPercentages;
    },

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
    // 7. Зарлагийн хувийг тооцоолох
    fnCtrl.calcPercentages();
    // 8. Хувийг хүлээж авна
    let allPercentages = fnCtrl.getPercentages();
    // Дэлгэцэнд харуулна
    uiCtrl.displayPercentages(allPercentages);
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
      uiCtrl.displayDate();
      setupEventListeners();
    },
  };
})(uiController, financeController);

appController.init();
