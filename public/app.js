const state = {
  token: localStorage.getItem("shopToken") || "",
  user: null,
  categories: [],
  products: [],
  page: 0,
  shippingItems: [],
};

const elements = {
  authSection: document.getElementById("authSection"),
  dashboardSection: document.getElementById("dashboardSection"),
  messageBox: document.getElementById("messageBox"),
  loginForm: document.getElementById("loginForm"),
  registerForm: document.getElementById("registerForm"),
  loginCard: document.getElementById("loginCard"),
  registerCard: document.getElementById("registerCard"),
  categoryForm: document.getElementById("categoryForm"),
  productForm: document.getElementById("productForm"),
  categoriesTable: document.querySelector("#categoriesTable tbody"),
  productCategory: document.getElementById("productCategory"),
  productList: document.getElementById("productList"),
  prevPageBtn: document.getElementById("prevPageBtn"),
  nextPageBtn: document.getElementById("nextPageBtn"),
  currentPageLabel: document.getElementById("currentPage"),
  profileName: document.getElementById("profileName"),
  profilePhone: document.getElementById("profilePhone"),
  profileType: document.getElementById("profileType"),
  profileCreated: document.getElementById("profileCreated"),
  logoutBtn: document.getElementById("logoutBtn"),
  showLoginBtn: document.getElementById("showLoginBtn"),
  showRegisterBtn: document.getElementById("showRegisterBtn"),
  addShippingBtn: document.getElementById("addShippingBtn"),
  shippingName: document.getElementById("shippingName"),
  shippingDesc: document.getElementById("shippingDesc"),
  shippingCost: document.getElementById("shippingCost"),
  shippingList: document.getElementById("shippingList"),
  singleImageForm: document.getElementById("singleImageForm"),
  multipleImageForm: document.getElementById("multipleImageForm"),
  imageUploadResult: document.getElementById("imageUploadResult"),
};

const showSection = (section) => {
  if (section === "dashboard") {
    elements.authSection.classList.add("hidden");
    elements.dashboardSection.classList.remove("hidden");
    elements.logoutBtn.classList.remove("hidden");
    elements.showLoginBtn.classList.add("hidden");
    elements.showRegisterBtn.classList.add("hidden");
  } else {
    elements.authSection.classList.remove("hidden");
    elements.dashboardSection.classList.add("hidden");
    elements.logoutBtn.classList.add("hidden");
    elements.showLoginBtn.classList.remove("hidden");
    elements.showRegisterBtn.classList.remove("hidden");
  }
};

const showMessage = (text, type = "success") => {
  elements.messageBox.textContent = text;
  elements.messageBox.className = `message ${type}`;
  elements.messageBox.classList.remove("hidden");
  window.clearTimeout(state.messageTimer);
  state.messageTimer = window.setTimeout(() => {
    elements.messageBox.classList.add("hidden");
  }, 5000);
};

const clearMessage = () => {
  elements.messageBox.classList.add("hidden");
};

const setAuthToken = (token) => {
  state.token = token;
  if (token) {
    localStorage.setItem("shopToken", token);
  } else {
    localStorage.removeItem("shopToken");
  }
};

const apiFetch = async (path, { method = "GET", body = null, isForm = false } = {}) => {
  const headers = {};
  if (state.token) {
    headers.Authorization = `Bearer ${state.token}`;
  }

  if (body && !isForm) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(path, {
    method,
    headers,
    body: isForm ? body : body ? JSON.stringify(body) : null,
  });

  const json = await response.json().catch(() => null);
  if (!response.ok) {
    const errorMessage = json?.message || "Server request failed.";
    throw new Error(errorMessage);
  }

  return json;
};

const loadProfile = async () => {
  try {
    const data = await apiFetch("/users/me");
    state.user = data.result;
    elements.profileName.textContent = state.user.name || "—";
    elements.profilePhone.textContent = state.user.phone || "—";
    elements.profileType.textContent = state.user.type || "—";
    elements.profileCreated.textContent = new Date(state.user.created).toLocaleString();
    showSection("dashboard");
  } catch (error) {
    setAuthToken("");
    showSection("auth");
    showMessage(error.message, "error");
  }
};

