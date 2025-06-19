import { useEffect, useState } from "react";

export interface Client {
  id: number;
  name: string;
  payment: number;
  orderDate: string; // ISO date string
  status: "done" | "pending";
  referral: string;
}

export default function ClientTable() {
  const [clients, setClients] = useState<Client[]>([]);
  const [editing, setEditing] = useState<Client | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);

  const emptyClient: Client = {
    id: Date.now(),
    name: "",
    payment: 0,
    orderDate: new Date().toISOString().substring(0, 10),
    status: "pending",
    referral: "",
  };

  const [form, setForm] = useState<Client>(emptyClient);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "payment" ? Number(value) : value });
  }

  function addOrUpdateClient(e: React.FormEvent) {
    e.preventDefault();
    if (editing) {
      setClients((prev) => prev.map((c) => (c.id === editing.id ? form : c)));
      setEditing(null);
    } else {
      setClients((prev) => [...prev, form]);
    }
    setForm({ ...emptyClient, id: Date.now() });
    setShowModal(false);
  }

  function editClient(client: Client) {
    setEditing(client);
    setForm(client);
    setShowModal(true);
  }

  function deleteClient(id: number) {
    setClients((prev) => prev.filter((c) => c.id !== id));
  }

  function daysRemaining(orderDate: string) {
    const due = new Date(orderDate);
    due.setMonth(due.getMonth() + 1);
    const diff = due.getTime() - now;
    return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
  }

  const totalDone = clients
    .filter((c) => c.status === "done")
    .reduce((sum, c) => sum + c.payment, 0);
  const totalPending = clients
    .filter((c) => c.status === "pending")
    .reduce((sum, c) => sum + c.payment, 0);

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => {
            setEditing(null);
            setForm({ ...emptyClient, id: Date.now() });
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow"
        >
          Add Client
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm table-auto border border-gray-200 dark:border-gray-700">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Payment</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Days Left</th>
              <th className="p-2 text-left">Referral</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="odd:bg-gray-50 dark:odd:bg-gray-800">
                <td className="p-2">{client.name}</td>
                <td className="p-2">{client.payment.toFixed(2)}</td>
                <td className="p-2 capitalize">{client.status}</td>
                <td className="p-2">{daysRemaining(client.orderDate)}</td>
                <td className="p-2">{client.referral}</td>
                <td className="p-2 flex gap-2">
                  <button
                    onClick={() => editClient(client)}
                    className="text-blue-600 underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteClient(client.id)}
                    className="text-red-600 underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-200 dark:bg-gray-700 font-semibold">
              <td className="p-2">Totals</td>
              <td className="p-2">{(totalDone + totalPending).toFixed(2)}</td>
              <td className="p-2" colSpan={2}>
                Done: {totalDone.toFixed(2)} | Pending: {totalPending.toFixed(2)}
              </td>
              <td className="p-2" colSpan={2}></td>
            </tr>
          </tfoot>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <form
            onSubmit={addOrUpdateClient}
            className="bg-white dark:bg-zinc-800 p-6 rounded shadow space-y-4 w-full max-w-md"
          >
            <h2 className="text-lg font-semibold">
              {editing ? "Edit Client" : "Add Client"}
            </h2>
            <input
              className="border p-2 rounded w-full"
              name="name"
              placeholder="Client name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              className="border p-2 rounded w-full"
              type="number"
              name="payment"
              placeholder="Payment amount"
              value={form.payment}
              onChange={handleChange}
              required
            />
            <input
              className="border p-2 rounded w-full"
              type="date"
              name="orderDate"
              value={form.orderDate}
              onChange={handleChange}
              required
            />
            <select
              className="border p-2 rounded w-full"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="pending">Pending</option>
              <option value="done">Done</option>
            </select>
            <input
              className="border p-2 rounded w-full"
              name="referral"
              placeholder="Referral source"
              value={form.referral}
              onChange={handleChange}
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setEditing(null);
                }}
                className="px-3 py-1 rounded border"
              >
                Cancel
              </button>
              <button type="submit" className="px-3 py-1 rounded bg-blue-600 text-white">
                {editing ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
