import {cleanup, render} from '@testing-library/react';
import React from 'react';
import {Field, createFormController} from '../../src';
import {TestForm} from '../components/TestForm';
import {waitFor} from '../helpers/conditions';
import {InputAdapter} from '../components/InputAdapter';
import {createTestFormDriver} from '../components/TestForm.driver';
import {createInputAdapterDriver} from '../components/InputAdapter/InputAdapter.driver';

describe('Field meta', () => {
  afterEach(() => cleanup());

  it('isRegistered', () => {
    const formController = createFormController({});
    expect(formController.API.getFieldMeta(TestForm.FIELD_ONE_NAME).isMounted).toEqual(false);
    render(<TestForm controller={formController} />);
    expect(formController.API.getFieldMeta(TestForm.FIELD_ONE_NAME).isMounted).toEqual(true);
  });

  it('isActive', () => {
    const wrapper = render(<TestForm />).container;
    const fieldDriver = createInputAdapterDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

    expect(fieldDriver.get.meta('isActive')).not.toBe('true');

    fieldDriver.when.focus();
    expect(fieldDriver.get.meta('isActive')).toBe('true');

    fieldDriver.when.blur();
    expect(fieldDriver.get.meta('isActive')).not.toBe('true');
  });

  it('isTouched', () => {
    const wrapper = render(<TestForm />).container;
    const fieldDriver = createInputAdapterDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

    expect(fieldDriver.get.meta('isTouched')).not.toBe('true');

    fieldDriver.when.focus();
    expect(fieldDriver.get.meta('isTouched')).toBe('true');

    fieldDriver.when.blur();
    expect(fieldDriver.get.meta('isTouched')).toBe('true');
  });

  it('isDirty', () => {
    const wrapper = render(<TestForm />).container;
    const fieldDriver = createInputAdapterDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

    expect(fieldDriver.get.meta('isDirty')).toBe('false');

    fieldDriver.when.change('batman');

    expect(fieldDriver.get.meta('isDirty')).toBe('true');

    fieldDriver.when.change('');

    expect(fieldDriver.get.meta('isDirty')).toBe('false');
  });

  it('isChanged', () => {
    const wrapper = render(<TestForm />).container;
    const fieldDriver = createInputAdapterDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

    expect(fieldDriver.get.meta('isChanged')).toBe('false');

    fieldDriver.when.focus();
    expect(fieldDriver.get.meta('isChanged')).toBe('false');

    fieldDriver.when.change('batman');

    expect(fieldDriver.get.meta('isChanged')).toBe('true');

    fieldDriver.when.change('');

    expect(fieldDriver.get.meta('isChanged')).toBe('true');
  });

  it('customState', async () => {
    const formController = createFormController({});

    expect(formController.API.getFieldMeta(TestForm.FIELD_ONE_NAME).customState).toEqual({});

    const wrapper = render(<TestForm controller={formController} />).container;
    const fieldDriver = createInputAdapterDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});
    const CUSTOM_KEY = 'CUSTOM_KEY';
    const CUSTOM_VALUE = 'CUSTOM_VALUE';

    formController.API.setFieldCustomState(TestForm.FIELD_ONE_NAME, CUSTOM_KEY, CUSTOM_VALUE);

    expect(formController.API.getFieldMeta(TestForm.FIELD_ONE_NAME).customState[CUSTOM_KEY]).toBe(CUSTOM_VALUE);

    await waitFor(() => fieldDriver.get.meta(`customState:${CUSTOM_KEY}`) === CUSTOM_VALUE);
  });

  it('isValidating', async () => {
    const wrapper = render(
      <TestForm>
        <Field onValidate={jest.fn()} name={TestForm.FIELD_ONE_NAME} adapter={InputAdapter} />
      </TestForm>,
    ).container;

    const formDriver = createTestFormDriver({wrapper});
    const fieldDriver = createInputAdapterDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

    expect(fieldDriver.get.meta('isValidating')).not.toBe('true');

    formDriver.when.submit();

    expect(fieldDriver.get.meta('isValidating')).toBe('true');

    await waitFor(() => fieldDriver.get.meta('form:isValidating') === 'false');
  });
});
