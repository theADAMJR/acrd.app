import { CSSProperties, FunctionComponent } from 'react';
import TabLink from './tab-link';

type Tab = { name: string, id: string, perm?: string };

interface NavTabsProps {
  className?: string;
  tabs: Tab[];
  tab: string;
  setTab: React.Dispatch<React.SetStateAction<string>>;
  linkStyle?: CSSProperties;
  activeLinkStyle?: CSSProperties;
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