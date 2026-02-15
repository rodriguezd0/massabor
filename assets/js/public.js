(function () {
  var store = window.MSStore;
  if (!store) {
    return;
  }

  var BORDER_CLASS = {
    dark: "border-ms-dark",
    accent: "border-ms-accent",
    card: "border-ms-card"
  };

  function iconElement(iconClass, fallbackClass) {
    var icon = document.createElement("i");
    icon.className = iconClass && iconClass.trim() ? iconClass : fallbackClass;
    return icon;
  }

  function createPriceTag(value) {
    var price = document.createElement("span");
    price.className = "price-tag px-3 py-1 rounded-full text-sm";
    price.textContent = store.formatPrice(value);
    return price;
  }

  function setBusiness(data) {
    var logo = document.getElementById("brand-logo");
    var name = document.getElementById("brand-name");
    var subtitle = document.getElementById("brand-subtitle");
    var footerBrand = document.getElementById("footer-brand");

    if (logo) {
      logo.src = data.logoPath || "logo.png";
      logo.alt = "Logo " + (data.name || "Mas Sabor");
    }

    if (name) {
      name.textContent = data.name || "Mas Sabor";
    }

    if (subtitle) {
      subtitle.textContent = data.subtitle || "Cafeteria & Pasteleria Artesanal";
    }

    if (footerBrand) {
      footerBrand.textContent = data.name || "Mas Sabor";
    }

    var footerPhone = document.getElementById("footer-phone");
    if (footerPhone) {
      footerPhone.textContent = data.phoneDisplay || "-";
    }

    var phoneLink = document.getElementById("footer-phone-link");
    if (phoneLink) {
      var rawDigits = (data.phoneDisplay || "").replace(/\D/g, "");
      phoneLink.href = rawDigits ? "tel:+" + rawDigits : "#";
    }

    var footerNote = document.getElementById("footer-note");
    if (footerNote) {
      footerNote.textContent = data.footerNote || "";
    }
  }

  function renderPromotions(promotions) {
    var section = document.getElementById("promotions-section");
    var grid = document.getElementById("promotions-grid");
    if (!section || !grid) {
      return;
    }

    grid.innerHTML = "";
    if (!Array.isArray(promotions) || promotions.length === 0) {
      section.classList.add("hidden");
      return;
    }

    section.classList.remove("hidden");

    promotions.forEach(function (promo) {
      var card = document.createElement("div");
      card.className = "bg-ms-light rounded-xl p-4 text-center border border-ms-card card-hover flex flex-col justify-between";

      var top = document.createElement("div");

      var icons = document.createElement("div");
      icons.className = "text-3xl mb-2 text-ms-dark flex items-center justify-center gap-2";
      icons.appendChild(iconElement(promo.iconLeft, "fas fa-star"));

      var plus = document.createElement("span");
      plus.textContent = "+";
      icons.appendChild(plus);

      icons.appendChild(iconElement(promo.iconRight, "fas fa-star"));

      var title = document.createElement("h3");
      title.className = "font-bold text-lg text-gray-800";
      title.textContent = promo.title || "Promocion";

      top.appendChild(icons);
      top.appendChild(title);

      var price = document.createElement("p");
      price.className = "text-2xl font-brand font-bold text-ms-dark mt-2";
      price.textContent = store.formatPrice(promo.price);

      card.appendChild(top);
      card.appendChild(price);
      grid.appendChild(card);
    });
  }

  function renderCategories(categories) {
    var grid = document.getElementById("categories-grid");
    if (!grid) {
      return;
    }

    grid.innerHTML = "";

    if (!Array.isArray(categories) || categories.length === 0) {
      var empty = document.createElement("div");
      empty.className = "bg-white rounded-2xl shadow-md p-6 border-t-4 border-ms-card";
      empty.textContent = "No hay productos cargados.";
      grid.appendChild(empty);
      return;
    }

    categories.forEach(function (category, categoryIndex) {
      var section = document.createElement("section");
      var borderClass = BORDER_CLASS[category.color] || "border-ms-dark";
      var delay = categoryIndex % 2 === 0 ? "delay-200" : "delay-300";
      section.className = "bg-white rounded-2xl shadow-md p-6 animate-in " + delay + " border-t-4 " + borderClass;

      var header = document.createElement("div");
      header.className = "flex items-center mb-6 border-b border-ms-card pb-3";

      var iconWrap = document.createElement("div");
      iconWrap.className = "w-10 h-10 rounded-full bg-ms-bg flex items-center justify-center text-ms-dark mr-3";
      iconWrap.appendChild(iconElement(category.icon, "fas fa-utensils"));

      var title = document.createElement("h2");
      title.className = "text-2xl font-brand font-bold text-ms-dark";
      title.textContent = category.title || "Categoria";

      header.appendChild(iconWrap);
      header.appendChild(title);

      var list = document.createElement("ul");
      list.className = "space-y-4";

      (category.items || []).forEach(function (item) {
        var li = document.createElement("li");
        li.className = "block";

        var row = document.createElement("div");
        row.className = "flex items-baseline justify-between";

        var nameWrap = document.createElement("div");
        nameWrap.className = "flex flex-col";

        var name = document.createElement("span");
        name.className = "font-bold text-gray-700";
        name.textContent = item.name || "Producto";

        nameWrap.appendChild(name);

        if (item.description) {
          var description = document.createElement("span");
          description.className = "text-sm text-gray-500";
          description.textContent = item.description;
          nameWrap.appendChild(description);
        }

        var dashed = document.createElement("span");
        dashed.className = "dashed-line";

        row.appendChild(nameWrap);
        row.appendChild(dashed);
        row.appendChild(createPriceTag(item.price));

        li.appendChild(row);
        list.appendChild(li);
      });

      section.appendChild(header);
      section.appendChild(list);
      grid.appendChild(section);
    });
  }

  function renderSocials(socials, business) {
    var container = document.getElementById("footer-socials");
    if (!container) {
      return;
    }

    container.innerHTML = "";

    var validSocials = Array.isArray(socials) ? socials : [];
    validSocials.forEach(function (social) {
      var anchor = document.createElement("a");
      anchor.className = "w-8 h-8 rounded-full bg-ms-dark text-white flex items-center justify-center hover:bg-ms-accent transition";
      anchor.href = social.url || "#";
      anchor.title = social.label || "Red social";

      if (social.url && social.url.indexOf("http") === 0) {
        anchor.target = "_blank";
        anchor.rel = "noreferrer noopener";
      }

      anchor.appendChild(iconElement(social.icon, "fas fa-link"));
      container.appendChild(anchor);
    });

    var whatsappLink = document.getElementById("footer-whatsapp-link");
    if (whatsappLink) {
      var rawNumber = (business.whatsappNumber || "").replace(/\D/g, "");
      whatsappLink.href = rawNumber ? "https://wa.me/" + rawNumber : "#";
    }
  }

  function render(data) {
    setBusiness(data.business || {});
    renderPromotions(data.promotions || []);
    renderCategories(data.categories || []);
    renderSocials(data.socials || [], data.business || {});
  }

  function fetchPublishedData() {
    return window
      .fetch("data/site-data.json", { cache: "no-store" })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("No se pudo cargar data/site-data.json");
        }
        return response.json();
      })
      .then(function (json) {
        return store.normalizeData(json);
      });
  }

  function loadData() {
    if (store.hasSavedData()) {
      return Promise.resolve(store.loadData());
    }

    return fetchPublishedData().catch(function () {
      return store.getDefaultData();
    });
  }

  loadData().then(render);
})();
