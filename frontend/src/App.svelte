
<script>
  const API =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const today = () =>
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(new Date());

  let form = $state({
    fullName: "",
    email: "",
    phone: "",
    eventDate: "",
    timeSlot: "",
    guestCount: "100",
    specialRequirements: ""
  });

  let slots = $state([]);
  let loading = $state(false);
  let submitting = $state(false);
  let message = $state("");
  let error = $state(false);
  let reference = $state("");

  // Load available slots for the selected date
  async function loadSlots() {
    form.timeSlot = "";
    slots = [];
    message = "";
    error = false;

    if (!form.eventDate) return;

    loading = true;

    try {
      const response = await fetch(
        `${API}/api/bookings/slots?date=${encodeURIComponent(form.eventDate)}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load slots.");
      }

      slots = data.slots || [];

    } catch (e) {
      error = true;
      message = e.message;
    } finally {
      loading = false;
    }
  }

  // Submit booking
  async function submit(event) {
    event.preventDefault();
    
    message = "";
    reference = "";

    if (!/^[6-9]\d{9}$/.test(form.phone)) {
  error = true;
  message = "Please enter a valid 10-digit Indian mobile number.";
  return;
}
    if (!form.timeSlot) {
      error = true;
      message = "Please choose an available time slot.";
      return;
    }

    submitting = true;

    try {
      const response = await fetch(`${API}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Booking failed. Please try again."
        );
      }

      error = false;
      message = data.message || "Your booking was successful!";
      reference = data.booking?.id || "";

      // Reset form after successful booking
      form = {
        fullName: "",
        email: "",
        phone: "",
        eventDate: "",
        timeSlot: "",
        guestCount: "100",
        specialRequirements: ""
      };

      slots = [];

    } catch (e) {
      error = true;
      message = e.message;

      // Refresh slots after a failed booking.
      // This handles cases where another user booked
      // the selected slot at the same time.
      if (form.eventDate) {
        loading = true;

        try {
          const response = await fetch(
            `${API}/api/bookings/slots?date=${encodeURIComponent(form.eventDate)}`
          );

          const data = await response.json();

          if (response.ok) {
            slots = data.slots || [];
          }
        } catch (refreshError) {
          console.error("Could not refresh availability:", refreshError);
        } finally {
          loading = false;
        }
      }

    } finally {
      submitting = false;
    }
  }
</script>

<svelte:head>
  <title>Gather Hall | Event Booking</title>
  <meta
    name="description"
    content="Book your event hall date and time slot."
  />
</svelte:head>

<main class="shell">

  <header>
    <a class="brand" href="/">
      <span class="mark">G</span>
      gather<span>hall</span>
    </a>
    <small>EVENT SPACE RESERVATIONS</small>
  </header>

  <section class="intro">
    <p class="eyebrow">MAKE ROOM FOR A MOMENT</p>

    <h1>
      Every gathering<br />
      <em>starts somewhere.</em>
    </h1>

    <p>
      Tell us a little about your event. Choose a date,
      find an open time, and we'll take care of the rest.
    </p>
  </section>

  <section class="card">

    <div class="card-head">
      <div>
        <p class="eyebrow">RESERVATION REQUEST</p>
        <h2>Book the hall</h2>
      </div>

      <small>01 / DETAILS</small>
    </div>

    {#if message}
      <div
        class="notice"
        class:success={!error}
        class:failure={error}
        role="alert"
      >
        {message}

        {#if reference}
          <div class="ref">
            Booking reference:
            <strong>{reference}</strong>
          </div>
        {/if}
      </div>
    {/if}

    <form onsubmit={submit}>

      <!-- Personal Details -->

      <div class="section">
        <span>01</span>
        <h3>Your details</h3>
      </div>

      <div class="grid">

        <label class="field wide">
          Full name <b>*</b>

          <input
            bind:value={form.fullName}
            maxlength="100"
            placeholder="e.g. Asha Kumar"
            required
          />
        </label>

        <label class="field">
          Email address <b>*</b>

          <input
            bind:value={form.email}
            type="email"
            placeholder="you@example.com"
            required
          />
        </label>

      <label class="field">
  Phone number <b>*</b>

  <input
    bind:value={form.phone}
    type="tel"
    inputmode="numeric"
    maxlength="10"
    oninput={(e) => {
      form.phone = e.currentTarget.value
        .replace(/\D/g, "")
        .slice(0, 10);
    }}
    placeholder="10-digit mobile number"
    required
  />
</label>
        

      </div>

      <!-- Event Details -->

      <div class="section second">
        <span>02</span>
        <h3>Your event</h3>
      </div>

      <div class="grid">

        <label class="field">
          Event date <b>*</b>

          <input
            type="date"
            min={today()}
            value={form.eventDate}
            onchange={(e) => {
              form.eventDate = e.currentTarget.value;
              loadSlots();
            }}
            required
          />
        </label>

        <label class="field">
          Number of guests <b>*</b>

          <input
            bind:value={form.guestCount}
            type="number"
            min="1"
            max="1000"
            required
          />
        </label>

      </div>

      <!-- Time Slot Selection -->

      <div class="slot-head">
        <div>
          <strong>Choose a time slot <b>*</b></strong>
          <p>Only one booking is allowed per slot per date.</p>
        </div>

        {#if form.eventDate}
          <small>{form.eventDate}</small>
        {/if}
      </div>

      {#if !form.eventDate}

        <div class="empty">
          Select an event date to see available times.
        </div>

      {:else if loading}

        <div class="empty">
          Checking availability…
        </div>

      {:else if slots.length}

        <div class="slots">

          {#each slots as slot (slot.value)}

            <button
              type="button"
              class:selected={form.timeSlot === slot.value}
              class:booked={!slot.available}
              disabled={!slot.available}
              aria-pressed={form.timeSlot === slot.value}
              onclick={() => {
                form.timeSlot = slot.value;
                message = "";
                error = false;
              }}
            >
              <span>{slot.label}</span>

              <strong>{slot.timeRange}</strong>

              <small>
                {slot.available ? "Available" : "Booked"}
              </small>

            </button>

          {/each}

        </div>

      {:else}

        <div class="empty">
          No slot information available.
        </div>

      {/if}

      <!-- Special Requirements -->

      <label class="field notes">
        Special requirements
        <small>(optional)</small>

        <textarea
          bind:value={form.specialRequirements}
          rows="3"
          maxlength="1000"
          placeholder="Seating, decorations, equipment, or anything else we should know."
        ></textarea>
      </label>

      <!-- Submit -->

      <div class="footer">

        <small><b>*</b> Required fields</small>

        <button
          class="submit"
          type="submit"
          disabled={submitting || loading}
        >
          {submitting ? "Confirming…" : "Request booking"}
          <span>↗</span>
        </button>

      </div>

    </form>
  </section>

  <footer>
    GATHERHALL
    <span>A place for your moments.</span>
  </footer>

</main>
