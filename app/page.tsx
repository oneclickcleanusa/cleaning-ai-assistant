const createJob = async () => {
  if (!name.trim()) {
    alert("Enter customer name");
    return;
  }

  const selectedDate = date || new Date().toISOString().split("T")[0];
  const selectedTime = time || "09:00";

  const start = new Date(`${selectedDate}T${selectedTime}:00`);
  const end = new Date(start.getTime() + 60 * 60 * 1000);

  setLoading(true);

  const newJob = {
    customer_name: name,
    phone,
    address,
    service_description: service,
    job_date: selectedDate,
    start_at: start.toISOString(),
    end_at: end.toISOString(),
    price: price ? Number(price) : null,
    status,
    assigned_to: "Nicky",
    job_type: "cleaning",
    event_color: "blue"
  };

  // ✅ 1. Save to Supabase FIRST
  const { error } = await supabase.from("jobs").insert([newJob]);

  if (error) {
    setLoading(false);
    alert("Database error: " + error.message);
    return;
  }

  // ✅ 2. Try Google Calendar (but don’t break if it fails)
  try {
    await fetch("/api/create-calendar-event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newJob)
    });
  } catch (err) {
    console.log("Google Calendar failed (safe to ignore)");
  }

  setLoading(false);

  alert("✅ Job saved!");

  setName("");
  setPhone("");
  setAddress("");
  setService("");
  setDate("");
  setTime("");
  setPrice("");
  setStatus("open");

  loadJobs();
};
