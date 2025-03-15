import {createContext} from 'react';
import {type FieldApi} from './Field.types';

export const FieldContext = createContext<FieldApi | undefined>(undefined);

export const FieldContextProvider = FieldContext.Provider;
