import {createContext} from 'react';
import {FieldFormagus} from './Field.types';

export const FieldContext = createContext<FieldFormagus | undefined>(undefined);

export const FieldContextProvider = FieldContext.Provider;
