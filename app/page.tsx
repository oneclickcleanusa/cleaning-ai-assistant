"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Job = {
  id: string;
  customer_name: string;
  phone: string | null;
  address: string | null;
  service_description: string | null;
  job_date: string | null;
  start_at: string | null;
  price: number | null;
  status: string | null;
  created_at: string;
};

const services = [
  "Carpet Cleaning",
  "Upholstery Cleaning",
  "Sofa Cleaning",
  "Sectional Cleaning",
  "Mattress Cleaning",
  "Area Rug Cleaning",
  "Rug Pickup",
  "Water Damage",
  "Air Duct Cleaning",
  "Dryer Vent Cleaning",
  "Other"
];

const times = [
  "08:00","09:00","10:00","11:00","12:00",
  "13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00"
];

const statuses = [
  "open",
  "scheduled",
  "completed",
  "canceled",
  "follow up",
  "pick up"
];

function formatTime(t: string) {
  const [h, m] = t.split(":");
  const hour = Number(h);
  const suffix = hour >= 12 ? "PM" : "AM";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display}:${m} ${suffix}`;
}

function formatSavedTime(t: string | null) {
  if (!t) return "No time";
  return new Date(t).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit"
  });
}

export default function Home() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("open");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);

  const loadJobs = async () => {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setJobs(data);
  };

  useEffect(() => {
    loadJobs();
  }, []);

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

const { error } = await supabase.from("jobs").insert([newJob]);

if (error) {
  setLoading(false);
  alert(error.message);
  return;
}

try {
  const calendarRes = await fetch("/api/create-calendar-event", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newJob)
  });

  const text = await calendarRes.text();
  let calendarData: any = {};

  try {
    calendarData = JSON.parse(text);
  } catch {
    calendarData = { error: text || "Unknown server response" };
  }

  setLoading(false);

  if (!calendarRes.ok) {
    alert(`Job saved, but calendar failed: ${calendarData.error || "Unknown error"}`);
  } else {
    alert("Job saved and added to Google Calendar!");
  }
} catch (err: any) {
  setLoading(false);
  alert(`Calendar request failed: ${err.message}`);
}

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

  return (
    <div style={{ padding: 40, maxWidth: 900, fontFamily: "Arial" }}>
      <h1>Cleaning AI Assistant</h1>

      {/* GOOGLE CONNECT */}
      <button
        onClick={() => (window.location.href = "/api/google-auth")}
        style={{ marginBottom: 20 }}
      >
        Connect Google Calendar
      </button>

      <h2>Create Job</h2>

      <input
        placeholder="Customer Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      /><br /><br />

      <input
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      /><br /><br />

      <input
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      /><br /><br />

      <select value={service} onChange={(e) => setService(e.target.value)}>
        <option value="">Select Service</option>
        {services.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select><br /><br />

      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <br /><br />

      <select value={time} onChange={(e) => setTime(e.target.value)}>
        <option value="">Select Time</option>
        {times.map((t) => (
          <option key={t} value={t}>{formatTime(t)}</option>
        ))}
      </select><br /><br />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      /><br /><br />

      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        {statuses.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select><br /><br />

      <button onClick={createJob} disabled={loading}>
        {loading ? "Saving..." : "Create Job"}
      </button>

      <h2 style={{ marginTop: 40 }}>Saved Jobs</h2>

      {jobs.length === 0 ? (
        <p>No jobs yet</p>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {jobs.map((job) => (
            <div
              key={job.id}
              style={{ border: "1px solid #ccc", padding: 10 }}
            >
              <strong>{job.customer_name}</strong>
              <div>{job.phone}</div>
              <div>{job.address}</div>
              <div>{job.service_description}</div>
              <div>{job.job_date}</div>
              <div>{formatSavedTime(job.start_at)}</div>
              <div>{job.price ? `$${job.price}` : ""}</div>
              <div>Status: {job.status}</div>
              <small>{new Date(job.created_at).toLocaleString()}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
