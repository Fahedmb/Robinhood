import ClientTable from "../components/ClientTable";

export default function Home() {
  return (
    <main className="min-h-screen p-4 sm:p-8">
      <h1 className="text-2xl font-semibold mb-4">Client Orders</h1>
      <ClientTable />
    </main>
  );
}
