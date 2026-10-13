
/* EVERAFTER WEDDING SERVICE MANAGEMENT SYSTEM */

// SUPABASE CONFIGURATION
const SUPABASE_URL = "https://pvqtuusgzfydvizmiqrf.supabase.co";
const SUPABASE_KEY = "sb_publishable_eY6YzLVsqcPNKX2erbj90A_GTkkkmXK";

const $ = (id) => document.getElementById(id);

let supabaseClient = null;
let toastTimer;

// WEDDING SERVICES
const services = {
  venue: {
    title: "Venue & Reception",
    serviceValue: "Venue & Reception",
    description: "Choose the perfect setting for your wedding.",
    options: [
      {
        name: "Garden Romance",
        price: "₱15,000+",
        description: "An outdoor celebration surrounded by flowers and greenery.",
        image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=80"
      },
      {
        name: "Elegant Ballroom",
        price: "₱19,000+",
        description: "A classic indoor venue with an elegant atmosphere.",
        image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=80"
      },
      {
        name: "Intimate Reception",
        price: "₱22,000+",
        description: "A cozy celebration for your closest family and friends.",
        image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=80"
      }
    ]
  },

  catering: {
    title: "Food & Catering",
    serviceValue: "Food & Catering",
    description: "Explore menu styles for your wedding celebration.",
    options: [
      {
        name: "Classic Buffet",
        price: "₱650 / guest+",
        description: "A selection of crowd-favorite dishes for your guests.",
        image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=900&q=80"
      },
      {
        name: "Elegant Plated Meal",
        price: "₱950 / guest+",
        description: "A refined meal served individually to each guest.",
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80"
      },
      {
        name: "Dessert & Drinks Bar",
        price: "₱15,000+",
        description: "Sweet treats and refreshing drinks for your reception.",
        image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80"
      }
    ]
  },

  decoration: {
    title: "Flowers & Styling",
    serviceValue: "Flowers & Styling",
    description: "Choose a wedding look that matches your personality.",
    options: [
      {
        name: "Blush & Ivory",
        price: "₱5,000+",
        description: "Soft blush flowers and romantic ivory details.",
        image: "https://www.bing.com/th/id/OIP.jXh7QT77O8z35KcRpOmj8gHaJ1?w=193&h=257&c=8&rs=1&qlt=90&o=6&pid=ImgAns&rm=2"
      },
      {
        name: "Classic White Elegance",
        price: "₱15,000+",
        description: "Beautiful white flowers for a timeless wedding.",
        image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80"
      },
      {
        name: "Garden Boho",
        price: "₱8,000+",
        description: "Natural textures, greenery, and relaxed floral styling.",
        image: "https://th.bing.com/th/id/OIP.J-kOvaI35oALn8xcCbmdvAHaHT?w=184&h=182&c=7&r=0&o=7&pid=1.7&rm=3"
      }
    ]
  },

  photography: {
    title: "Photo & Video",
    serviceValue: "Photo & Video",
    description: "Keep your wedding memories in beautiful photographs and film.",
    options: [
      {
        name: "Essential Photo Coverage",
        price: "₱3,000+",
        description: "Photography coverage for the important moments.",
        image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=900&q=80"
      },
      {
        name: "Photo & Highlight Film",
        price: "₱5,000+",
        description: "Photography combined with a cinematic highlight video.",
        image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80"
      },
      {
        name: "Full-Day Story",
        price: "₱10,000+",
        description: "Extended coverage of your special day.",
        image: "https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=900&q=80"
      }
    ]
  }
};

// SCREEN NAVIGATION
const screenIds = [
  "home",
  "services",
  "booking",
  "contact",
  "adminPanel",
  "serviceGallery"
];

