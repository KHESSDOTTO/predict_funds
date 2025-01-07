import { UserProvider } from '../userContext';
import { ControlFormProvider } from '../controlFormContext';
import { AppProviderProps } from './appProviderTypes';

export function AppProvider({
  children, 
  initialAncoras,
  user,
}: AppProviderProps) {
  const controlFormProviderProps = {
    initialAncoras: initialAncoras,
    initialCnpjs: user?.cnpjs,
    userCnpj: user?.cnpj,
  }

  return (
    <>
      <UserProvider>
        <ControlFormProvider {...controlFormProviderProps}>
            {children}
        </ControlFormProvider>
      </UserProvider>
    </>
  );
}
