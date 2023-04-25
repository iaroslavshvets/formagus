import React from 'react';
import type {FormControllerClass} from '../FormController/FormControllerClass';

export const FormControllerContext: React.Context<FormControllerClass> = React.createContext(null as any);
