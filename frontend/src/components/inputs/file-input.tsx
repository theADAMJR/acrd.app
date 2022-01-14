import { ChangeEventHandler } from 'react';
import Input, { InputProps } from './input';

type FileInputProps = {
  onChange: ChangeEventHandler<HTMLInputElement>;
} & InputProps;
 
const FileInput: React.FunctionComponent<FileInputProps> = (props) => {
  return (
    <Input
      accept="image/*"
      className="pt-5"
      label={props.label ?? 'Image'}
      register={(): any => {}}
      type="file"
      {...props}
      onChange={props.onChange} />
  );
}
 
export default FileInput;