function showOnlyScreen(screenId) {
  screenIds.forEach((id) => {
    const section = $(id);
    if (section) {
      section.hidden = id !== screenId;
    }
  });

  document.querySelectorAll("[data-screen]").forEach((link) => {
    link.classList.toggle(
      "active",
      link.dataset.screen === screenId
    );
  });

  closeMenu();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function closeMenu() {
  $("mainNav")?.classList.remove("open");
  $("menuToggle")?.setAttribute("aria-expanded", "false");
}

// NOTIFICATIONS
function showToast(message) {
  const toast = $("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}

function cleanText(value) {
  return String(value ?? "").trim();
}

// DISPLAY SERVICE OPTIONS
function openService(serviceKey) {
  const service = services[serviceKey];
  if (!service) return;

  $("galleryTitle").textContent = service.title;
  $("galleryDescription").textContent = service.description;

  const container = $("optionsContainer");
  container.replaceChildren();

  service.options.forEach((option) => {
    const card = document.createElement("article");
    card.className = "option-card";

    const image = document.createElement("img");
    image.src = option.image;
    image.alt = option.name;
    image.loading = "lazy";

    image.onerror = () => {
      image.style.display = "none";
    };

    const body = document.createElement("div");
    body.className = "option-card-body";

    const title = document.createElement("h3");
    title.textContent = option.name;

    const description = document.createElement("p");
    description.textContent = option.description;

    const price = document.createElement("div");
    price.className = "option-price";
    price.textContent = option.price;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "button button-primary";
    button.textContent = "Choose this option ♡";

    button.addEventListener("click", () => {
      chooseOption(serviceKey, option);
    });

    body.append(title, description, price, button);
    card.append(image, body);
    container.append(card);
  });

  showOnlyScreen("serviceGallery");
}

// SELECT A SERVICE OPTION
function chooseOption(serviceKey, option) {
  const service = services[serviceKey];
  if (!service) return;

  $("service").value = service.serviceValue;
  $("selectedOption").value =
    `${option.name} — ${option.price}`;

  showOnlyScreen("booking");
  $("clientName").focus({ preventScroll: true });
}

// CONNECT TO SUPABASE
function setupSupabase() {
  if (!window.supabase?.createClient) {
    console.error(
      "Supabase library not loaded. Check index.html."
    );
    return;
  }

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("Check your Supabase URL and publishable key.");
    return;
  }

  supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );

  supabaseClient.auth.onAuthStateChange(
    (_event, session) => {
      updateAdminAuthView(session);
    }
  );

  supabaseClient.auth.getSession().then(({ data, error }) => {
    if (error) {
      console.error("Session check failed:", error);
      return;
    }

    updateAdminAuthView(data.session);
  });
}

// UPDATE ADMIN LOGIN DISPLAY
function updateAdminAuthView(session) {
  const signedIn = Boolean(session?.user);

  if ($("adminLoginBox")) {
    $("adminLoginBox").hidden = signedIn;
  }

  if ($("adminDashboard")) {
    $("adminDashboard").hidden = !signedIn;
  }

  if (signedIn) {
    if ($("adminWelcome")) {
      $("adminWelcome").textContent =
        `Signed in as ${session.user.email}`;
    }

    loadBookings();
  }
}

// SUBMIT A WEDDING BOOKING
async function handleBookingSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const status = $("bookingStatus");
  const submit = $("submitBooking");

  status.textContent = "";

  const booking = {
    client_name: cleanText($("clientName").value),
    email: cleanText($("email").value),
    phone: cleanText($("phone").value),
    wedding_date: $("weddingDate").value,
    service: cleanText($("service").value),
    message: cleanText($("message").value),
    status: "Pending",
  };

  const selectedOption = cleanText(
    $("selectedOption").value
  );

  if (selectedOption) {
    booking.message =
      `Selected option: ${selectedOption}` +
      (booking.message
        ? "\n\n" + booking.message
        : "");
  }

  if (
    !booking.client_name ||
    !booking.email ||
    !booking.wedding_date ||
    !booking.service
  ) {
    status.textContent =
      "Please complete all required fields.";
    return;
  }

  const selectedDate = new Date(
    booking.wedding_date + "T00:00:00"
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    status.textContent =
      "Please choose today or a future wedding date.";
    return;
  }

  submit.disabled = true;
  submit.textContent = "Sending request...";

  try {
    if (!supabaseClient) {
      throw new Error(
        "Supabase is not connected. Check your project settings."
      );
    }

    const { error } = await supabaseClient
      .from("bookings")
      .insert([booking]);

    if (error) throw error;

    form.reset();

    status.textContent =
      "Your booking request was sent! We look forward to hearing about your special day.";

    showToast("Booking request submitted ♡");

  } catch (error) {
   console.error(
  "Booking submission failed:",
  JSON.stringify(error, null, 2)
);
    status.textContent =
      "Booking failed: " +
      (error.message || "Unknown error");

  } finally {
    submit.disabled = false;
    submit.textContent =
      "Send booking request ♡";
  }
}

// ADMIN LOGIN
async function handleAdminLogin(event) {
  event.preventDefault();

  const status = $("adminLoginStatus");
  status.textContent = "";

  if (!supabaseClient) {
    status.textContent =
      "Supabase is not connected. Check your project settings.";
    return;
  }

  const button = event.currentTarget.querySelector(
    "button[type='submit']"
  );

  if (button) {
    button.disabled = true;
    button.textContent = "Signing in...";
  }

  try {
    const { error } =
      await supabaseClient.auth.signInWithPassword({
        email: cleanText($("adminEmail").value),
        password: $("adminPassword").value
      });

    if (error) throw error;

    $("adminPassword").value = "";

  } catch (error) {
    console.error("Admin sign-in failed:", error);

    status.textContent =
      "Sign-in failed: " +
      (error.message ||
        "Check your details and Supabase Auth account.");

  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = "Sign in";
    }
  }
}

