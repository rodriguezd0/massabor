(function () {
  var store = window.MSStore;
  if (!store) {
    return;
  }

  var page = (document.body && document.body.getAttribute("data-admin-page")) || "home";
  var state = store.getDefaultData();
  var rerenderCurrentPage = function () {};

  var toastTimer = null;
  var saveButton = document.getElementById("save-button");
  var resetButton = document.getElementById("reset-button");

  var SOCIAL_TYPES = [
    { key: "instagram", label: "Instagram", icon: "fab fa-instagram", defaultUrl: "https://instagram.com/" },
    { key: "facebook", label: "Facebook", icon: "fab fa-facebook-f", defaultUrl: "https://facebook.com/" },
    { key: "whatsapp", label: "WhatsApp", icon: "fab fa-whatsapp", defaultUrl: "https://wa.me/" },
    { key: "tiktok", label: "TikTok", icon: "fab fa-tiktok", defaultUrl: "https://www.tiktok.com/@" },
    { key: "youtube", label: "YouTube", icon: "fab fa-youtube", defaultUrl: "https://youtube.com/" },
    { key: "x", label: "X / Twitter", icon: "fab fa-twitter", defaultUrl: "https://x.com/" },
    { key: "telegram", label: "Telegram", icon: "fab fa-telegram-plane", defaultUrl: "https://t.me/" },
    { key: "sitio", label: "Sitio web", icon: "fas fa-globe", defaultUrl: "https://" }
  ];

  var PRODUCT_ICON_OPTIONS = [
    { value: "fas fa-coffee", label: "Cafe" },
    { value: "fas fa-mug-hot", label: "Taza caliente" },
    { value: "fas fa-glass-water", label: "Bebidas" },
    { value: "fas fa-cookie-bite", label: "Galletas" },
    { value: "fas fa-bread-slice", label: "Panificados" },
    { value: "fas fa-birthday-cake", label: "Tortas" },
    { value: "fas fa-ice-cream", label: "Helados" },
    { value: "fas fa-cheese", label: "Quesos" },
    { value: "fas fa-pizza-slice", label: "Pizza" },
    { value: "fas fa-utensils", label: "Cubiertos" }
  ];

  var PROMO_ICON_OPTIONS = [
    { value: "fas fa-mug-hot", label: "Taza caliente" },
    { value: "fas fa-coffee", label: "Cafe" },
    { value: "fas fa-cookie", label: "Cookie" },
    { value: "fas fa-bread-slice", label: "Pan" },
    { value: "fas fa-birthday-cake", label: "Torta" },
    { value: "fas fa-ice-cream", label: "Helado" },
    { value: "fas fa-cheese", label: "Queso" },
    { value: "fas fa-pizza-slice", label: "Pizza" },
    { value: "fas fa-utensils", label: "Comida" },
    { value: "fas fa-star", label: "Estrella" }
  ];

  function setActiveNav() {
    var links = document.querySelectorAll("[data-nav]");
    for (var i = 0; i < links.length; i += 1) {
      var link = links[i];
      var navPage = link.getAttribute("data-nav");
      if (navPage === page) {
        link.classList.add("bg-ms-dark", "text-white", "border-ms-dark");
        link.classList.remove("bg-white");
      } else {
        link.classList.remove("bg-ms-dark", "text-white", "border-ms-dark");
      }
    }
  }

  function getToastNode() {
    var existing = document.getElementById("admin-toast");
    if (existing) {
      return existing;
    }

    var toast = document.createElement("div");
    toast.id = "admin-toast";
    toast.className =
      "fixed top-4 right-4 z-50 hidden min-w-[240px] max-w-[340px] rounded-lg px-4 py-3 text-sm font-semibold shadow-lg border";
    document.body.appendChild(toast);
    return toast;
  }

  function showStatus(message, level) {
    var toast = getToastNode();
    toast.textContent = message;
    toast.classList.remove(
      "hidden",
      "bg-red-100",
      "text-red-700",
      "border-red-200",
      "bg-green-100",
      "text-green-700",
      "border-green-200",
      "bg-yellow-100",
      "text-yellow-700",
      "border-yellow-200"
    );

    if (level === "error") {
      toast.classList.add("bg-red-100", "text-red-700", "border-red-200");
    } else if (level === "warn") {
      toast.classList.add("bg-yellow-100", "text-yellow-700", "border-yellow-200");
    } else {
      toast.classList.add("bg-green-100", "text-green-700", "border-green-200");
    }

    if (toastTimer) {
      window.clearTimeout(toastTimer);
    }

    toastTimer = window.setTimeout(function () {
      toast.classList.add("hidden");
    }, 2600);
  }

  function hideStatus() {
    var toast = document.getElementById("admin-toast");
    if (!toast) {
      return;
    }
    toast.classList.add("hidden");
  }

  function makeFieldLabel(text) {
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

  function getOptionByValue(options, value) {
    for (var i = 0; i < options.length; i += 1) {
      if (options[i].value === value) {
        return options[i];
      }
    }
    return options[0];
  }

  function createIconPicker(options, currentValue, onChange) {
    var wrapper = document.createElement("div");
    wrapper.className = "space-y-1";

    var select = document.createElement("select");
    select.className = "w-full rounded-lg border border-ms-card bg-white px-3 py-2 text-sm focus:border-ms-dark focus:outline-none";

    for (var i = 0; i < options.length; i += 1) {
      var option = document.createElement("option");
      option.value = options[i].value;
      option.textContent = options[i].label;
      if (options[i].value === currentValue) {
        option.selected = true;
      }
      select.appendChild(option);
    }

    var preview = document.createElement("div");
    preview.className = "flex items-center gap-2 text-sm text-ms-dark";

    var icon = document.createElement("i");
    var text = document.createElement("span");

    function refreshPreview() {
      var selected = getOptionByValue(options, select.value);
      icon.className = selected.value;
      text.textContent = selected.label;
    }

    select.addEventListener("change", function () {
      onChange(select.value);
      refreshPreview();
      hideStatus();
    });

    preview.appendChild(icon);
    preview.appendChild(text);

    wrapper.appendChild(select);
    wrapper.appendChild(preview);

    refreshPreview();
    return wrapper;
  }

  function getSocialTypeByKey(key) {
    for (var i = 0; i < SOCIAL_TYPES.length; i += 1) {
      if (SOCIAL_TYPES[i].key === key) {
        return SOCIAL_TYPES[i];
      }
    }
    return SOCIAL_TYPES[SOCIAL_TYPES.length - 1];
  }

  function detectSocialType(entry) {
    var source = ((entry.label || "") + " " + (entry.icon || "") + " " + (entry.url || "")).toLowerCase();

    if (source.indexOf("instagram") >= 0) {
      return "instagram";
    }
    if (source.indexOf("facebook") >= 0) {
      return "facebook";
    }
    if (source.indexOf("whatsapp") >= 0 || source.indexOf("wa.me") >= 0) {
      return "whatsapp";
    }
    if (source.indexOf("tiktok") >= 0) {
      return "tiktok";
    }
    if (source.indexOf("youtube") >= 0) {
      return "youtube";
    }
    if (source.indexOf("twitter") >= 0 || source.indexOf("x.com") >= 0) {
      return "x";
    }
    if (source.indexOf("telegram") >= 0 || source.indexOf("t.me") >= 0) {
      return "telegram";
    }

    return "sitio";
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

  function saveChanges() {
    state = store.saveData(state);
    showStatus("Cambios guardados correctamente.", "ok");
  }

  function resetChanges() {
    store.resetData();

    fetchPublishedData()
      .catch(function () {
        return store.getDefaultData();
      })
      .then(function (freshState) {
        state = freshState;
        rerenderCurrentPage();
        showStatus("Cambios descartados.", "warn");
      });
  }

  function bindGlobalActions() {
    if (saveButton) {
      saveButton.addEventListener("click", saveChanges);
    }

    if (resetButton) {
      resetButton.addEventListener("click", resetChanges);
    }
  }

  function initHomePage() {
    function renderHome() {
      var categoriesCount = Array.isArray(state.categories) ? state.categories.length : 0;
      var promotionsCount = Array.isArray(state.promotions) ? state.promotions.length : 0;
      var socialsCount = Array.isArray(state.socials) ? state.socials.length : 0;
      var productsCount = 0;

      if (Array.isArray(state.categories)) {
        for (var i = 0; i < state.categories.length; i += 1) {
          var items = state.categories[i].items;
          productsCount += Array.isArray(items) ? items.length : 0;
        }
      }

      var businessName = document.getElementById("home-business-name");
      var categoriesNode = document.getElementById("home-categories-count");
      var productsNode = document.getElementById("home-products-count");
      var promotionsNode = document.getElementById("home-promotions-count");
      var socialsNode = document.getElementById("home-socials-count");

      if (businessName) {
        businessName.textContent = state.business && state.business.name ? state.business.name : "-";
      }
      if (categoriesNode) {
        categoriesNode.textContent = String(categoriesCount);
      }
      if (productsNode) {
        productsNode.textContent = String(productsCount);
      }
      if (promotionsNode) {
        promotionsNode.textContent = String(promotionsCount);
      }
      if (socialsNode) {
        socialsNode.textContent = String(socialsCount);
      }
    }

    rerenderCurrentPage = renderHome;
    renderHome();
  }

  function initBusinessPage() {
    var fields = [
      { id: "business-name", key: "name" },
      { id: "business-subtitle", key: "subtitle" },
      { id: "business-logo", key: "logoPath" },
      { id: "business-phone", key: "phoneDisplay" },
      { id: "business-whatsapp", key: "whatsappNumber" },
      { id: "business-footer", key: "footerNote" }
    ];

    function renderBusiness() {
      for (var i = 0; i < fields.length; i += 1) {
        var input = document.getElementById(fields[i].id);
        if (input) {
          input.value = state.business[fields[i].key] || "";
        }
      }
    }

    for (var j = 0; j < fields.length; j += 1) {
      (function (field) {
        var input = document.getElementById(field.id);
        if (!input) {
          return;
        }

        input.addEventListener("input", function () {
          state.business[field.key] = input.value;
          hideStatus();
        });
      })(fields[j]);
    }

    rerenderCurrentPage = renderBusiness;
    renderBusiness();
  }

  function initSocialsPage() {
    var list = document.getElementById("socials-list");
    var addButton = document.getElementById("add-social-button");

    if (!list) {
      return;
    }

    function renderSocials() {
      list.innerHTML = "";

      for (var i = 0; i < state.socials.length; i += 1) {
        (function (index) {
          var social = state.socials[index];
          var row = document.createElement("div");
          row.className = "rounded-xl border border-ms-card bg-ms-light/60 p-4 space-y-3";

          var top = document.createElement("div");
          top.className = "flex items-center justify-between gap-3";

          var preview = document.createElement("div");
          preview.className = "flex items-center gap-2 text-ms-dark font-semibold";

          var previewIcon = document.createElement("i");
          var previewLabel = document.createElement("span");

          preview.appendChild(previewIcon);
          preview.appendChild(previewLabel);

          var removeButton = makeButton("Quitar", "rounded-lg bg-red-500 text-white px-3 py-2 text-sm hover:bg-red-600");
          removeButton.addEventListener("click", function () {
            state.socials.splice(index, 1);
            renderSocials();
            hideStatus();
          });

          top.appendChild(preview);
          top.appendChild(removeButton);

          var grid = document.createElement("div");
          grid.className = "grid gap-3 md:grid-cols-2";

          var typeLabel = makeFieldLabel("Red social");
          var typeSelect = document.createElement("select");
          typeSelect.className = "w-full rounded-lg border border-ms-card bg-white px-3 py-2 text-sm focus:border-ms-dark focus:outline-none";

          for (var j = 0; j < SOCIAL_TYPES.length; j += 1) {
            var option = document.createElement("option");
            option.value = SOCIAL_TYPES[j].key;
            option.textContent = SOCIAL_TYPES[j].label;
            typeSelect.appendChild(option);
          }

          var detectedType = detectSocialType(social);
          typeSelect.value = detectedType;

          var urlLabel = makeFieldLabel("Enlace");
          var urlInput = makeInput(social.url, "https://...");

          function updatePreview() {
            var selectedType = getSocialTypeByKey(typeSelect.value);
            previewIcon.className = selectedType.icon;
            previewLabel.textContent = selectedType.label;
          }

          typeSelect.addEventListener("change", function () {
            var selectedType = getSocialTypeByKey(typeSelect.value);
            social.label = selectedType.label;
            social.icon = selectedType.icon;

            if (!urlInput.value || urlInput.value === "#") {
              urlInput.value = selectedType.defaultUrl;
              social.url = selectedType.defaultUrl;
            }

            updatePreview();
            hideStatus();
          });

          urlInput.addEventListener("input", function () {
            social.url = urlInput.value;
            hideStatus();
          });

          typeLabel.appendChild(typeSelect);
          urlLabel.appendChild(urlInput);

          grid.appendChild(typeLabel);
          grid.appendChild(urlLabel);

          row.appendChild(top);
          row.appendChild(grid);

          list.appendChild(row);
          updatePreview();
        })(i);
      }
    }

    if (addButton) {
      addButton.addEventListener("click", function () {
        var defaultType = getSocialTypeByKey("instagram");
        state.socials.push({
          label: defaultType.label,
          icon: defaultType.icon,
          url: defaultType.defaultUrl
        });
        renderSocials();
        hideStatus();
      });
    }

    rerenderCurrentPage = renderSocials;
    renderSocials();
  }

  function initPromotionsPage() {
    var list = document.getElementById("promotions-list");
    var addButton = document.getElementById("add-promotion-button");

    if (!list) {
      return;
    }

    function renderPromotions() {
      list.innerHTML = "";

      for (var i = 0; i < state.promotions.length; i += 1) {
        (function (index) {
          var promo = state.promotions[index];
          var card = document.createElement("div");
          card.className = "rounded-xl border border-ms-card bg-ms-light/60 p-4 space-y-3";

          var titleRow = document.createElement("div");
          titleRow.className = "flex items-center justify-between gap-3";

          var title = document.createElement("h3");
          title.className = "font-semibold text-ms-dark";
          title.textContent = "Promocion " + String(index + 1);

          var removeButton = makeButton("Quitar", "rounded-lg bg-red-500 text-white px-3 py-2 text-sm hover:bg-red-600");
          removeButton.addEventListener("click", function () {
            state.promotions.splice(index, 1);
            renderPromotions();
            hideStatus();
          });

          titleRow.appendChild(title);
          titleRow.appendChild(removeButton);

          var grid = document.createElement("div");
          grid.className = "grid gap-3 lg:grid-cols-2";

          var titleLabel = makeFieldLabel("Titulo");
          var titleInput = makeInput(promo.title, "Cafe + Medialunas");
          titleInput.addEventListener("input", function () {
            promo.title = titleInput.value;
            hideStatus();
          });
          titleLabel.appendChild(titleInput);

          var priceLabel = makeFieldLabel("Precio");
          var priceInput = makeInput(String(promo.price || 0), "5000", "number");
          priceInput.min = "0";
          priceInput.step = "100";
          priceInput.addEventListener("input", function () {
            promo.price = Number(priceInput.value || 0);
            hideStatus();
          });
          priceLabel.appendChild(priceInput);

          var leftIconLabel = makeFieldLabel("Icono izquierda");
          leftIconLabel.appendChild(
            createIconPicker(PROMO_ICON_OPTIONS, promo.iconLeft, function (value) {
              promo.iconLeft = value;
            })
          );

          var rightIconLabel = makeFieldLabel("Icono derecha");
          rightIconLabel.appendChild(
            createIconPicker(PROMO_ICON_OPTIONS, promo.iconRight, function (value) {
              promo.iconRight = value;
            })
          );

          grid.appendChild(titleLabel);
          grid.appendChild(priceLabel);
          grid.appendChild(leftIconLabel);
          grid.appendChild(rightIconLabel);

          card.appendChild(titleRow);
          card.appendChild(grid);
          list.appendChild(card);
        })(i);
      }
    }

    if (addButton) {
      addButton.addEventListener("click", function () {
        state.promotions.push({
          title: "Nueva promocion",
          price: 0,
          iconLeft: "fas fa-mug-hot",
          iconRight: "fas fa-cookie"
        });
        renderPromotions();
        hideStatus();
      });
    }

    rerenderCurrentPage = renderPromotions;
    renderPromotions();
  }

  function initProductsPage() {
    var list = document.getElementById("categories-list");
    var addButton = document.getElementById("add-category-button");

    if (!list) {
      return;
    }

    function renderCategories() {
      list.innerHTML = "";

      for (var i = 0; i < state.categories.length; i += 1) {
        (function (categoryIndex) {
          var category = state.categories[categoryIndex];
          var card = document.createElement("div");
          card.className = "bg-white border-2 border-ms-card rounded-xl p-4 space-y-3";

          var header = document.createElement("div");
          header.className = "flex items-center justify-between gap-3";

          var headerTitle = document.createElement("h3");
          headerTitle.className = "font-bold text-ms-dark";
          headerTitle.textContent = "Categoria " + String(categoryIndex + 1);

          var removeCategoryButton = makeButton("Quitar categoria", "rounded-lg bg-red-500 text-white px-3 py-2 text-sm hover:bg-red-600");
          removeCategoryButton.addEventListener("click", function () {
            state.categories.splice(categoryIndex, 1);
            renderCategories();
            hideStatus();
          });

          header.appendChild(headerTitle);
          header.appendChild(removeCategoryButton);

          var topGrid = document.createElement("div");
          topGrid.className = "grid gap-3 md:grid-cols-3";

          var nameLabel = makeFieldLabel("Nombre de categoria");
          var nameInput = makeInput(category.title, "Bebidas");
          nameInput.addEventListener("input", function () {
            category.title = nameInput.value;
            hideStatus();
          });
          nameLabel.appendChild(nameInput);

          var iconLabel = makeFieldLabel("Icono de categoria");
          iconLabel.appendChild(
            createIconPicker(PRODUCT_ICON_OPTIONS, category.icon, function (value) {
              category.icon = value;
            })
          );

          var colorLabel = makeFieldLabel("Color del borde");
          var colorSelect = document.createElement("select");
          colorSelect.className = "w-full rounded-lg border border-ms-card bg-white px-3 py-2 text-sm focus:border-ms-dark focus:outline-none";

          var colorOptions = [
            { value: "dark", label: "Verde fuerte" },
            { value: "accent", label: "Verde medio" },
            { value: "card", label: "Verde suave" }
          ];

          for (var j = 0; j < colorOptions.length; j += 1) {
            var colorOption = document.createElement("option");
            colorOption.value = colorOptions[j].value;
            colorOption.textContent = colorOptions[j].label;
            if (category.color === colorOptions[j].value) {
              colorOption.selected = true;
            }
            colorSelect.appendChild(colorOption);
          }

          colorSelect.addEventListener("change", function () {
            category.color = colorSelect.value;
            hideStatus();
          });

          colorLabel.appendChild(colorSelect);

          topGrid.appendChild(nameLabel);
          topGrid.appendChild(iconLabel);
          topGrid.appendChild(colorLabel);

          var productsTitle = document.createElement("p");
          productsTitle.className = "text-sm font-semibold text-ms-dark";
          productsTitle.textContent = "Productos";

          var productsWrap = document.createElement("div");
          productsWrap.className = "space-y-2";

          for (var k = 0; k < category.items.length; k += 1) {
            (function (itemIndex) {
              var item = category.items[itemIndex];
              var itemRow = document.createElement("div");
              itemRow.className = "grid gap-2 md:grid-cols-[2fr_2fr_130px_auto] items-end bg-ms-light/60 border border-ms-card rounded-lg p-3";

              var itemNameLabel = makeFieldLabel("Nombre");
              var itemNameInput = makeInput(item.name, "Cafe");
              itemNameInput.addEventListener("input", function () {
                item.name = itemNameInput.value;
                hideStatus();
              });
              itemNameLabel.appendChild(itemNameInput);

              var itemDescLabel = makeFieldLabel("Descripcion");
              var itemDescInput = makeInput(item.description, "Opcional");
              itemDescInput.addEventListener("input", function () {
                item.description = itemDescInput.value;
                hideStatus();
              });
              itemDescLabel.appendChild(itemDescInput);

              var itemPriceLabel = makeFieldLabel("Precio");
              var itemPriceInput = makeInput(String(item.price || 0), "3500", "number");
              itemPriceInput.min = "0";
              itemPriceInput.step = "100";
              itemPriceInput.addEventListener("input", function () {
                item.price = Number(itemPriceInput.value || 0);
                hideStatus();
              });
              itemPriceLabel.appendChild(itemPriceInput);

              var removeItemButton = makeButton("Quitar", "rounded-lg bg-red-500 text-white px-3 py-2 text-sm hover:bg-red-600");
              removeItemButton.addEventListener("click", function () {
                category.items.splice(itemIndex, 1);
                renderCategories();
                hideStatus();
              });

              itemRow.appendChild(itemNameLabel);
              itemRow.appendChild(itemDescLabel);
              itemRow.appendChild(itemPriceLabel);
              itemRow.appendChild(removeItemButton);

              productsWrap.appendChild(itemRow);
            })(k);
          }

          var addProductButton = makeButton("Agregar producto", "rounded-lg bg-ms-dark text-white px-3 py-2 text-sm hover:bg-ms-accent");
          addProductButton.addEventListener("click", function () {
            category.items.push({ name: "Nuevo producto", description: "", price: 0 });
            renderCategories();
            hideStatus();
          });

          card.appendChild(header);
          card.appendChild(topGrid);
          card.appendChild(productsTitle);
          card.appendChild(productsWrap);
          card.appendChild(addProductButton);

          list.appendChild(card);
        })(i);
      }
    }

    if (addButton) {
      addButton.addEventListener("click", function () {
        state.categories.push({
          title: "Nueva categoria",
          icon: "fas fa-utensils",
          color: "dark",
          items: [{ name: "Nuevo producto", description: "", price: 0 }]
        });
        renderCategories();
        hideStatus();
      });
    }

    rerenderCurrentPage = renderCategories;
    renderCategories();
  }

  function initCurrentPage() {
    if (page === "home") {
      initHomePage();
      return;
    }

    if (page === "datos") {
      initBusinessPage();
      return;
    }

    if (page === "redes") {
      initSocialsPage();
      return;
    }

    if (page === "promociones") {
      initPromotionsPage();
      return;
    }

    if (page === "productos") {
      initProductsPage();
      return;
    }
  }

  setActiveNav();
  bindGlobalActions();

  loadInitialData()
    .then(function (initialState) {
      state = initialState;
      initCurrentPage();
    })
    .catch(function () {
      state = store.getDefaultData();
      initCurrentPage();
      showStatus("No se pudo cargar la informacion publicada.", "warn");
    });
})();
