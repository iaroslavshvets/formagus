import {autorun} from 'mobx';
import {useState} from 'react';
import {useFormController} from '../Form';
import {useRunOnce} from './useRunOnce';
import type {FormAPI} from '../FormController';

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
