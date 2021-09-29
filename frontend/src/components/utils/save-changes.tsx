import { useSnackbar } from 'notistack';
import React from 'react';
import { useEffect } from 'react';
import { UseFormSetValue, FieldValues } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { openSaveChanges } from '../../store/ui';
import NormalButton from './buttons/normal-button';

export interface SaveChangesProps {
  onSave: (e) => any;
  setValue?: UseFormSetValue<FieldValues>;
  obj: object;
}
 
const SaveChanges: React.FunctionComponent<SaveChangesProps> = (props) => {
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const isOpen = useSelector((s: Store.AppState) => s.ui.saveChangesOpen);

  useEffect(() => {
    if (!isOpen) return;

    enqueueSnackbar('', {
      anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
      content: SaveChanges,
      key: 'saveChanges',
      persist: true,
    });
  }, [isOpen]);

  const onClickSave = (e) => {
    closeSnackbar('saveChanges');
    props.onSave(e);
    dispatch(openSaveChanges(false));
  };
  const onClickReset = () => {
    closeSnackbar('saveChanges');
    for (const key in props.obj)
      props.setValue?.(key, props.obj[key]);
    dispatch(openSaveChanges(false));
  };
  const SaveChanges = () => (
    <div
      id="saveChanges"
      className="flex justify-between rounded bg-black p-3 px-5"
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