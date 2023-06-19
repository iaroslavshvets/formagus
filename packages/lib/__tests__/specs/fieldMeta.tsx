import {act, cleanup, render} from '@testing-library/react';
import React from 'react';
import {reaction} from 'mobx';
import {Field, createFormController} from '../../src';
import {TestForm} from '../components/TestForm';
import {Input} from '../components/Input';
import {createTestFormDriver} from '../components/createTestFormDriver';
import {createInputDriver} from '../components/Input/createInputDriver';
import {eventually} from '../helpers/eventually';

describe('Field meta', () => {
  afterEach(() => cleanup());

  it('isRegistered', () => {
    const formController = createFormController({});
    expect(formController.API.getField(TestForm.FIELD_ONE_NAME)?.meta.isMounted).toEqual(undefined);
    render(<TestForm controller={formController} />);
    expect(formController.API.getField(TestForm.FIELD_ONE_NAME)?.meta.isMounted).toEqual(true);
  });

  it('isActive', async () => {
    const wrapper = render(<TestForm />).container;
    const fieldDriver = createInputDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

    expect(fieldDriver.get.meta('isActive')).not.toBe('true');

    await fieldDriver.when.focus();
    expect(fieldDriver.get.meta('isActive')).toBe('true');

    await fieldDriver.when.blur();
    expect(fieldDriver.get.meta('isActive')).not.toBe('true');
  });

  it('isTouched', async () => {
    const wrapper = render(<TestForm />).container;
    const fieldDriver = createInputDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

    expect(fieldDriver.get.meta('isTouched')).not.toBe('true');

    await fieldDriver.when.focus();
    expect(fieldDriver.get.meta('isTouched')).toBe('true');

    await fieldDriver.when.blur();
    expect(fieldDriver.get.meta('isTouched')).toBe('true');
  });

  it('isDirty', async () => {
    const wrapper = render(
      <TestForm>
        <Field name={TestForm.FIELD_ONE_NAME}>
          <Input />
        </Field>
        <Field
          name={TestForm.FIELD_TWO_NAME}
          defaultValue={10}
          onEqualityCheck={(a, b) => {
            return Number(b) > Number(a);
          }}
        >
          <Input />
        </Field>
      </TestForm>,
    ).container;
    const fieldOneDriver = createInputDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});
    const fieldTwoDriver = createInputDriver({wrapper, dataHook: TestForm.FIELD_TWO_NAME});

    expect(fieldOneDriver.get.meta('isDirty')).toBe('false');

    await fieldOneDriver.when.change('batman');
    expect(fieldOneDriver.get.meta('isDirty')).toBe('true');

    await fieldOneDriver.when.change('');
    expect(fieldOneDriver.get.meta('isDirty')).toBe('false');

    await fieldTwoDriver.when.change('5');
    expect(fieldTwoDriver.get.meta('isDirty')).toBe('false');

    await fieldTwoDriver.when.change('15');
    expect(fieldTwoDriver.get.meta('isDirty')).toBe('true');
  });

  it('isChanged', async () => {
    const wrapper = render(<TestForm />).container;
    const fieldDriver = createInputDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

    expect(fieldDriver.get.meta('isChanged')).toBe('false');

    await fieldDriver.when.focus();
    expect(fieldDriver.get.meta('isChanged')).toBe('false');

    await fieldDriver.when.change('batman');

    expect(fieldDriver.get.meta('isChanged')).toBe('true');

    await fieldDriver.when.change('');

    expect(fieldDriver.get.meta('isChanged')).toBe('true');
  });

  it('customState', async () => {
    const formController = createFormController({});

    expect(formController.API.getField(TestForm.FIELD_ONE_NAME)?.meta.customState).toEqual(undefined);

    const wrapper = render(<TestForm controller={formController} />).container;
    const fieldDriver = createInputDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});
    const CUSTOM_KEY = 'CUSTOM_KEY';
    const CUSTOM_VALUE = 'CUSTOM_VALUE';

    await act(() => formController.API.setFieldCustomState(TestForm.FIELD_ONE_NAME, CUSTOM_KEY, CUSTOM_VALUE));

    expect(formController.API.getField(TestForm.FIELD_ONE_NAME)?.meta.customState[CUSTOM_KEY]).toBe(CUSTOM_VALUE);

    await eventually(() => {
      expect(fieldDriver.get.meta(`customState:${CUSTOM_KEY}`)).toBe(CUSTOM_VALUE);
    });
  });

  it('isValidating', async () => {
    const controller = createFormController({});

    const isValidatingResults: boolean[] = [];

    const reactionDisposer = reaction(
      () => controller.API.getField(TestForm.FIELD_ONE_NAME)?.meta?.isValidating,
      (isValidating) => {
        if (isValidating !== undefined) {
          isValidatingResults.push(isValidating);
        }
      },
    );

    const wrapper = render(
      <TestForm controller={controller}>
        <Field onValidate={jest.fn()} name={TestForm.FIELD_ONE_NAME}>
          <Input />
        </Field>
      </TestForm>,
    ).container;

    const formDriver = createTestFormDriver({wrapper});
    const fieldDriver = createInputDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

    expect(fieldDriver.get.meta('isValidating')).not.toBe('true');

    await act(() => formDriver.when.submit());

    await eventually(() => {
      expect(isValidatingResults[1]).toBe(true);
    });

    await eventually(() => {
      expect(fieldDriver.get.formMeta('isValidating')).toBe('false');
    });

    reactionDisposer();
  });
});
