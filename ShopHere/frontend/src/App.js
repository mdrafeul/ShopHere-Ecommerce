import { Home } from "./components/Home";
import { Footer } from "./components/layout/Footer";
import { Header } from "./components/layout/Header";

import{BrowserRouter as Router, Route} from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <Router>
        <Header/>
        <div className= 'container container-fluid'>
          <Route path='/' component={Home} exact/>
        </div>
        <Footer/>
      </Router>
    </div>
  );
}

export default App;
