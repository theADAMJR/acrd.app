import { useSnackbar } from 'notistack';
import { FunctionComponent, useEffect } from 'react';
import { useSelector } from 'react-redux';

interface UIDialogProps {
  
}
 
const UIDialog: FunctionComponent<UIDialogProps> = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const dialog = useSelector((s: Store.AppState) => s.ui.openDialog);

  useEffect(() => {
    if (!dialog) return closeSnackbar('dialog');
    if (dialog.content === 'User not logged in') return;

    alert(dialog.content);
    // FIXME:
    // enqueueSnackbar({
    //   anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
    //   content: dialog.content,
    //   key: 'dialog',
    //   persist: true,
    //   variant: dialog.variant,   
    // });
  }, [dialog]);
  
  return null;
}
 
export default UIDialog;