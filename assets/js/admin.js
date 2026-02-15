(function () {
  var store = window.MSStore;
  if (!store) {
    return;
  }

  var state = store.getDefaultData();

  var saveButton = document.getElementById("save-button");
  var exportButton = document.getElementById("export-button");
  var importButton = document.getElementById("import-button");
  var importInput = document.getElementById("import-input");
  var resetButton = document.getElementById("reset-button");
  var statusBox = document.getElementById("status-box");

  var socialsList = document.getElementById("socials-list");
  var promotionsList = document.getElementById("promotions-list");
  var categoriesList = document.getElementById("categories-list");

  var addSocialButton = document.getElementById("add-social-button");
  var addPromotionButton = document.getElementById("add-promotion-button");
  var addCategoryButton = document.getElementById("add-category-button");

  var generalFields = [
    { id: "business-name", key: "name" },
    { id: "business-subtitle", key: "subtitle" },
    { id: "business-logo", key: "logoPath" },
    { id: "business-phone", key: "phoneDisplay" },
    { id: "business-whatsapp", key: "whatsappNumber" },
    { id: "business-footer", key: "footerNote" }
  ];

  function showStatus(message, level) {
    statusBox.textContent = message;
    statusBox.classList.remove("hidden", "bg-red-100", "text-red-700", "bg-green-100", "text-green-700", "bg-yellow-100", "text-yellow-700");

    if (level === "error") {
      statusBox.classList.add("bg-red-100", "text-red-700");
      return;
    }

    if (level === "warn") {
      statusBox.classList.add("bg-yellow-100", "text-yellow-700");
      return;
    }

    statusBox.classList.add("bg-green-100", "text-green-700");
  }

  function hideStatus() {
    statusBox.classList.add("hidden");
  }

  function makeLabel(text) {
    var label = document.createElement("label");
    label.className = "block";

    var span = document.createElement("span");
    span.className = "text-sm font-semibold text-gray-700 mb-1 block";
    span.textContent = text;

    label.appendChild(span);
    return label;
  }

  function makeInput(value, placeholder, type) {
    var input = document.createElement("input");
    input.type = type || "text";
    input.className = "w-full rounded-lg border border-ms-card bg-white px-3 py-2 text-sm focus:border-ms-dark focus:outline-none";
    input.value = value || "";
    input.placeholder = placeholder || "";
    return input;
  }

  function makeButton(text, classes) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = classes;
    button.textContent = text;
    return button;
  }

  function fetchPublishedData() {
    return window
      .fetch("../data/site-data.json", { cache: "no-store" })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("No se pudo cargar ../data/site-data.json");
        }
        return response.json();
      })
      .then(function (json) {
        return store.normalizeData(json);
      });
  }

  function loadInitialData() {
    if (store.hasSavedData()) {
      return Promise.resolve(store.loadData());
    }

    return fetchPublishedData().catch(function () {
      return store.getDefaultData();
    });
  }

  function setGeneralFields() {
    generalFields.forEach(function (entry) {
      var input = document.getElementById(entry.id);
      if (!input) {
        return;
      }
      input.value = state.business[entry.key] || "";
    });
  }

  function bindGeneralFields() {
    generalFields.forEach(function (entry) {
      var input = document.getElementById(entry.id);
      if (!input) {
        return;
      }

      input.addEventListener("input", function () {
        state.business[entry.key] = input.value;
        hideStatus();
      });
    });
  }

  function renderSocials() {
    socialsList.innerHTML = "";

    state.socials.forEach(function (social, index) {
      var row = document.createElement("div");
      row.className = "grid gap-2 md:grid-cols-[1fr_1fr_2fr_auto] items-end bg-ms-light/70 border border-ms-card rounded-lg p-3";

      var labelWrap = makeLabel("Nombre");
      var labelInput = makeInput(social.label, "Instagram");
      labelInput.addEventListener("input", function () {
        state.socials[index].label = labelInput.value;
      });
      labelWrap.appendChild(labelInput);

      var iconWrap = makeLabel("Icono (FontAwesome)");
      var iconInput = makeInput(social.icon, "fab fa-instagram");
      iconInput.addEventListener("input", function () {
        state.socials[index].icon = iconInput.value;
      });
      iconWrap.appendChild(iconInput);

      var urlWrap = makeLabel("URL");
      var urlInput = makeInput(social.url, "https://...");
      urlInput.addEventListener("input", function () {
        state.socials[index].url = urlInput.value;
      });
      urlWrap.appendChild(urlInput);

      var removeButton = makeButton("Quitar", "rounded-lg bg-red-500 text-white px-3 py-2 text-sm hover:bg-red-600");
      removeButton.addEventListener("click", function () {
        state.socials.splice(index, 1);
        renderSocials();
      });

      row.appendChild(labelWrap);
      row.appendChild(iconWrap);
      row.appendChild(urlWrap);
      row.appendChild(removeButton);
      socialsList.appendChild(row);
    });
  }

  function renderPromotions() {
    promotionsList.innerHTML = "";

    state.promotions.forEach(function (promo, index) {
      var row = document.createElement("div");
      row.className = "grid gap-2 md:grid-cols-[2fr_120px_1fr_1fr_auto] items-end bg-ms-light/70 border border-ms-card rounded-lg p-3";

      var titleWrap = makeLabel("Titulo");
      var titleInput = makeInput(promo.title, "Cafe + Croissant");
      titleInput.addEventListener("input", function () {
        state.promotions[index].title = titleInput.value;
      });
      titleWrap.appendChild(titleInput);

      var priceWrap = makeLabel("Precio");
      var priceInput = makeInput(String(promo.price || 0), "5000", "number");
      priceInput.min = "0";
      priceInput.step = "100";
      priceInput.addEventListener("input", function () {
        state.promotions[index].price = Number(priceInput.value || 0);
      });
      priceWrap.appendChild(priceInput);

      var iconLeftWrap = makeLabel("Icono 1");
      var iconLeftInput = makeInput(promo.iconLeft, "fas fa-mug-hot");
      iconLeftInput.addEventListener("input", function () {
        state.promotions[index].iconLeft = iconLeftInput.value;
      });
      iconLeftWrap.appendChild(iconLeftInput);

      var iconRightWrap = makeLabel("Icono 2");
      var iconRightInput = makeInput(promo.iconRight, "fas fa-cookie");
      iconRightInput.addEventListener("input", function () {
        state.promotions[index].iconRight = iconRightInput.value;
      });
      iconRightWrap.appendChild(iconRightInput);

      var removeButton = makeButton("Quitar", "rounded-lg bg-red-500 text-white px-3 py-2 text-sm hover:bg-red-600");
      removeButton.addEventListener("click", function () {
        state.promotions.splice(index, 1);
        renderPromotions();
      });

      row.appendChild(titleWrap);
      row.appendChild(priceWrap);
      row.appendChild(iconLeftWrap);
      row.appendChild(iconRightWrap);
      row.appendChild(removeButton);
      promotionsList.appendChild(row);
    });
  }

  function renderCategories() {
    categoriesList.innerHTML = "";

    state.categories.forEach(function (category, categoryIndex) {
      var card = document.createElement("div");
      card.className = "bg-white border-2 border-ms-card rounded-xl p-4 space-y-3";

      var topGrid = document.createElement("div");
      topGrid.className = "grid gap-2 md:grid-cols-[2fr_1fr_1fr_auto] items-end";

      var titleWrap = makeLabel("Categoria");
      var titleInput = makeInput(category.title, "Bebidas");
      titleInput.addEventListener("input", function () {
        state.categories[categoryIndex].title = titleInput.value;
      });
      titleWrap.appendChild(titleInput);

      var iconWrap = makeLabel("Icono");
      var iconInput = makeInput(category.icon, "fas fa-coffee");
      iconInput.addEventListener("input", function () {
        state.categories[categoryIndex].icon = iconInput.value;
      });
      iconWrap.appendChild(iconInput);

      var colorWrap = makeLabel("Color borde");
      var colorSelect = document.createElement("select");
      colorSelect.className = "w-full rounded-lg border border-ms-card bg-white px-3 py-2 text-sm focus:border-ms-dark focus:outline-none";
      ["dark", "accent", "card"].forEach(function (color) {
        var option = document.createElement("option");
        option.value = color;
        option.textContent = color;
        if ((category.color || "") === color) {
          option.selected = true;
        }
        colorSelect.appendChild(option);
      });
      colorSelect.addEventListener("change", function () {
        state.categories[categoryIndex].color = colorSelect.value;
      });
      colorWrap.appendChild(colorSelect);

      var removeCategoryButton = makeButton("Quitar", "rounded-lg bg-red-500 text-white px-3 py-2 text-sm hover:bg-red-600");
      removeCategoryButton.addEventListener("click", function () {
        state.categories.splice(categoryIndex, 1);
        renderCategories();
      });

      topGrid.appendChild(titleWrap);
      topGrid.appendChild(iconWrap);
      topGrid.appendChild(colorWrap);
      topGrid.appendChild(removeCategoryButton);

      card.appendChild(topGrid);

      var productsTitle = document.createElement("p");
      productsTitle.className = "text-sm font-bold text-ms-dark";
      productsTitle.textContent = "Productos";
      card.appendChild(productsTitle);

      var productsWrap = document.createElement("div");
      productsWrap.className = "space-y-2";

      category.items.forEach(function (item, itemIndex) {
        var itemRow = document.createElement("div");
        itemRow.className = "grid gap-2 md:grid-cols-[2fr_2fr_120px_auto] items-end bg-ms-light/60 border border-ms-card rounded-lg p-3";

        var nameWrap = makeLabel("Nombre");
        var nameInput = makeInput(item.name, "Cafe");
        nameInput.addEventListener("input", function () {
          state.categories[categoryIndex].items[itemIndex].name = nameInput.value;
        });
        nameWrap.appendChild(nameInput);

        var descWrap = makeLabel("Descripcion");
        var descInput = makeInput(item.description, "Opcional");
        descInput.addEventListener("input", function () {
          state.categories[categoryIndex].items[itemIndex].description = descInput.value;
        });
        descWrap.appendChild(descInput);

        var priceWrap = makeLabel("Precio");
        var priceInput = makeInput(String(item.price || 0), "3500", "number");
        priceInput.min = "0";
        priceInput.step = "100";
        priceInput.addEventListener("input", function () {
          state.categories[categoryIndex].items[itemIndex].price = Number(priceInput.value || 0);
        });
        priceWrap.appendChild(priceInput);

        var removeProductButton = makeButton("Quitar", "rounded-lg bg-red-500 text-white px-3 py-2 text-sm hover:bg-red-600");
        removeProductButton.addEventListener("click", function () {
          state.categories[categoryIndex].items.splice(itemIndex, 1);
          renderCategories();
        });

        itemRow.appendChild(nameWrap);
        itemRow.appendChild(descWrap);
        itemRow.appendChild(priceWrap);
        itemRow.appendChild(removeProductButton);
        productsWrap.appendChild(itemRow);
      });

      var addProductButton = makeButton("Agregar producto", "rounded-lg bg-ms-dark text-white px-3 py-2 text-sm hover:bg-ms-accent");
      addProductButton.addEventListener("click", function () {
        state.categories[categoryIndex].items.push({ name: "Nuevo producto", description: "", price: 0 });
        renderCategories();
      });

      card.appendChild(productsWrap);
      card.appendChild(addProductButton);
      categoriesList.appendChild(card);
    });
  }

  function renderAll() {
    setGeneralFields();
    renderSocials();
    renderPromotions();
    renderCategories();
  }

  function downloadJsonFile(filename, content) {
    var blob = new Blob([content], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }

  addSocialButton.addEventListener("click", function () {
    state.socials.push({ label: "Nueva red", icon: "fas fa-link", url: "https://" });
    renderSocials();
    hideStatus();
  });

  addPromotionButton.addEventListener("click", function () {
    state.promotions.push({ title: "Nueva promo", price: 0, iconLeft: "fas fa-star", iconRight: "fas fa-star" });
    renderPromotions();
    hideStatus();
  });

  addCategoryButton.addEventListener("click", function () {
    state.categories.push({
      title: "Nueva categoria",
      icon: "fas fa-utensils",
      color: "dark",
      items: [{ name: "Nuevo producto", description: "", price: 0 }]
    });
    renderCategories();
    hideStatus();
  });

  saveButton.addEventListener("click", function () {
    state = store.saveData(state);
    showStatus("Borrador guardado en este navegador.", "ok");
  });

  exportButton.addEventListener("click", function () {
    var normalized = store.normalizeData(state);
    var payload = JSON.stringify(normalized, null, 2);
    downloadJsonFile("site-data.json", payload);
    showStatus("JSON exportado. Reemplaza data/site-data.json en el repo para publicar.", "warn");
  });

  importButton.addEventListener("click", function () {
    importInput.click();
  });

  importInput.addEventListener("change", function () {
    var file = importInput.files && importInput.files[0];
    if (!file) {
      return;
    }

    var reader = new FileReader();
    reader.onload = function () {
      try {
        var parsed = JSON.parse(String(reader.result || "{}"));
        state = store.normalizeData(parsed);
        renderAll();
        showStatus("JSON importado correctamente.", "ok");
      } catch (error) {
        showStatus("No se pudo leer el JSON.", "error");
      } finally {
        importInput.value = "";
      }
    };
    reader.readAsText(file, "utf-8");
  });

  resetButton.addEventListener("click", function () {
    var confirmed = window.confirm("Esto elimina el borrador local y vuelve a lo publicado. Continuar?");
    if (!confirmed) {
      return;
    }

    store.resetData();
    fetchPublishedData()
      .catch(function () {
        return store.getDefaultData();
      })
      .then(function (freshState) {
        state = freshState;
        renderAll();
        showStatus("Borrador local descartado. Estado restaurado desde lo publicado.", "warn");
      });
  });

  bindGeneralFields();

  loadInitialData()
    .then(function (initialState) {
      state = initialState;
      renderAll();
    })
    .catch(function () {
      state = store.getDefaultData();
      renderAll();
      showStatus("No se pudo cargar data publicada. Se uso config por defecto.", "warn");
    });
})();
