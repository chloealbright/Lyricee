import '../styles/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Login';
import Dashboard from './Dashboard';
//access code from url param 
const code = new URLSearchParams(window.location.search).get("code");

function App() {
  //if code is null, redirect to login page
  // return <Login/>
  //set background
  const Background = require('../assets/retrodrive.gif');
  return (
  <div style={{
    height: '100vh',
    backgroundImage: `url(${Background})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: 'cover'
  }}>
  {code ? <Dashboard code={code} /> : <Login />}
  </div>)
  
}

export default App;
