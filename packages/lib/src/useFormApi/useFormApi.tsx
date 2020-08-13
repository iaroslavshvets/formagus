import {autorun} from 'mobx';
import {useEffect, useState} from 'react';
import {useFormController} from '../Form';
import type {FormAPI} from '../FormController';

export const useFormApi = () => {
  const controller = useFormController();
  const [api, setApi] = useState<FormAPI>(() => controller.API);

  useEffect(() => {
    return autorun(() => {
      setApi(controller.API);
    });
  }, []);

  return api;
};
