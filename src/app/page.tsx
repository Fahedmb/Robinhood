import ClientTable from "../components/ClientTable";

export default function Home() {
  return (

    <main className="min-h-screen p-4 sm:p-8 flex flex-col items-center space-y-4">
      <h1 className="text-2xl font-semibold">Client Orders</h1>

      <ClientTable />
    </main>
  );
}
