import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { UseFormSetValue, FieldValues } from 'react-hook-form';
import NormalButton from './buttons/normal-button';

export interface SaveChangesProps {
  onSave: (e) => any;
  setValue: UseFormSetValue<FieldValues>;
  obj: object;
}
 
const SaveChanges: React.FunctionComponent<SaveChangesProps> = (props) => {
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    enqueueSnackbar('', {
      anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
      content: SaveChanges,
      key: 'saveChanges',
      persist: true,
    });
  }, []);

  const onClickSave = (e) => {
    closeSnackbar('saveChanges');
    props.onSave(e);
  };
  const onClickReset = () => {
    closeSnackbar('saveChanges');
    for (const key in props.obj)
      props.setValue(key, props.obj[key]);
  };
  const SaveChanges = () => (
    <div
      className="flex justify-between rounded  p-3 px-5 bg-black"
      style={{ width: '50vw' }}>
      <span className="flex items-center flex-grow-1">Careful — you have unsaved changes!</span>
      <span>
        <NormalButton
          className="bg-transparent font"
          onClick={onClickReset}>Reset</NormalButton>
        <NormalButton
          className="bg-success text-black ml-2"
          onClick={onClickSave}>Save</NormalButton>
      </span>
    </div>
  );

  return null;
}
 
export default SaveChanges;