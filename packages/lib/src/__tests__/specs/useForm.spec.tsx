import {cleanup, render} from '@testing-library/react';
import React from 'react';
import {TestForm} from '../components/TestForm';
import {Field} from '../../Field/Field';
import {Input} from '../components/Input';
import {createFieldValueDisplayDriver, FieldValueDisplay} from '../components/FieldValueDisplay';
import {createInputDriver} from '../components/Input/createInputDriver';
import {set} from 'lodash';
import {UseFormDisplay} from '../components/UseFormDisplay/UseFormDisplay';
import {createUseFormDisplayDriver} from '../components/UseFormDisplay/createUseFormDisplayDriver';

describe('useForm', () => {
  afterEach(() => {
    cleanup();
  });

  const TEST_INITIAL_VALUE = 'test value';

  it('should pass FormApi to fields via `useForm()`', async () => {
    const INNER_FORM_COMPONENT_DATA_HOOK = 'inner-data-hook';
    const NEW_VALUE = 'new-value';

    const wrapper = render(
      <TestForm
        initialValues={{
          [TestForm.FIELD_ONE_NAME]: TEST_INITIAL_VALUE,
        }}
      >
        <Field name={TestForm.FIELD_ONE_NAME}>
          <Input />
        </Field>
        <FieldValueDisplay dataHook={INNER_FORM_COMPONENT_DATA_HOOK} displayedFieldName={TestForm.FIELD_ONE_NAME} />
      </TestForm>,
    ).container;

    const fieldDriver = createInputDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

    const fieldValueDisplayDriver = createFieldValueDisplayDriver({
      wrapper,
      dataHook: INNER_FORM_COMPONENT_DATA_HOOK,
    });

    expect(fieldValueDisplayDriver.getText()).toEqual(TEST_INITIAL_VALUE);

    await fieldDriver.when.change(NEW_VALUE);

    expect(fieldValueDisplayDriver.getText()).toEqual(NEW_VALUE);
  });

  it('should have access to initialValues via `useForm()`', async () => {
    const DATA_HOOK = 'form-display';
    const initialValues = set({}, TestForm.FIELD_NESTED_NAME, TEST_INITIAL_VALUE);

    const wrapper = render(
      <TestForm initialValues={initialValues}>
        <UseFormDisplay dataHook={DATA_HOOK} />
      </TestForm>,
    ).container;

    const formDisplay = createUseFormDisplayDriver({wrapper, dataHook: DATA_HOOK});

    expect(formDisplay.getValue('initialValues')).toEqual({root: {field: {nested: 'test value'}}});
  });
});
