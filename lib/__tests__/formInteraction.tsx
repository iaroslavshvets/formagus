import * as React from 'react';
import {mount} from 'enzyme';
import {Field} from '../src/Field';
import {FormController} from '../src/FormController';
import {InputAdapter} from '../test/components/InputAdapter';
import {TestForm} from '../test/components/TestForm';
import {createInputAdapterDriver} from '../test/components/InputAdapter/InputAdapter.driver';

describe('Form interaction', async () => {
  it('should reset values', async () => {
    const controller = new FormController({
      initialValues: {
        [TestForm.FIELD_ONE_NAME]: 'batman is cool',
      },
    });
    const wrapper = mount(
      <TestForm controller={controller}>
        <Field name={TestForm.FIELD_ONE_NAME} adapter={InputAdapter} />
      </TestForm>,
    );

    const fieldDriver = createInputAdapterDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

    expect(fieldDriver.get.value()).toBe('batman is cool');

    fieldDriver.when.change('harvy is cool');

    expect(fieldDriver.get.meta('form:isTouched')).toBe('true');

    expect(fieldDriver.get.value()).toBe('harvy is cool');

    controller.API.reset();

    expect(fieldDriver.get.meta('form:isTouched')).toBe('false');
    expect(fieldDriver.get.value()).toBe('batman is cool');
  });

  it('should clear values', async () => {
    const controller = new FormController({
      initialValues: {
        [TestForm.FIELD_ONE_NAME]: 'batman is cool',
      },
    });
    const wrapper = mount(
      <TestForm controller={controller}>
        <Field name={TestForm.FIELD_ONE_NAME} adapter={InputAdapter} />
      </TestForm>,
    );

    const fieldDriver = createInputAdapterDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

    expect(fieldDriver.get.value()).toBe('batman is cool');

    controller.API.clear();

    expect(fieldDriver.get.meta('form:isTouched')).toBe('false');

    expect(fieldDriver.get.value()).toBe('');
  });

  it('should clear values', async () => {
    const controller = new FormController({
      initialValues: {
        [TestForm.FIELD_ONE_NAME]: 'batman is cool',
      },
    });
    const wrapper = mount(
      <TestForm controller={controller}>
        <Field name={TestForm.FIELD_ONE_NAME} adapter={InputAdapter} />
      </TestForm>,
    );

    const fieldDriver = createInputAdapterDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

    expect(fieldDriver.get.value()).toBe('batman is cool');

    controller.API.setFieldValue(TestForm.FIELD_ONE_NAME, 'joker is so cool');

    expect(fieldDriver.get.meta('form:isTouched')).toBe('false');

    expect(fieldDriver.get.value()).toBe('joker is so cool');
  });
});
