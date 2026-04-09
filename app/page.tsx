"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(url, key);

export default function Home() {
  const [result, setResult] = useState("Not tested yet");

  const runTest = async () => {
    try {
      const { data, error } = await supabase.from("jobs").select("id").limit(1);

      if (error) {
        setResult(`Supabase error: ${error.message}`);
        return;
      }

      setResult(`Success. Rows returned: ${data?.length ?? 0}`);
    } catch (err: any) {
      setResult(`Fetch failed: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>Supabase Debug Test</h1>
      <div style={{ marginBottom: 12 }}>
        <strong>URL:</strong> {url || "missing"}
      </div>
      <div style={{ marginBottom: 12 }}>
        <strong>Key starts with:</strong> {key ? key.slice(0, 20) : "missing"}
      </div>
      <button onClick={runTest}>Run Supabase Test</button>
      <p style={{ marginTop: 20 }}>{result}</p>
    </div>
  );
}
