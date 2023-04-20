import {createContext} from 'react';
import {FormagusProps} from './Field.types';

export const FieldContext = createContext<Required<FormagusProps>>(null as any);

export const FieldContextProvider = FieldContext.Provider;
