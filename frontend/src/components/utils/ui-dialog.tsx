import { useSnackbar } from 'notistack';
import { FunctionComponent, useEffect } from 'react';
import { useSelector } from 'react-redux';
 
const UIDialog: FunctionComponent = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const dialog = useSelector((s: Store.AppState) => s.ui.openDialog);

  useEffect(() => {
    if (!dialog) return closeSnackbar('dialog');
    if (dialog.content === 'User not logged in') return;
  
    enqueueSnackbar({
      anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
      content: dialog.content,
      key: 'dialog',
      persist: true,
      variant: dialog.variant,   
    });
  }, [dialog]);
  
  return null;
}
 
export default UIDialog;