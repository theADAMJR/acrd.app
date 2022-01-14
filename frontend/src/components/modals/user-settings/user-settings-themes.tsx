import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { uploadFile } from '../../../store/api';
import { createTheme, deleteTheme, getTheme, unlockTheme, updateTheme } from '../../../store/themes';
import { openSaveChanges } from '../../../store/ui';
import { updateSelf } from '../../../store/users';
import FileInput from '../../inputs/file-input';
import Input from '../../inputs/input';
import SidebarIcon from '../../navigation/sidebar/sidebar-icon';
import CircleButton from '../../utils/buttons/circle-button';
import NormalButton from '../../utils/buttons/normal-button';
import SaveChanges from '../../utils/save-changes';

const UserSettingsThemes: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const selfUser = useSelector((s: Store.AppState) => s.auth.user);
  const themes = useSelector((s: Store.AppState) => s.entities.themes);
  const [themeId, setTab] = useState(selfUser.activeThemeId);
  const [addMode, enableAddMode] = useState(false);
  const [focusedInputId, setFocusedInputId] = useState('');
  
  const theme = getTheme(themeId, themes);
  useEffect(() => {
    if (!theme) setTab('default');
  }, [theme, themeId]);
  
  const refreshFocus = () => {
    if (!focusedInputId) return;

    const input: HTMLInputElement | null = document.querySelector(`#${focusedInputId}`);
    input?.focus();
  }

  const SideIcons: React.FunctionComponent = () => (
    <div className="flex items-center flex-col">
      {themes.map(t => (
        <div
          key={t.id}
          className="w-12"
          onClick={() => {
            enableAddMode(false);
            setTab(t.id);
          }}
          title={t.name}>
          <SidebarIcon
            childClasses={classNames('bg-bg-secondary', {
              'border-2 border-primary h-[3.1rem]': t.id === themeId,
            })}
            imageURL={t.iconURL}
            name={t.name}
            disableHoverEffect />
        </div>
      ))}
      <CircleButton
        className="m-2"
        onClick={() => enableAddMode(true)}
        style={{ color: 'var(--success)' }}>+</CircleButton>
    </div>
  );

  const ThemeDetails: React.FunctionComponent = () => {
    const { register, setValue, handleSubmit } = useForm();
    const theme = themes.find(t => t.id === themeId);
    if (!theme) return null;
  
    const onApply = () => dispatch(updateSelf({ activeThemeId: themeId }));
    const onDelete = () => {
      const confirmation = window.confirm('Are you sure you want to delete this theme?');
      if (confirmation) dispatch(deleteTheme(theme.id));
    };
    const onSave = (e) => {      
      const onUpdate = (payload) => dispatch(updateTheme(themeId, payload));
      handleSubmit(onUpdate)(e);
    };

    const AddTheme: React.FunctionComponent = () => {
      const [code, setCode] = useState('');

      return (
        <div className="px-5 ml-4">
          <header className="mb-5">
            <h1 className="text-3xl font-bold inline">Add Theme</h1>
            <p className="secondary">Add an existing theme with a shareable code.</p>
          </header>
          
          <div className="mb-10">
            <Input
              className="float-left w-1/3 mr-3 disabled"
              label="Code"
              name="code"
              register={register}
              placeholder="discord"
              onInput={e => setCode(e.currentTarget.value)} />
            <NormalButton
              className="bg-primary mt-8"
              onClick={() => {
                enableAddMode(false);
                dispatch(unlockTheme(code, (theme) => setTab(theme.id)));
              }}>Add</NormalButton>
          </div>

          <h2 className="text-3xl font-bold">Create Theme</h2>
          <p className="secondary mb-2">Create your own theme.</p>

          <NormalButton
            className="bg-success dark"
            onClick={() => {
              enableAddMode(false);
              dispatch(createTheme({ name: 'New Theme' }, (theme) => setTab(theme.id)));
            }}>Create</NormalButton>
        </div>
      );
    };

    if (addMode) return <AddTheme />;
    
    return (themeId) ? (
      <div className="px-5 ml-4">
        <form
          onChange={() => dispatch(openSaveChanges(true))}
          className="flex flex-col h-full mt-1 mb-5">
          <header className="mb-5">
            <h1 className="text-3xl font-bold inline">{theme.name}</h1>
          </header>

          <div className="flex">
            <Input
              className="w-1/3 mr-5"
              label="Name"
              name="name"
              register={register}
              setFocusedInputId={setFocusedInputId}
              options={{ value: theme.name }} />
            <Input
              tooltip="The code that is used to share themes."
              className="w-1/3 mr-5"
              label="Code"
              name="code"
              register={register}
              options={{ value: theme.code }}
              setFocusedInputId={setFocusedInputId}
              disabled />
            <FileInput
              className="w-1/3"
              name="iconURL"
              label="Icon"
              options={{ value: theme.iconURL }}
              tooltip="An optional icon for your theme."
              setFocusedInputId={setFocusedInputId}
              onChange={(e) => {
                const file = e.currentTarget?.files?.[0];
                if (!file) return;
                
                dispatch(uploadFile(file, ({ url }) => {
                  dispatch(updateTheme(themeId, { iconURL: url }));
                }));
              }} />
          </div>

          <textarea
            className="p-2 rounded bg-bg-secondary outline-none border-bg-tertiary hover:border w-1/2 mt-2"
            defaultValue={theme.styles}
            onFocus={(e) => setFocusedInputId?.(e.currentTarget.id)}
            {...register('styles', { value: theme.styles })} />

          <SaveChanges
            onOpen={refreshFocus}
            setValue={setValue}
            onSave={onSave}
            obj={theme} />
        </form>

        <NormalButton
          className="bg-success dark mt-5"
          onClick={onApply}>Apply</NormalButton>
        {(selfUser.id === theme.creatorId) && (
          <NormalButton
            className="bg-danger dark mt-5 ml-2"
            onClick={onDelete}>Delete</NormalButton>
        )}
      </div>
    ) : null;
  }

  return (
    <div className="grid grid-cols-12 flex-col pt-14 px-10 pb-20 h-full mt-1 gap-6">
      <div className="col-span-1"><SideIcons /></div>
      <div className="col-span-11"><ThemeDetails /></div>
    </div>
  );
}
 
export default UserSettingsThemes;