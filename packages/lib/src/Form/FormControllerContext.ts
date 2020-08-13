import React from 'react';
import type {FormController} from '../FormController';

export const FormControllerContext: React.Context<FormController> = React.createContext(null as any);
