import Sidebar from '../components/Sidebar.jsx';
import Dashboard from '../components/Dashboard.jsx';

function App() {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <Dashboard />
      </main>
    </div>
  );
}

export default App;