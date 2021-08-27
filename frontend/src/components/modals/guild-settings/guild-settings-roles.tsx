import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
 
const GuildSettingsRoles: React.FunctionComponent = () => {
  const guild = useSelector((s: Store.AppState) => s.ui.activeGuild)!;
  const dispatch = useDispatch();
  const { handleSubmit, setValue } = useForm();

  return (
    <form className="flex flex-col pt-14 px-10 pb-20 h-full mt-1">
      <header>
        <h1 className="text-xl font-bold inline">Roles</h1>
      </header>
    </form>
  );
}
 
export default GuildSettingsRoles;