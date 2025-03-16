import {createContext} from 'react';
import {type FieldApi} from './Field.types';

export const FieldContext = createContext<FieldApi | null>(null);

export const FieldContextProvider = FieldContext.Provider;
