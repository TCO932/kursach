import '../css/App.css';


function Register() {
  return <button id="register">
    register
  </button>
}

function LogOut() {
  return <button id="logout">
    logout
  </button>
}

function LogIn() {
  return <button id="login">
    login
  </button>
}

function Menu() {
  return <div className="menu">
    <div className="menu" id="rect" />
    <div className="menu" id="bar1" />
    <div className="menu" id="bar2" />
    <div className="menu" id="bar3" />
  </div>
}
function SelectAll(props){

}

function ToolBar(){
  return <div id="toolBar">
    <Menu/>
    <LogIn/>
    <LogOut/>
    <Register/>
  </div>
}

function App() {
  return (
    <div className="App">
      <ToolBar/>
    </div>
  );
}

export default App;
