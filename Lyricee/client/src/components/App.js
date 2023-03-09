import '../styles/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Login';
import Dashboard from './Dashboard';
//access code from url param 
const code = new URLSearchParams(window.location.search).get("code");

function App() {
  //if code is null, redirect to login page
  // return <Login/>
  return code ? <Dashboard code={code} /> : <Login />
  
}

export default App;
