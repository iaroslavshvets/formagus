import {useFormController} from '../Form/useFormController';

export const useFormApi = () => {
  const controller = useFormController();

  return controller.API;
};