// LOAD BOOKINGS FOR ADMIN
async function loadBookings() {
  if (!supabaseClient || !$("bookingsTableBody")) {
    return;
  }

  const body = $("bookingsTableBody");
  body.replaceChildren();

  const loadingRow = document.createElement("tr");
  const loadingCell = document.createElement("td");

  loadingCell.colSpan = 7;
  loadingCell.textContent = "Loading bookings...";

  loadingRow.append(loadingCell);
  body.append(loadingRow);

  try {
    const { data, error } = await supabaseClient
      .from("bookings")
      .select(
        "id, client_name, email, phone, wedding_date, service, message, status, created_at"
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    $("adminStatus").textContent =
      `${data.length} booking request(s).`;

    body.replaceChildren();

    if (data.length === 0) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");

      cell.colSpan = 7;
      cell.textContent = "No booking requests yet.";

      row.append(cell);
      body.append(row);
      return;
    }

    data.forEach((booking) => {
      const row = document.createElement("tr");

      const values = [
        booking.client_name,
        booking.wedding_date,
        booking.service,
        `${booking.email}${
          booking.phone ? "\n" + booking.phone : ""
        }`,
        booking.message || "—"
      ];

      values.forEach((value) => {
        const cell = document.createElement("td");
        cell.textContent = value || "—";
        row.append(cell);
      });

      // STATUS DROPDOWN
      const statusCell = document.createElement("td");
      const select = document.createElement("select");

    
       [
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled"
].forEach((value) => {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = value;
  option.selected = value === booking.status;
  select.append(option);
});

      select.setAttribute(
        "aria-label",
        `Status for ${booking.client_name}`
      );

      statusCell.append(select);
      row.append(statusCell);

      // SAVE STATUS BUTTON
      const actionCell = document.createElement("td");
      const save = document.createElement("button");

      save.className = "button button-light";
      save.type = "button";
      save.textContent = "Save";

      save.addEventListener("click", async () => {
        save.disabled = true;

        try {
          const { data: updatedRows, error: updateError } =
            await supabaseClient
              .from("bookings")
              .update({ status: select.value })
              .eq("id", booking.id)
              .select("id, status");

          if (updateError) throw updateError;

          if (!updatedRows || updatedRows.length === 0) {
            throw new Error(
              "No booking was updated. Check your admin UPDATE policy and record access."
            );
          }

          booking.status = select.value;

          $("adminStatus").textContent =
            `Updated ${booking.client_name}'s booking to ${select.value}.`;

          showToast("Booking status updated ♡");

          console.error("Status update failed:", {
  message: error.message,
  details: error.details,
  hint: error.hint,
  code: error.code
});

          $("adminStatus").textContent =
            "Status update failed: " +
            (error.message || "Unknown error");
        } catch (error) {

        } finally {
          save.disabled = false;
        }
      });

      actionCell.append(save);
      row.append(actionCell);
      body.append(row);
    });

  } catch (error) {
    console.error("Loading bookings failed:", error);

    body.replaceChildren();

    const row = document.createElement("tr");
    const cell = document.createElement("td");

    cell.colSpan = 7;
    cell.textContent =
      "Unable to load bookings. Check your admin SELECT policy.";

    row.append(cell);
    body.append(row);

    $("adminStatus").textContent =
      "Bookings could not be loaded: " +
      (error.message || "Unknown error");
  }
}

// ADMIN SIGN OUT
async function handleAdminSignOut() {
  if (!supabaseClient) return;

  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    $("adminStatus").textContent =
      "Could not sign out: " + error.message;

    console.error("Sign out failed:", error);

  } else {
    $("adminDashboard").hidden = true;
    $("adminLoginBox").hidden = false;

    showToast("Signed out successfully.");
  }
}

// INITIALIZE WEBSITE
function initializeSite() {
  if ($("currentYear")) {
    $("currentYear").textContent =
      new Date().getFullYear();
  }

  const menuToggle = $("menuToggle");
  const mainNav = $("mainNav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const open = mainNav.classList.toggle("open");

      menuToggle.setAttribute(
        "aria-expanded",
        String(open)
      );
    });
  }

  document.querySelectorAll("[data-go]").forEach((button) => {
    button.addEventListener("click", () => {
      showOnlyScreen(button.dataset.go);
    });
  });

  document.querySelectorAll("[data-service]").forEach((button) => {
    button.addEventListener("click", () => {
      openService(button.dataset.service);
    });
  });

  document.querySelectorAll("[data-screen]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showOnlyScreen(link.dataset.screen);
    });
  });

  $("adminNavButton")?.addEventListener("click", () => {
    showOnlyScreen("adminPanel");
  });

  $("backToServices")?.addEventListener("click", () => {
    showOnlyScreen("services");
  });

  $("bookingForm")?.addEventListener(
    "submit",
    handleBookingSubmit
  );

  $("adminLoginForm")?.addEventListener(
    "submit",
    handleAdminLogin
  );

  $("adminSignOut")?.addEventListener(
    "click",
    handleAdminSignOut
  );

  $("refreshBookings")?.addEventListener(
    "click",
    loadBookings
  );

  // DISABLE PAST WEDDING DATES
  const weddingDate = $("weddingDate");

  if (weddingDate) {
    const today = new Date();

    weddingDate.min = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0")
    ].join("-");
  }

  setupSupabase();
  showOnlyScreen("home");
}

document.addEventListener(
  "DOMContentLoaded",
  initializeSite
);
