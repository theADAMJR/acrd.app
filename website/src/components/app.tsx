import AppNavbar from './app-navbar';
import './app.css';
import Guild from './guild';
import Sidebar from './sidebar';
import { temp } from '../utils/src/temp';

export default function App() {
  const guild = temp.guilds[0];

  return (
    <>
      <Sidebar />
      <div className="content background-primary">
        <AppNavbar guild={guild} channel={temp.channels[0]} />
        <Guild guild={guild} />
      </div>
    </>
  );
}
