import { Outlet } from "react-router-dom";
import { Footer } from "../../components/Footer/Footer";
import { Toaster } from "react-hot-toast";

export const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Toaster position="top-right" />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
