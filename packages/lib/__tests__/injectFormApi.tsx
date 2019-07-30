import * as React from 'react';
import {mount} from 'enzyme';
import {TestForm} from '../test/components/TestForm';
import {Field} from '../src/Field/Field';
import {InputAdapter} from '../test/components/InputAdapter';
import {FieldValueDisplay} from '../test/components/FieldValueDisplay/FieldValueDisplay';
import {createInputAdapterDriver} from '../test/components/InputAdapter/InputAdapter.driver';
import {createFieldValueDisplayDriver} from '../test/components/FieldValueDisplay/FieldValueDisplay.driver';

describe('inhectFormApi', () => {
  const TEST_INITIAL_VALUE = 'testtest';
  const NEW_VALUE = 'new-value';
  const INNER_FORM_COMPONENT_DATA_HOOK = 'inner-data-hook';

  it('should pass formApi with `injectFormApi` decorator', () => {
    const wrapper = mount(
      <TestForm
        initialValues={{
          [TestForm.FIELD_ONE_NAME]: TEST_INITIAL_VALUE,
        }}
      >
        <Field name={TestForm.FIELD_ONE_NAME} adapter={InputAdapter} />
        <FieldValueDisplay dataHook={INNER_FORM_COMPONENT_DATA_HOOK} displayedFieldName={TestForm.FIELD_ONE_NAME} />
      </TestForm>,
    );

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
