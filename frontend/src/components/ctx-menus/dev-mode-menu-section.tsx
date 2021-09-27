import { faIdCard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FunctionComponent } from 'react';

interface DevModeMenuSectionProps {
  ids: { title: string, id: string }[];
}
 
const DevModeMenuSection: FunctionComponent<DevModeMenuSectionProps> = ({ ids }) => {
  return (
    <>
      <hr className="mt-3 border-bg-primary pt-2" />
      {ids.map(({ title, id }) => (
        <div key={id}>
          <div className="float-none -mb-1 text-xs">{title}</div>
          <div
            title={title}
            className="flex items-center justify-between pb-2">
            <span className="muted">{id}</span>
            <FontAwesomeIcon icon={faIdCard} />
          </div>
        </div>
      ))}
    </>
  );
}
 
export default DevModeMenuSection;