const loadCategories = async () => {
  try {
    const data = await apiFetch("/cats");
    state.categories = data.result || [];
    renderCategoryOptions();
    renderCategoryTable();
  } catch (error) {
    showMessage(error.message, "error");
  }
};

const renderCategoryOptions = () => {
  elements.productCategory.innerHTML = "";
  state.categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category._id;
    option.textContent = category.name;
    elements.productCategory.appendChild(option);
  });
};

const renderCategoryTable = () => {
  elements.categoriesTable.innerHTML = "";
  if (state.categories.length === 0) {
    elements.categoriesTable.innerHTML = '<tr><td colspan="3">No categories available.</td></tr>';
    return;
  }

  state.categories.forEach((category) => {
    const row = document.createElement("tr");
    const nameCell = document.createElement("td");
    const nameInput = document.createElement("input");
    nameInput.value = category.name;
    nameInput.classList.add("inline-input");
    nameInput.addEventListener("change", () => {
      category.updatedName = nameInput.value.trim();
    });
    nameCell.appendChild(nameInput);

    const imageCell = document.createElement("td");
    const img = document.createElement("img");
    img.src = category.image;
    img.alt = category.name;
    img.className = "category-thumb";
    imageCell.appendChild(img);

    const actionsCell = document.createElement("td");
    const updateButton = document.createElement("button");
    updateButton.textContent = "Update";
    updateButton.type = "button";
    updateButton.addEventListener("click", () => updateCategory(category._id, nameInput.value));

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.type = "button";
    deleteButton.className = "danger-btn";
    deleteButton.addEventListener("click", () => deleteCategory(category._id));

    actionsCell.append(updateButton, deleteButton);
    row.append(nameCell, imageCell, actionsCell);
    elements.categoriesTable.appendChild(row);
  });
};

const updateCategory = async (id, name) => {
  try {
    const trimmedName = name.trim();
    if (!trimmedName) {
      showMessage("Category name cannot be empty.", "error");
      return;
    }
    await apiFetch(`/cats/${id}`, {
      method: "PATCH",
      body: { name: trimmedName },
    });
    showMessage("Category updated successfully.");
    await loadCategories();
  } catch (error) {
    showMessage(error.message, "error");
  }
};

const deleteCategory = async (id) => {
  if (!confirm("Delete this category?")) {
    return;
  }
  try {
    await apiFetch(`/cats/${id}`, { method: "DELETE" });
    showMessage("Category deleted.");
    await loadCategories();
  } catch (error) {
    showMessage(error.message, "error");
  }
};

const loadProducts = async (page = 0) => {
  try {
    const data = await apiFetch(`/products/paginate/${page}`);
    const nextPageItems = data.result || [];
    if (nextPageItems.length === 0 && page > 0) {
      showMessage("No more products on the next page.", "error");
      return;
    }
    state.products = nextPageItems;
    state.page = page;
    elements.currentPageLabel.textContent = String(page + 1);
    renderProductList();
  } catch (error) {
    showMessage(error.message, "error");
  }
};

const renderProductList = () => {
  elements.productList.innerHTML = "";
  if (state.products.length === 0) {
    elements.productList.textContent = "No products available on this page.";
    return;
  }

  const categoryLookup = state.categories.reduce((map, category) => {
    map[category._id] = category.name;
    return map;
  }, {});

  state.products.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-item";

    const priceValue = Number(product.price) || 0;
    const title = document.createElement("strong");
    title.textContent = `${product.name} — ${priceValue.toFixed(2)} K`;
    card.appendChild(title);

    const detailList = [
      `Category: ${categoryLookup[product.category] || product.category}`,
      `Owner: ${product.user?.name || "Unknown"}`,
      `Size: ${product.size}`,
      `Discount: ${product.discount ?? 0}`,
      `Tags: ${Array.isArray(product.tags) ? product.tags.join(", ") : "—"}`,
      `Colors: ${Array.isArray(product.colors) ? product.colors.join(", ") : "—"}`,
    ];

    detailList.forEach((text) => {
      const p = document.createElement("p");
      p.textContent = text;
      card.appendChild(p);
    });

    if (product.Shipping?.length > 0) {
      const shippingLabel = document.createElement("p");
      shippingLabel.textContent = `Shipping options: ${product.Shipping.length}`;
      card.appendChild(shippingLabel);
    }

    if (product.images?.length > 0) {
      const imageGroup = document.createElement("div");
      imageGroup.className = "product-images";
      product.images.forEach((image) => {
        const img = document.createElement("img");
        img.src = image.link;
        img.alt = image.desc;
        imageGroup.appendChild(img);
      });
      card.appendChild(imageGroup);
    }

    elements.productList.appendChild(card);
  });
};

