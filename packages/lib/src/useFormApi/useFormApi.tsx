import {useFormController} from '../Form';

export const useFormApi = () => {
  const controller = useFormController();

  return controller.API;
};
