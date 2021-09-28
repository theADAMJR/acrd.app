import Select from 'react-select';

interface ScarceSelectProps {
  mapOptions: (entity: any) => { label: string, value: string, color: string };
  onChange: (select: HTMLSelectElement) => void;
  unadded: any[];
}
 
const ScarceSelect: React.FunctionComponent<ScarceSelectProps> = (props) => {
  const colorStyles = {
    singleValue: () => ({ display: 'none' }),
    control: () => ({
      width: '100%',
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: '5px',
    }),
    option: (styles, { data }) => ({
      ...styles,
      color: data.color,
      backgroundColor: 'var(--bg-secondary)',
      cursor: 'pointer',
    }),
    input: (styles) => ({ ...styles, color: 'var(--font)' }),
    menu: (styles) => ({
      ...styles,
      backgroundColor: 'var(--bg-secondary)',
    }),
    multiValue: (styles) => ({
      ...styles,
      color: 'var(--font)',
      backgroundColor: 'var(--bg-tertiary)',
    }),
    indicatorSeparator: () => ({ display: 'none' }),
    indicatorsContainer: (styles) => ({ ...styles, float: 'right' }),
    multiValueLabel: (styles, { data }) => ({
      ...styles,
      color: data.color,
      backgroundColor: 'var(--bg-tertiary)',
    }),
  };

  return (
    <Select
      placeholder="Add role..."
      options={props.unadded.map(props.mapOptions)}
      styles={colorStyles}
      onChange={props.onChange} 
      noOptionsMessage={() => 'All roles have been added'} />
  );
}
 
export default ScarceSelect;