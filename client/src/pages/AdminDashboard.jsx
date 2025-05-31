import { useState } from "react";

export default function AdminDashboard() {
  const [currentCycle, setCurrentCycle] = useState("Fall 2025");
  const [round, setRound] = useState(1);
  const [assignedTasks, setAssignedTasks] = useState([]);

  const reviewers = ["Alice", "Bob", "Charlie"];
  const candidates = ["Jane Doe", "John Smith", "Emily Liu"];

  const handleAdvanceRound = () => {
    setRound((prev) => prev + 1);
  };

  const handleAssignTasks = () => {
    const tasks = candidates.map((candidate, i) => ({
      reviewer: reviewers[i % reviewers.length],
      candidate,
      task: "Review Resume",
    }));
    setAssignedTasks(tasks);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow space-y-6">
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>

      <div className="space-y-2">
        <p><strong>Current Cycle:</strong> {currentCycle}</p>
        <p><strong>Current Round:</strong> Round {round}</p>

        <button
          onClick={handleAdvanceRound}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Advance to Next Round
        </button>
      </div>

      <hr />

      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Assign Tasks</h3>
        <button
          onClick={handleAssignTasks}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Assign Resume Reviews
        </button>

        {assignedTasks.length > 0 && (
          <ul className="mt-4 list-disc list-inside space-y-1">
            {assignedTasks.map((task, idx) => (
              <li key={idx}>
                {task.reviewer} → {task.task} for {task.candidate}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}