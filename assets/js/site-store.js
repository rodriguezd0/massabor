(function () {
  const STORAGE_KEY = "ms_site_data_v1";

  const DEFAULT_DATA = {
    business: {
      name: "Mas Sabor",
      subtitle: "Cafeteria & Pasteleria Artesanal",
      logoPath: "logo.png",
      phoneDisplay: "221 556 9289",
      whatsappNumber: "5492215569289",
      footerNote: "Esperamos verte pronto!"
    },
    promotions: [
      {
        title: "Cafe + Petit Four",
        price: 5000,
        iconLeft: "fas fa-mug-hot",
        iconRight: "fas fa-cookie"
      },
      {
        title: "Cafe + 2 Medialunas",
        price: 5000,
        iconLeft: "fas fa-mug-hot",
        iconRight: "fas fa-bread-slice"
      },
      {
        title: "Torta + Cafe",
        price: 9000,
        iconLeft: "fas fa-birthday-cake",
        iconRight: "fas fa-mug-hot"
      }
    ],
    categories: [
      {
        title: "Cafeteria",
        icon: "fas fa-coffee",
        color: "dark",
        items: [
          { name: "Cafe", description: "", price: 3500 },
          { name: "Cafe con leche", description: "", price: 4000 },
          { name: "Lagrima", description: "", price: 4000 },
          { name: "Ice Latte", description: "", price: 5000 }
        ]
      },
      {
        title: "Bebidas",
        icon: "fas fa-glass-water",
        color: "accent",
        items: [
          { name: "Agua (500ml)", description: "", price: 2500 },
          { name: "Agua con gas (500ml)", description: "", price: 2500 },
          { name: "Agua saborizada", description: "", price: 3000 },
          { name: "Gaseosa (500ml)", description: "", price: 3000 },
          { name: "Licuado", description: "", price: 5000 }
        ]
      },
      {
        title: "Dulce",
        icon: "fas fa-cookie-bite",
        color: "card",
        items: [
          { name: "Medialuna", description: "", price: 1000 },
          { name: "Petit Four", description: "Lemon pie, Toffi o Pasta de mani", price: 2000 },
          { name: "Eclair", description: "", price: 2500 },
          { name: "Cupcake personalizado", description: "", price: 3500 },
          { name: "Torta del dia", description: "", price: 6000 }
        ]
      },
      {
        title: "Salado",
        icon: "fas fa-bread-slice",
        color: "dark",
        items: [
          { name: "Medialuna", description: "Jamon y queso", price: 2000 },
          { name: "Pebete", description: "Jamon y queso", price: 4500 }
        ]
      }
    ],
    socials: [
      { label: "Instagram", icon: "fab fa-instagram", url: "#" },
      { label: "Facebook", icon: "fab fa-facebook-f", url: "#" },
      { label: "WhatsApp", icon: "fab fa-whatsapp", url: "https://wa.me/5492215569289" }
    ]
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function toText(value, fallback) {
    if (typeof value === "string") {
      return value.trim();
    }

    if (value === null || value === undefined) {
      return fallback;
    }

    return String(value).trim();
  }

  function toPrice(value, fallback) {
    const numeric = Number(value);
    if (Number.isFinite(numeric) && numeric >= 0) {
      return Math.round(numeric);
    }

    return fallback;
  }

  function normalizeData(input) {
    const safe = input && typeof input === "object" ? input : {};

    const businessSource = safe.business && typeof safe.business === "object" ? safe.business : {};
    const businessDefaults = DEFAULT_DATA.business;

    const business = {
      name: toText(businessSource.name, businessDefaults.name),
      subtitle: toText(businessSource.subtitle, businessDefaults.subtitle),
      logoPath: toText(businessSource.logoPath, businessDefaults.logoPath),
      phoneDisplay: toText(businessSource.phoneDisplay, businessDefaults.phoneDisplay),
      whatsappNumber: toText(businessSource.whatsappNumber, businessDefaults.whatsappNumber),
      footerNote: toText(businessSource.footerNote, businessDefaults.footerNote)
    };

    const promotionsSource = Array.isArray(safe.promotions) ? safe.promotions : DEFAULT_DATA.promotions;
    const promotions = promotionsSource
      .filter(function (entry) {
        return entry && typeof entry === "object";
      })
      .map(function (entry, index) {
        const fallback = DEFAULT_DATA.promotions[index] || DEFAULT_DATA.promotions[0];
        return {
          title: toText(entry.title, fallback.title),
          price: toPrice(entry.price, fallback.price),
          iconLeft: toText(entry.iconLeft, fallback.iconLeft),
          iconRight: toText(entry.iconRight, fallback.iconRight)
        };
      });

    const categoriesSource = Array.isArray(safe.categories) ? safe.categories : DEFAULT_DATA.categories;
    const categories = categoriesSource
      .filter(function (entry) {
        return entry && typeof entry === "object";
      })
      .map(function (entry, catIndex) {
        const fallbackCategory = DEFAULT_DATA.categories[catIndex] || DEFAULT_DATA.categories[0];
        const itemsSource = Array.isArray(entry.items) ? entry.items : fallbackCategory.items;

        const items = itemsSource
          .filter(function (item) {
            return item && typeof item === "object";
          })
          .map(function (item, itemIndex) {
            const fallbackItem = fallbackCategory.items[itemIndex] || fallbackCategory.items[0];
            return {
              name: toText(item.name, fallbackItem.name),
              description: toText(item.description, ""),
              price: toPrice(item.price, fallbackItem.price)
            };
          });

        return {
          title: toText(entry.title, fallbackCategory.title),
          icon: toText(entry.icon, fallbackCategory.icon),
          color: toText(entry.color, fallbackCategory.color),
          items: items.length > 0 ? items : clone(fallbackCategory.items)
        };
      });

    const socialsSource = Array.isArray(safe.socials) ? safe.socials : DEFAULT_DATA.socials;
    const socials = socialsSource
      .filter(function (entry) {
        return entry && typeof entry === "object";
      })
      .map(function (entry, index) {
        const fallback = DEFAULT_DATA.socials[index] || DEFAULT_DATA.socials[0];
        return {
          label: toText(entry.label, fallback.label),
          icon: toText(entry.icon, fallback.icon),
          url: toText(entry.url, fallback.url)
        };
      });

    return {
      business: business,
      promotions: promotions.length > 0 ? promotions : clone(DEFAULT_DATA.promotions),
      categories: categories.length > 0 ? categories : clone(DEFAULT_DATA.categories),
      socials: socials.length > 0 ? socials : clone(DEFAULT_DATA.socials)
    };
  }

  function readStorage() {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }

  function writeStorage(payload) {
    try {
      window.localStorage.setItem(STORAGE_KEY, payload);
      return true;
    } catch (error) {
      return false;
    }
  }

  function loadData() {
    const raw = readStorage();
    if (!raw) {
      return clone(DEFAULT_DATA);
    }

    try {
      return normalizeData(JSON.parse(raw));
    } catch (error) {
      return clone(DEFAULT_DATA);
    }
  }

  function saveData(data) {
    const normalized = normalizeData(data);
    writeStorage(JSON.stringify(normalized));
    return normalized;
  }

  function resetData() {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      // Ignore storage failures and still return defaults.
    }

    return clone(DEFAULT_DATA);
  }

  function formatPrice(value) {
    const amount = Number(value);
    const safeAmount = Number.isFinite(amount) ? amount : 0;
    return "$" + new Intl.NumberFormat("es-AR").format(safeAmount);
  }

  function hasSavedData() {
    const raw = readStorage();
    return typeof raw === "string" && raw.trim().length > 0;
  }

  window.MSStore = {
    STORAGE_KEY: STORAGE_KEY,
    getDefaultData: function () {
      return clone(DEFAULT_DATA);
    },
    loadData: loadData,
    saveData: saveData,
    resetData: resetData,
    hasSavedData: hasSavedData,
    normalizeData: normalizeData,
    formatPrice: formatPrice
  };
})();
