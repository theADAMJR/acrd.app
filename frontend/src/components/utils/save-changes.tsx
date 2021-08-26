import NormalButton from './buttons/normal-button';

export interface SaveChangesProps {
  id: string;
  onReset: (e) => any;
  onSave: (e) => any;
}

// FIXME: why does this not work with notistack?
const SaveChanges: React.FunctionComponent<SaveChangesProps> = (props) => {
  return (
    <div
      id={props.id}
      className="flex justify-between rounded  p-3 px-5 bg-black"
      style={{ width: '50vw' }}>
      <span className="flex items-center flex-grow-1">Careful — you have unsaved changes!</span>
      <span>
        <NormalButton
          className="bg-transparent font"
          onClick={props.onReset}>Reset</NormalButton>
        <NormalButton
          className="bg-success text-black ml-2"
          onClick={props.onSave}>Save</NormalButton>
      </span>
    </div>
  );
}
 
export default SaveChanges;