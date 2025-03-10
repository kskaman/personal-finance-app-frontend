import MainApp from "./MainApp";
import LoginPage from "./pages/LoginPage";

const App = () => {
  const userToken = localStorage.getItem("userToken");

  return userToken ? <MainApp /> : <LoginPage />;
};

export default App;