const addShippingItem = () => {
  const name = elements.shippingName.value.trim();
  const desc = elements.shippingDesc.value.trim();
  const cost = Number(elements.shippingCost.value);

  if (!name || !desc || Number.isNaN(cost)) {
    showMessage("Please add a valid shipping option.", "error");
    return;
  }

  state.shippingItems.push({ name, desc, cost });
  elements.shippingName.value = "";
  elements.shippingDesc.value = "";
  elements.shippingCost.value = "";
  renderShippingItems();
};

const renderShippingItems = () => {
  elements.shippingList.innerHTML = "";
  if (state.shippingItems.length === 0) {
    elements.shippingList.innerHTML = "<li>No shipping options added.</li>";
    return;
  }

  state.shippingItems.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${item.name}: ${item.desc} — ${item.cost.toFixed(2)}</span>`;
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => {
      state.shippingItems.splice(index, 1);
      renderShippingItems();
    });
    li.appendChild(removeButton);
    elements.shippingList.appendChild(li);
  });
};

const submitRegister = async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);
  const body = {
    name: formData.get("name").trim(),
    phone: formData.get("phone").trim(),
    password: formData.get("password"),
  };

  try {
    await apiFetch("/users/register", { method: "POST", body });
    // After successful registration, switch to the login form and pre-fill username
    form.reset();
    const loginNameInput = document.querySelector("#loginForm input[name='name']");
    if (loginNameInput) loginNameInput.value = body.name;
    showAuthForm("login");
    showMessage("Account created. Please login.");
  } catch (error) {
    showMessage(error.message, "error");
  }
};

const submitLogin = async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);
  const body = {
    name: formData.get("name").trim(),
    password: formData.get("password"),
  };

  try {
    const data = await apiFetch("/users/login", { method: "POST", body });
    setAuthToken(data.result.token);
    form.reset();
    await loadProfile();
    await loadCategories();
    await loadProducts(0);
    showMessage("Login successful.");
  } catch (error) {
    showMessage(error.message, "error");
  }
};

const submitCategory = async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);
  const name = formData.get("name").trim();
  const file = formData.get("file");

  if (!name || !file || file.size === 0) {
    showMessage("Category name and image are required.", "error");
    return;
  }

  const payload = new FormData();
  payload.append("name", name);
  payload.append("file", file);

  try {
    await apiFetch("/cats", { method: "POST", body: payload, isForm: true });
    form.reset();
    await loadCategories();
    showMessage("Category added.");
  } catch (error) {
    showMessage(error.message, "error");
  }
};

const submitProduct = async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);

  const name = formData.get("name").trim();
  const price = Number(formData.get("price"));
  const discount = Number(formData.get("discount") || 0);
  const size = formData.get("size");
  const category = formData.get("category");
  const colors = formData.get("colors").split(",").map((value) => value.trim()).filter(Boolean);
  const tags = formData.get("tags").split(",").map((value) => value.trim()).filter(Boolean);
  const files = Array.from(document.getElementById("productImages").files);

  if (!name || Number.isNaN(price) || !category || files.length === 0) {
    showMessage("Product name, price, category, and at least one image are required.", "error");
    return;
  }

  const payload = new FormData();
  payload.append("name", name);
  payload.append("price", String(price));
  payload.append("discount", String(discount));
  payload.append("size", size);
  payload.append("category", category);
  payload.append("colors", JSON.stringify(colors));
  payload.append("tags", JSON.stringify(tags));
  payload.append("Shipping", JSON.stringify(state.shippingItems));

  files.forEach((file) => payload.append("files", file));

  try {
    await apiFetch("/products", { method: "POST", body: payload, isForm: true });
    form.reset();
    state.shippingItems = [];
    renderShippingItems();
    await loadProducts(state.page);
    showMessage("Product created successfully.");
  } catch (error) {
    showMessage(error.message, "error");
  }
};

const submitSingleImage = async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const file = form.querySelector("input[name='file']").files[0];
  if (!file) {
    showMessage("Please choose an image to upload.", "error");
    return;
  }

  const payload = new FormData();
  payload.append("file", file);

  try {
    const data = await apiFetch("/image", { method: "POST", body: payload, isForm: true });
    const imageUrl = data.link || "";
    elements.imageUploadResult.innerHTML = `Uploaded: <a href="${imageUrl}" target="_blank">${imageUrl}</a>`;
    showMessage("Single image uploaded.");
  } catch (error) {
    showMessage(error.message, "error");
  }
};

const submitMultipleImage = async (event) => {
  event.preventDefault();
  const files = Array.from(document.getElementById("multiUploadFiles").files);
  if (files.length === 0) {
    showMessage("Please choose at least one image.", "error");
    return;
  }

  const payload = new FormData();
  files.forEach((file) => payload.append("files", file));

  try {
    const data = await apiFetch("/images", { method: "POST", body: payload, isForm: true });
    const imageEntries = Array.isArray(data.msg) ? data.msg : [data.msg];
    elements.imageUploadResult.innerHTML = `<p>Uploaded images:</p><ul>${imageEntries
      .map((item) => `<li>${item.link || JSON.stringify(item)}</li>`)
      .join("")}</ul>`;
    showMessage("Multiple images uploaded.");
  } catch (error) {
    showMessage(error.message, "error");
  }
};

const showAuthForm = (form = "login") => {
  showSection("auth");
  clearMessage();

  if (form === "login") {
    elements.loginCard.classList.remove("hidden");
    elements.registerCard.classList.add("hidden");
    const firstInput = elements.loginCard.querySelector("input[name='name']");
    if (firstInput) firstInput.focus();
  } else {
    elements.registerCard.classList.remove("hidden");
    elements.loginCard.classList.add("hidden");
    const firstInput = elements.registerCard.querySelector("input[name='name']");
    if (firstInput) firstInput.focus();
  }
};

const logout = () => {
  setAuthToken("");
  state.user = null;
  state.categories = [];
  state.products = [];
  showAuthForm("login");
  showMessage("Logged out.");
};

const wireEvents = () => {
  elements.registerForm.addEventListener("submit", submitRegister);
  elements.loginForm.addEventListener("submit", submitLogin);
  elements.categoryForm.addEventListener("submit", submitCategory);
  elements.productForm.addEventListener("submit", submitProduct);
  elements.showLoginBtn.addEventListener("click", () => showAuthForm("login"));
  elements.showRegisterBtn.addEventListener("click", () => showAuthForm("register"));
  elements.logoutBtn.addEventListener("click", logout);
  elements.prevPageBtn.addEventListener("click", () => {
    if (state.page > 0) {
      loadProducts(state.page - 1);
    }
  });
  elements.nextPageBtn.addEventListener("click", () => loadProducts(state.page + 1));
  elements.addShippingBtn.addEventListener("click", addShippingItem);
  elements.singleImageForm.addEventListener("submit", submitSingleImage);
  elements.multipleImageForm.addEventListener("submit", submitMultipleImage);
};

const initialize = async () => {
  wireEvents();
  renderShippingItems();
  if (state.token) {
    await loadProfile();
    await loadCategories();
    await loadProducts(0);
  } else {
    showAuthForm("login");
  }
};

initialize();
