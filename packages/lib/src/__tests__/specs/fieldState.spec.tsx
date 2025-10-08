import {act, cleanup, render} from '@testing-library/react';
import React from 'react';
import {reaction} from 'mobx';
import {Field, createFormController} from '../../index';
import {TestForm} from '../components/TestForm';
import {Input} from '../components/Input';
import {createTestFormDriver} from '../components/createTestFormDriver';
import {createInputDriver} from '../components/Input/createInputDriver';
import {eventually} from '../helpers/eventually';

describe('Field state', () => {
  afterEach(() => {
    cleanup();
  });

  it('isRegistered', () => {
    const formController = createFormController({});
    expect(formController.API.getField(TestForm.FIELD_ONE_NAME)?.fieldState.isMounted).toEqual(undefined);
    render(<TestForm controller={formController} />);
    expect(formController.API.getField(TestForm.FIELD_ONE_NAME)?.fieldState.isMounted).toEqual(true);
  });

  it('isActive', async () => {
    const wrapper = render(<TestForm />).container;
    const fieldDriver = createInputDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

    expect(fieldDriver.get.fieldState('isActive')).not.toBe('true');

    await fieldDriver.when.focus();
    expect(fieldDriver.get.fieldState('isActive')).toBe('true');

    await fieldDriver.when.blur();
    expect(fieldDriver.get.fieldState('isActive')).not.toBe('true');
  });

  it('isTouched', async () => {
    const wrapper = render(<TestForm />).container;
    const fieldDriver = createInputDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

    expect(fieldDriver.get.fieldState('isTouched')).not.toBe('true');

    await fieldDriver.when.focus();
    expect(fieldDriver.get.fieldState('isTouched')).toBe('true');

    await fieldDriver.when.blur();
    expect(fieldDriver.get.fieldState('isTouched')).toBe('true');
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

    expect(fieldOneDriver.get.fieldState('isDirty')).toBe('false');

    await fieldOneDriver.when.change('batman');
    expect(fieldOneDriver.get.fieldState('isDirty')).toBe('true');

    await fieldOneDriver.when.change('');
    expect(fieldOneDriver.get.fieldState('isDirty')).toBe('false');

    await fieldTwoDriver.when.change('5');
    expect(fieldTwoDriver.get.fieldState('isDirty')).toBe('false');

    await fieldTwoDriver.when.change('15');
    expect(fieldTwoDriver.get.fieldState('isDirty')).toBe('true');
  });

  it('isChanged', async () => {
    const wrapper = render(<TestForm />).container;
    const fieldDriver = createInputDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

    expect(fieldDriver.get.fieldState('isChanged')).toBe('false');

    await fieldDriver.when.focus();
    expect(fieldDriver.get.fieldState('isChanged')).toBe('false');

    await fieldDriver.when.change('batman');

    expect(fieldDriver.get.fieldState('isChanged')).toBe('true');

    await fieldDriver.when.change('');

    expect(fieldDriver.get.fieldState('isChanged')).toBe('true');
  });

  it('isValidating', async () => {
    const controller = createFormController({});

    const isValidatingResults: boolean[] = [];

    const reactionDisposer = reaction(
      () => controller.API.getField(TestForm.FIELD_ONE_NAME)?.fieldState.isValidating,
      (isValidating) => {
        if (isValidating !== undefined) {
          isValidatingResults.push(isValidating);
        }
      },
    );

    const wrapper = render(
      <TestForm controller={controller}>
        <Field onValidate={vi.fn()} name={TestForm.FIELD_ONE_NAME}>
          <Input />
        </Field>
      </TestForm>,
    ).container;

    const formDriver = createTestFormDriver({wrapper});
    const fieldDriver = createInputDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

    expect(fieldDriver.get.fieldState('isValidating')).not.toBe('true');

    await act(() => formDriver.whenSubmit());

    await eventually(() => {
      expect(isValidatingResults[1]).toBe(true);
    });

    await eventually(() => {
      expect(fieldDriver.get.formState('isValidating')).toBe('false');
    });

    reactionDisposer();
  });
});
