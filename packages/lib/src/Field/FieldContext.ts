import {createContext} from 'react';
import {type FormagusField} from './Field.types';

export const FieldContext = createContext<FormagusField | undefined>(undefined);

export const FieldContextProvider = FieldContext.Provider;
