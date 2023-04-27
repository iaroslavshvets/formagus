import {cleanup, render} from '@testing-library/react';
import React from 'react';
import {TestForm} from '../components/TestForm';
import {Field} from '../../src/Field/Field';
import {Input} from '../components/Input';
import {FieldValueDisplayWithHook, createFieldValueDisplayDriver} from '../components/FieldValueDisplay';
import {createInputAdapterDriver} from '../components/Input/InputAdapter.driver';

// TODO: fix this test
describe('useFormController', () => {
  afterEach(() => cleanup());

  const TEST_INITIAL_VALUE = 'testtest';
  const NEW_VALUE = 'new-value';
  const INNER_FORM_COMPONENT_DATA_HOOK = 'inner-data-hook';

  it('should pass formApi with `useFormApi` hook', () => {
    const wrapper = render(
      <TestForm
        initialValues={{
          [TestForm.FIELD_ONE_NAME]: TEST_INITIAL_VALUE,
        }}
      >
        <Field name={TestForm.FIELD_ONE_NAME}>
          <Input />
        </Field>
        <FieldValueDisplayWithHook
          dataHook={INNER_FORM_COMPONENT_DATA_HOOK}
          displayedFieldName={TestForm.FIELD_ONE_NAME}
        />
      </TestForm>,
    ).container;

    const fieldDriver = createInputAdapterDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});
    const FieldValueDisplayDriver = createFieldValueDisplayDriver({
      wrapper,
      dataHook: INNER_FORM_COMPONENT_DATA_HOOK,
    });

    expect(FieldValueDisplayDriver.get.text()).toEqual(TEST_INITIAL_VALUE);

    fieldDriver.when.change(NEW_VALUE);

    expect(FieldValueDisplayDriver.get.text()).toEqual(NEW_VALUE);
  });
});
