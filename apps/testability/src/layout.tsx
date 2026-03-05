import {Footer} from "./components/Footer";
import {Header} from "./components/Header";
import {MainContent} from "./components/MainContent";

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <MainContent />
      </main>
      <Footer />
    </div>
  );
}
