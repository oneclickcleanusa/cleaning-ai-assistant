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
  created_at: string;
};

const serviceOptions = [
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

export default function Home() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);

  const loadJobs = async () => {
    const { data, error } = await supabase
      .from("jobs")
      .select(
        "id, customer_name, phone, address, service_description, job_date, created_at"
      )
      .order("created_at", { ascending: false });

    if (!error && data) {
      setJobs(data);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const createJob = async () => {
    if (!name.trim()) {
      alert("Please enter customer name");
      return;
    }

    const selectedDate = date || new Date().toISOString().split("T")[0];
    const selectedTime = time || "09:00";
    const startDate = new Date(`${selectedDate}T${selectedTime}:00`);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

    setLoading(true);

    const { error } = await supabase.from("jobs").insert([
      {
        customer_name: name,
        phone,
        address,
        service_description: service,
        job_date: selectedDate,
        start_at: startDate.toISOString(),
        end_at: endDate.toISOString(),
        assigned_to: "Nicky",
        status: "open",
        job_type: "your_job",
        event_color: "blue"
      }
    ]);

    setLoading(false);

    if (error) {
      alert(`Error creating job: ${error.message}`);
      return;
    }

    alert("Job saved!");
    setName("");
    setPhone("");
    setAddress("");
    setService("");
    setDate("");
    setTime("");
    loadJobs();
  };

  return (
    <div style={{ padding: 40, maxWidth: 900, fontFamily: "Arial, sans-serif" }}>
      <h1>Cleaning AI Assistant</h1>

      <div style={{ marginTop: 30, marginBottom: 40 }}>
        <h2>Create Job</h2>

        <input
          placeholder="Customer Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: 320, padding: 10, marginBottom: 12 }}
        />

        <br />

        <input
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{ width: 320, padding: 10, marginBottom: 12 }}
        />

        <br />

        <input
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{ width: 320, padding: 10, marginBottom: 12 }}
        />

        <br />

        <select
          value={service}
          onChange={(e) => setService(e.target.value)}
          style={{ width: 344, padding: 10, marginBottom: 12 }}
        >
          <option value="">Select Service</option>
          {serviceOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <br />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ width: 320, padding: 10, marginBottom: 12 }}
        />

        <br />

        <input
  type="time"
  value={time}
  min="00:00"
  max="23:59"
  step="900"
  onChange={(e) => setTime(e.target.value)}
  style={{ width: 320, padding: 10, marginBottom: 12 }}
/>

        <br />

        <button
          onClick={createJob}
          disabled={loading}
          style={{
            padding: "10px 16px",
            cursor: "pointer",
            borderRadius: 6,
            border: "1px solid #ccc"
          }}
        >
          {loading ? "Saving..." : "Create Job"}
        </button>
      </div>

      <div>
        <h2>Saved Jobs</h2>

        {jobs.length === 0 ? (
          <p>No jobs yet.</p>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {jobs.map((job) => (
              <div
                key={job.id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: 8,
                  padding: 16
                }}
              >
                <strong>{job.customer_name}</strong>
                <div>{job.phone || "No phone"}</div>
                <div>{job.address || "No address"}</div>
                <div>{job.service_description || "No service"}</div>
                <div>{job.job_date || "No date"}</div>
                <small>{new Date(job.created_at).toLocaleString()}</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
