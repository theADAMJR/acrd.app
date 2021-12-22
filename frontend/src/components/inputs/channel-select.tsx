import { Entity } from '@accord/types';
import { UseFormRegister, FieldValues } from 'react-hook-form';
import Select from 'react-select';

interface ChannelSelectProps {
  className?: string;
  channels: Entity.Channel[];
  label?: string;
  name: string;
  register: UseFormRegister<FieldValues>;
  options?: any;
};
 
const ChannelSelect: React.FunctionComponent<ChannelSelectProps> = (props) => {
  const channelOptions: any[] = props.channels
    .filter(c => c.type === 'TEXT')
    .map(c => ({ label: `#${c.name}`, value: c.id }));
  const options = [{
    label: 'None',
    value: '',
    color: 'var(--muted)',
  }].concat(channelOptions);
  
  const styles = {
    singleValue: () => ({ color: 'var(--font)' }),
    control: () => ({
      width: '100%',
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--bg-tertiary-alt)',
      borderRadius: '5px',
    }),
    option: (styles, { data }) => ({
      ...styles,
      color: data.color,
      backgroundColor: 'var(--bg-secondary)',
      cursor: 'pointer',
    }),
    input: (styles) => ({ ...styles, caretColor: 'transparent', height: '32px' }),
    menu: (styles) => ({
      ...styles,
      backgroundColor: 'var(--bg-secondary)',
    }),
    indicatorSeparator: () => ({ display: 'none' }),
    indicatorsContainer: (styles) => ({
      ...styles,
      float: 'right',
      marginTop: '-38px',
    }),            
  };

  const id = props.name + 'Input';

  return (
    <div className={props.className}>
      {props.label &&
        <label
          htmlFor={id}
          className="uppercase text-xs font-semibold">{props.label}</label>}
      <Select
        className="pt-2"
        placeholder="Select channel..."
        id={id}
        styles={styles}
        options={options}
        register={props.register?.(props.name, props.options)} />
    </div>
  );
}
 
export default ChannelSelect;