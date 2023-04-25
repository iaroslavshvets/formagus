import {createContext} from 'react';
import {FormagusProps} from './Field.types';

export const FieldContext = createContext<FormagusProps | undefined>(undefined);

export const FieldContextProvider = FieldContext.Provider;
