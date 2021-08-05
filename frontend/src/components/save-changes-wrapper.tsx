import { SnackbarProvider } from 'notistack';
import { createRef, useRef } from 'react';

const SaveChangesWrapper: React.FunctionComponent = (props) => {
  const providerRef = useRef();

  return (
    <SnackbarProvider
      action={(key) => <button>Dismiss</button>}
      preventDuplicate>
      {props.children}
    </SnackbarProvider>
  );
}
 
export default SaveChangesWrapper;