import NormalButton from './buttons/normal-button';

export interface SaveChangesProps {
  onReset: () => any;
  onSave: () => any;
}

// FIXME: why does this not work with notistack?
const SaveChanges: React.FunctionComponent<SaveChangesProps> = ({ onReset, onSave }) => {
  return (
    <div className="rounded bg-bg-tertiary opacity-75">
      <span>Careful — you have unsaved changes!</span>
      <span className="float-right">
        <NormalButton
          className="bg-transparent text-black"
          onClick={onReset}>Reset</NormalButton>
        <NormalButton
          className="bg-success text-black ml-2"
          onClick={onSave}>Save</NormalButton>
      </span>
    </div>
  );
}
 
export default SaveChanges;