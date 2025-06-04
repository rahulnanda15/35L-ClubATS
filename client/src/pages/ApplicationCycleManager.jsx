// File: client/src/pages/ApplicationCycleManager.jsx

import React, { useState, useEffect } from "react";
import axios from "../utils/api";
import "../styles/ApplicationCycleManager.css";

export default function ApplicationCycleManager() {
  const [cycles, setCycles] = useState([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch all cycles on mount
  useEffect(() => {
    fetchCycles();
  }, []);

  const fetchCycles = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/application-cycles");
      setCycles(res.data || []);
    } catch (err) {
      console.error("Error fetching cycles:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add a new cycle
  const handleAddCycle = async () => {
    if (!newName.trim()) return;
    try {
      await axios.post("/application-cycles", { name: newName.trim() });
      setNewName("");
      fetchCycles();
    } catch (err) {
      console.error("Error adding cycle:", err);
    }
  };

  // Toggle active/inactive
  const toggleStatus = async (id, isActive) => {
    try {
      await axios.patch(`/application-cycles/${id}`, {
        active: !isActive,
      });
      fetchCycles();
    } catch (err) {
      console.error("Error toggling status:", err);
    }
  };

  return (
    <div className="application-cycles-container">
      {/* HEADER */}
      <div className="cycles-header">
        <h1>Application Cycles</h1>

        <div className="cycles-add-form">
          <input
            type="text"
            placeholder="New cycle name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button onClick={handleAddCycle}>Add Cycle</button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      {loading ? (
        <p className="cycles-loading">Loading cycles…</p>
      ) : cycles.length === 0 ? (
        <p className="cycles-empty">No cycles yet. Add one above!</p>
      ) : (
        <div className="cycles-grid">
          {cycles.map((cycle) => (
            <div key={cycle.id} className="cycle-card">
              {/* LEFT: Name + Status */}
              <div className="cycle-info">
                <h2>{cycle.name}</h2>
                <span
                  className={`status-badge ${
                    cycle.active ? "status-active" : "status-inactive"
                  }`}
                >
                  {cycle.active ? "Active" : "Inactive"}
                </span>
              </div>

              {/* RIGHT: Activate / Deactivate */}
              <button
                onClick={() => toggleStatus(cycle.id, cycle.active)}
                className={`toggle-btn ${
                  cycle.active ? "toggle-active" : "toggle-inactive"
                }`}
              >
                {cycle.active ? "Deactivate" : "Activate"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}