import { CSSProperties, FunctionComponent } from 'react';
import TabLink from './tab-link';

type Tab = { name: JSX.Element | string, id: string, perm?: string };

interface NavTabsProps {
  activeLinkStyle?: CSSProperties;
  className?: string;
  tabs: Tab[];
  tab: string;
  linkStyle?: CSSProperties;
  setTab: React.Dispatch<React.SetStateAction<string>>;
  predicate?: (t: Tab) => boolean;
}
 
const NavTabs: FunctionComponent<NavTabsProps> = ({ className, tabs, setTab, tab, predicate, linkStyle, activeLinkStyle }) => {
  return (
    <div className={className}>
      {tabs.map(t => (!predicate || predicate?.(t)) && (
        <TabLink
          style={{
            ...linkStyle,
            ...(t.id === tab ? activeLinkStyle : {}),
          }}
          tab={tab}
          setTab={setTab}
          id={t.id}
          key={t.id}>{t.name}</TabLink>
      ))}
    </div>
  );
}
 
export default NavTabs;