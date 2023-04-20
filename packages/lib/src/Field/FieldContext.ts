import {createContext} from 'react';
import {AdapterProps} from './Field.types';

export const FieldContext = createContext<Required<AdapterProps['formagus']>>(null as any);

export const FieldContextProvider = FieldContext.Provider;
