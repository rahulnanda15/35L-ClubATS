import { useState } from "react";

export default function UserDashboard() {
  // Mock tasks assigned to the logged-in user
  const [tasks, setTasks] = useState([
    {
      id: 1,
      candidate: "Jane Doe",
      type: "Resume Review",
      completed: false,
    },
    {
      id: 2,
      candidate: "John Smith",
      type: "Cover Letter Review",
      completed: false,
    },
  ]);

  const handleComplete = (id) => {
    const updated = tasks.map((task) =>
      task.id === id ? { ...task, completed: true } : task
    );
    setTasks(updated);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow space-y-6">
      <h2 className="text-2xl font-bold">User Dashboard</h2>

      <p className="text-gray-600">Here are your assigned tasks:</p>

      <ul className="space-y-4">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="p-4 border rounded-lg flex justify-between items-center bg-gray-50"
          >
            <div>
              <p>
                <strong>{task.type}</strong> for{" "}
                <span className="text-blue-600">{task.candidate}</span>
              </p>
              {task.completed && (
                <p className="text-green-600 text-sm mt-1">✔ Task completed</p>
              )}
            </div>

            {!task.completed && (
              <button
                onClick={() => handleComplete(task.id)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Mark as Done
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}