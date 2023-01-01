import './file-input.scoped.css';
import { ChangeEventHandler } from 'react';
import Input, { InputProps } from './input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

type FileInputProps = {
  onChange: ChangeEventHandler<HTMLInputElement>;
} & InputProps;

const FileInput: React.FunctionComponent<FileInputProps> = (props) => {
  return (
    <label>
      <span className="icon">
        <FontAwesomeIcon icon={faUpload} />
      </span>
      <Input
        accept="image/*"
        className="pt-5"
        label={props.label ?? 'Image'}
        register={(): any => { }}
        type="file"
        {...props}
        onChange={props.onChange} />
    </label>
  );
}

export default FileInput;