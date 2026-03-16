"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const createJob = async () => {
    const now = new Date();
    const end = new Date(now.getTime() + 60 * 60 * 1000);

    const { error } = await supabase.from("jobs").insert([
      {
        customer_name: name,
        address: address,
        start_at: now.toISOString(),
        end_at: end.toISOString(),
        assigned_to: "Nicky",
        status: "open",
        job_type: "your_job",
        event_color: "blue"
      }
    ]);

    if (error) {
      alert(`Error creating job: ${error.message}`);
    } else {
      alert("Job saved!");
      setName("");
      setAddress("");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Cleaning AI Assistant</h1>

      <h3>Create Job</h3>

      <input
        placeholder="Customer Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <br /><br />

      <button onClick={createJob}>Create Job</button>
    </div>
  );
}
