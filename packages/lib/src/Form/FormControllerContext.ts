import {type Context, createContext} from 'react';
import {type FormControllerClass} from '../FormControllerClass/FormControllerClass';

export const FormControllerContext: Context<FormControllerClass> = createContext(null as any);
