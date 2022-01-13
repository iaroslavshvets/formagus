import {autorun} from 'mobx';
import {useState} from 'react';
import {useFormController} from '../Form';
import type {FormAPI} from '../FormController';
import {useRunOnce} from './useRunOnce';

export const useFormApi = () => {
  const controller = useFormController();
  const [api, setApi] = useState<FormAPI>(() => controller.API);

  useRunOnce(() => {
    return autorun(() => {
      setApi(controller.API);
    });
  });

  return api;
};
