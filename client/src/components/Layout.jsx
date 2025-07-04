import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main> 
        {children}
      </main>
    </div>
  );
}
