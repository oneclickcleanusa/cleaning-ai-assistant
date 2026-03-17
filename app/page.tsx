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
  address: string | null;
  created_at: string;
};

export default function Home() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);

  const loadJobs = async () => {
    const { data, error } = await supabase
      .from("jobs")
      .select("id, customer_name, address, created_at")
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

    setLoading(true);

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

    setLoading(false);

    if (error) {
      alert(`Error creating job: ${error.message}`);
    } else {
      alert("Job saved!");
      setName("");
      setAddress("");
      loadJobs();
    }
  };

  return (
    <div style={{ padding: 40, maxWidth: 900 }}>
      <h1>Cleaning AI Assistant</h1>

      <div style={{ marginTop: 30, marginBottom: 40 }}>
        <h2>Create Job</h2>

        <input
          placeholder="Customer Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: 300, padding: 10, marginBottom: 12 }}
        />

        <br />

        <input
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{ width: 300, padding: 10, marginBottom: 12 }}
        />

        <br />

        <button onClick={createJob} disabled={loading} style={{ padding: "10px 16px" }}>
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
                <div>{job.address || "No address"}</div>
                <small>{new Date(job.created_at).toLocaleString()}</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}      setAddress("");
    }
  };
