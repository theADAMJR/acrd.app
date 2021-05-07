const defaultValues = {
  sfxEnabled: true,
  memberListExpanded: true,
  theme: 'HORIZON',
  
}

for (const key in defaultValues) {
  const currentValue = localStorage.getItem(key);
  if (currentValue) continue;
  
  localStorage.setItem(key, defaultValues[key].toString());
}

export function getConfig(key: ConfigKey): boolean {
  return localStorage.getItem(key as string) == 'true';
}
export function getConfigValue(key: ConfigKey): string {
  return localStorage.getItem(key as string);
}
export function setConfig(key: ConfigKey, value: any) {
  localStorage.setItem(key as string, value.toString());
}

type ConfigKey = keyof typeof defaultValues;
