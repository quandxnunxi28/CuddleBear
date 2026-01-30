import { Header, Footer } from './components/layout';
import { AppRoutes } from './routes/AppRoutes';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}

export default App;
