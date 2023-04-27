import {useFormControllerClass} from '../Form/useFormControllerClass';

/** @deprecated */
export const useFormApi = () => {
  const controller = useFormControllerClass();

  return controller.API;
};
