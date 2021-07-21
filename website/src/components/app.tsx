import './app.css';
import Sidebar from './sidebar/sidebar';

export default function App() {
  return (
    <>
      <Sidebar></Sidebar>

      <div className="app-navbar"></div>

      <div className="text-based-channel">
        {/* ng for message */}
        {/* <div className="message"></div> */}
        <div className="message-box"></div>
      </div>

      <div className="member-list">
        {/* ng for user */}
        {/* <div className="user-tab"></div> */}
      </div>
    </>
  );
}
