import { Link } from 'react-router-dom';
import Navbar from '../navigation/navbar';
import './home-page.scoped.css';

const HomePage: React.FunctionComponent = () => {  
  return (
    <div style={{height: '100vh'}} className="bg-bg-tertiary">
      <Navbar />
      <main>
        <section>
          <h1>It's time to ditch Skype and TeamSpeak.</h1>
          <p className="lead font-light mt-2">All-in-one voice and text chat.</p>
          <button className="shadow-md bg-green text-dark">
            <Link to="/login" >Login</Link>
          </button>
          <button className="shadow-md bg-green text-dark ml-2">
            <Link to="/channels/@me">App</Link>
          </button>
        </section>
      </main>
    </div>
  );
}
 
export default HomePage;