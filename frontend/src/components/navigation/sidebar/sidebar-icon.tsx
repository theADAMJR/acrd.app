import { useLocation } from 'react-router-dom';
import environment from '../../../environment';
import { getAbbr } from '../../../store/guilds';

import './sidebar-icon.scoped.css';

export interface SidebarIconProps {
  imageURL?: string;
  name: string;
  to?: string;
  classes?: string;
}

const SidebarIcon: React.FunctionComponent<SidebarIconProps> = (props) => {
  let { to, imageURL, name, classes = 'heading' } = props;
  const location = useLocation();
  if (imageURL)
    imageURL = `${environment.rootAPIURL}${imageURL}`;
  
  const Icon = () => (imageURL)
    ? <img
        className="h-12 w-12"
        src={imageURL}
        alt={name} />
    : <span className={`select-none flex items-center justify-center h-12 w-12`}>
        {getAbbr(name)}
      </span>;  
  
  const isActive = to && location.pathname.startsWith(to);
  const activeClasses = (isActive)
    ? 'rounded-xl bg-primary'
    : 'rounded-full bg-bg-primary';
    
  return (
    <div className={`wrapper ${isActive && 'active'}`}>
      <div className="selected rounded bg-white absolute -left-1 h-0 w-2" />
      <div className={`cursor-pointer guild-icon flex justify-center mb-2 ${activeClasses} ${classes}`}>
        <Icon />
      </div>
    </div>
  );
}
 
export default SidebarIcon;