import {act, cleanup, fireEvent, render} from '@testing-library/react';
import React, {useState} from 'react';
import {createFormController, Field} from '../../index';
import {Input} from '../components/Input';
import {TestForm} from '../components/TestForm';
import {createInputDriver} from '../components/Input/createInputDriver';

describe('Form interaction', () => {
  afterEach(() => {
    cleanup();
  });

  it('should reset values', async () => {
    const controller = createFormController({
      initialValues: {
        [TestForm.FIELD_ONE_NAME]: 'batman is cool',
      },
    });
    const wrapper = render(
      <TestForm controller={controller}>
        <Field name={TestForm.FIELD_ONE_NAME}>
          <Input />
        </Field>
      </TestForm>,
    ).container;

    const fieldDriver = createInputDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

    expect(fieldDriver.get.value()).toBe('batman is cool');

    await fieldDriver.when.change('harvy is cool');

    expect(fieldDriver.get.formState('isTouched')).toBe('true');

    expect(fieldDriver.get.value()).toBe('harvy is cool');

    act(() => {
      controller.API.reset();
    });

    expect(fieldDriver.get.formState('isTouched')).toBe('false');
    expect(fieldDriver.get.value()).toBe('batman is cool');
  });

  it('should reset to specific values, if they are passed as "reset" argument, like "reset({newKey: ‘newValue’})"', async () => {
    const controller = createFormController({
      initialValues: {
        [TestForm.FIELD_ONE_NAME]: 'Batman is cool',
      },
    });

    function FormWithHiddenField() {
      const [hiddenField, setHiddenField] = useState(true);

      return (
        <TestForm controller={controller}>
          <Field name={TestForm.FIELD_ONE_NAME}>
            <Input />
          </Field>
          {!hiddenField && (
            <Field name={TestForm.FIELD_TWO_NAME}>
              <Input />
            </Field>
          )}
          <button
            type="button"
            data-hook="toggle-field"
            onClick={() => {
              setHiddenField(!hiddenField);
            }}
          >
            Toggle Field
          </button>
        </TestForm>
      );
    }

    const wrapper = render(<FormWithHiddenField />).container;

    const fieldDriver = createInputDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

    expect(fieldDriver.get.value()).toBe('Batman is cool');

    await fieldDriver.when.change('Joker is cool');

    expect(fieldDriver.get.formState('isTouched')).toBe('true');

    expect(fieldDriver.get.value()).toBe('Joker is cool');

    act(() => {
      controller.API.reset({
        [TestForm.FIELD_ONE_NAME]: 'Batman is Bruce Wayne',
        [TestForm.FIELD_TWO_NAME]: 'Wolverine is Logan',
      });
    });

    expect(fieldDriver.get.formState('isTouched')).toBe('false');
    expect(fieldDriver.get.value()).toBe('Batman is Bruce Wayne');

    const toggleField = wrapper.querySelector('[data-hook="toggle-field"]')!;
    fireEvent.click(toggleField);

    const fieldDriver2 = createInputDriver({wrapper, dataHook: TestForm.FIELD_TWO_NAME});

    expect(fieldDriver.get.formState('isTouched')).toBe('false');
    expect(fieldDriver2.get.value()).toBe('Wolverine is Logan');
  });

  it('should clear values', async () => {
    const controller = createFormController({
      initialValues: {
        [TestForm.FIELD_ONE_NAME]: 'batman is cool',
      },
    });
    const wrapper = render(
      <TestForm controller={controller}>
        <Field name={TestForm.FIELD_ONE_NAME}>
          <Input />
        </Field>
      </TestForm>,
    ).container;

    const fieldDriver = createInputDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

    expect(fieldDriver.get.value()).toBe('batman is cool');

    act(() => {
      controller.API.reset({});
    });

    expect(fieldDriver.get.formState('isTouched')).toBe('false');

    expect(fieldDriver.get.value()).toBe('');
  });

  it('should update field value', async () => {
    const controller = createFormController({
      initialValues: {
        [TestForm.FIELD_ONE_NAME]: 'batman is cool',
      },
    });
    const wrapper = render(
      <TestForm controller={controller}>
        <Field name={TestForm.FIELD_ONE_NAME}>
          <Input />
        </Field>
      </TestForm>,
    ).container;

    const fieldDriver = createInputDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

    expect(fieldDriver.get.value()).toBe('batman is cool');

    act(() => {
      controller.API.setFieldValue(TestForm.FIELD_ONE_NAME, 'joker is so cool');
    });

    expect(fieldDriver.get.formState('isTouched')).toBe('false');

    expect(fieldDriver.get.value()).toBe('joker is so cool');
  });

  it('should submit form with fields info', async () => {
    const controller = createFormController({
      onValidate: async () => {
        return {
          [TestForm.FIELD_ONE_NAME]: ['nameError'],
        };
      },
    });

    render(
      <TestForm controller={controller}>
        <Field name={TestForm.FIELD_ONE_NAME}>
          <Input />
        </Field>
      </TestForm>,
    );

    act(() => {
      controller.API.setFieldValue(TestForm.FIELD_ONE_NAME, 'batman is cool');
    });

    await act(async () => {
      const {errors, values} = await controller.API.submit();

      expect(errors).toEqual({
        [TestForm.FIELD_ONE_NAME]: ['nameError'],
      });

      expect(values).toEqual({
        [TestForm.FIELD_ONE_NAME]: 'batman is cool',
      });
    });
  });

  it('should not re-render field in case other one changed', async () => {
    const controller = createFormController({
      initialValues: {
        [TestForm.FIELD_ONE_NAME]: '1: initial',
        [TestForm.FIELD_TWO_NAME]: '2: initial',
      },
    });

    const FormWithTwoFields = () => {
      return (
        <TestForm controller={controller}>
          <Field name={TestForm.FIELD_ONE_NAME}>
            <Input useRenderCounter={true} />
          </Field>
          <Field name={TestForm.FIELD_TWO_NAME}>
            <Input />
          </Field>
          <Field name={TestForm.FIELD_NESTED_NAME}>
            <Input />
          </Field>
          <button
            type="button"
            data-hook="change_field_2_value"
            onClick={() => {
              controller.API.setFieldValue(TestForm.FIELD_TWO_NAME, '2: changed');
            }}
          >
            {`Change value of ${TestForm.FIELD_TWO_NAME}`}
          </button>
          <button
            type="button"
            data-hook="change_field_3_value"
            onClick={() => {
              controller.API.setFieldValue(TestForm.FIELD_NESTED_NAME, '3: changed');
            }}
          >
            {`Change value of ${TestForm.FIELD_NESTED_NAME}`}
          </button>
        </TestForm>
      );
    };

    const wrapper = render(<FormWithTwoFields />).container;

    const toggleField2 = wrapper.querySelector('[data-hook="change_field_2_value"]')!;
    fireEvent.click(toggleField2);

    const toggleField3 = wrapper.querySelector('[data-hook="change_field_3_value"]')!;
    fireEvent.click(toggleField3);

    expect(window.$_TEST_RENDER_COUNT_$![TestForm.FIELD_ONE_NAME]).toBe(1);
  });
});
