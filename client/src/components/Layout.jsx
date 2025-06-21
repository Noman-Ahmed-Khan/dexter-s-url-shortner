import Navbar from "./navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="pt-16"> 
        {children}
      </main>
    </div>
  );
}
