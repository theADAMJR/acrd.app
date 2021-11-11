import { FunctionComponent } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import Input from '../../inputs/input';
import NormalButton from '../../utils/buttons/normal-button';
import { sendVerifyCode } from '../../../store/auth';

interface VerifyCodeInputProps {}
 
const VerifyCodeInput: FunctionComponent<VerifyCodeInputProps> = () => {
  const dispatch = useDispatch();
  const verifyForm = useForm();
  const onVerify = () => dispatch(sendVerifyCode(verifyForm.getValues().code));
  
  return (
    <div>
      <hr className="border-gray-500 my-4" />
      <div className="flex items-end">
        <Input
          type="text" 
          name="code"
          label="Verify Code"
          className="w-full mr-2"
          register={verifyForm.register} />
        <NormalButton
          type="button"
          onClick={onVerify}
          className="bg-success text-black h-10">Verify</NormalButton>
      </div>
    </div>
  );
}
 
export default VerifyCodeInput;