import Navbar from '../navbar/navbar';
import './home-page.scoped.css';

const HomePage: React.FunctionComponent = () => {
  return (
    <div>
      <Navbar />
      <main>
        <section>
          <h1>It's time to ditch Skype and TeamSpeak.</h1>
          <p className="lead">All-in-one voice and text chat.</p>
          <button className="bg-success text-dark">Login</button>
          <button className="bg-success text-dark">Open</button>
        </section>
      </main>
    </div>
  );
}
 
export default HomePage;