import {cleanup, fireEvent, render} from '@testing-library/react';
import React, {useState} from 'react';
import {Field, FormController} from '../../src';
import {InputAdapter} from '../components/InputAdapter';
import {TestForm} from '../components/TestForm';
import {createInputAdapterDriver} from '../components/InputAdapter/InputAdapter.driver';

describe('Form interaction', () => {
  afterEach(() => cleanup());

  it('should reset values', async () => {
    const controller = new FormController({
      initialValues: {
        [TestForm.FIELD_ONE_NAME]: 'batman is cool',
      },
    });
    const wrapper = render(
      <TestForm controller={controller}>
        <Field name={TestForm.FIELD_ONE_NAME} adapter={InputAdapter} />
      </TestForm>,
    ).container;

    const fieldDriver = createInputAdapterDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

    expect(fieldDriver.get.value()).toBe('batman is cool');

    fieldDriver.when.change('harvy is cool');

    expect(fieldDriver.get.meta('form:isTouched')).toBe('true');

    expect(fieldDriver.get.value()).toBe('harvy is cool');

    controller.API.reset();

    expect(fieldDriver.get.meta('form:isTouched')).toBe('false');
    expect(fieldDriver.get.value()).toBe('batman is cool');
  });

  it('should reset to specific values, if they are passed as "resetToValues" argument, like "reset({newKey: ‘newValue’})"', async () => {
    const controller = new FormController({
      initialValues: {
        [TestForm.FIELD_ONE_NAME]: 'Batman is cool',
      },
    });

    function FormWithHiddenField() {
      const [hiddenField, setHiddenField] = useState(true);

      return (
        <TestForm controller={controller}>
          <Field name={TestForm.FIELD_ONE_NAME} adapter={InputAdapter} />
          {!hiddenField && <Field name={TestForm.FIELD_TWO_NAME} adapter={InputAdapter} />}
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

    const fieldDriver = createInputAdapterDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

    expect(fieldDriver.get.value()).toBe('Batman is cool');

    fieldDriver.when.change('Joker is cool');

    expect(fieldDriver.get.meta('form:isTouched')).toBe('true');

    expect(fieldDriver.get.value()).toBe('Joker is cool');

    controller.API.resetToValues({
      [TestForm.FIELD_ONE_NAME]: 'Batman is Bruce Wayne',
      [TestForm.FIELD_TWO_NAME]: 'Wolverine is Logan',
    });

    expect(fieldDriver.get.meta('form:isTouched')).toBe('false');
    expect(fieldDriver.get.value()).toBe('Batman is Bruce Wayne');

    const toggleField = wrapper.querySelector('[data-hook="toggle-field"]')!;
    fireEvent.click(toggleField);

    const fieldDriver2 = createInputAdapterDriver({wrapper, dataHook: TestForm.FIELD_TWO_NAME});

    expect(fieldDriver.get.meta('form:isTouched')).toBe('false');
    expect(fieldDriver2.get.value()).toBe('Wolverine is Logan');
  });

  it('should clear values', async () => {
    const controller = new FormController({
      initialValues: {
        [TestForm.FIELD_ONE_NAME]: 'batman is cool',
      },
    });
    const wrapper = render(
      <TestForm controller={controller}>
        <Field name={TestForm.FIELD_ONE_NAME} adapter={InputAdapter} />
      </TestForm>,
    ).container;

    const fieldDriver = createInputAdapterDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

    expect(fieldDriver.get.value()).toBe('batman is cool');

    controller.API.clear();

    expect(fieldDriver.get.meta('form:isTouched')).toBe('false');

    expect(fieldDriver.get.value()).toBe('');
  });

  it('should update field value', async () => {
    const controller = new FormController({
      initialValues: {
        [TestForm.FIELD_ONE_NAME]: 'batman is cool',
      },
    });
    const wrapper = render(
      <TestForm controller={controller}>
        <Field name={TestForm.FIELD_ONE_NAME} adapter={InputAdapter} />
      </TestForm>,
    ).container;

    const fieldDriver = createInputAdapterDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

    expect(fieldDriver.get.value()).toBe('batman is cool');

    controller.API.setFieldValue(TestForm.FIELD_ONE_NAME, 'joker is so cool');

    expect(fieldDriver.get.meta('form:isTouched')).toBe('false');

    expect(fieldDriver.get.value()).toBe('joker is so cool');
  });

  it('should submit form with fields info', async () => {
    const controller = new FormController({
      onValidate: async () => {
        return {
          [TestForm.FIELD_ONE_NAME]: ['nameError'],
        };
      },
    });

    render(
      <TestForm controller={controller}>
        <Field name={TestForm.FIELD_ONE_NAME} adapter={InputAdapter} />
      </TestForm>,
    );

    controller.API.setFieldValue(TestForm.FIELD_ONE_NAME, 'batman is cool');

    const {errors, values} = await controller.API.submit();

    expect(errors).toEqual({
      [TestForm.FIELD_ONE_NAME]: ['nameError'],
    });

    expect(values).toEqual({
      [TestForm.FIELD_ONE_NAME]: 'batman is cool',
    });
  });

  it('should not re-render field in case other one changed', async () => {
    const controller = new FormController({
      initialValues: {
        [TestForm.FIELD_ONE_NAME]: '1: initial',
        [TestForm.FIELD_TWO_NAME]: '2: initial',
      },
    });

    const FormWithTwoFields = () => {
      return (
        <TestForm controller={controller}>
          <Field<typeof InputAdapter>
            name={TestForm.FIELD_ONE_NAME}
            adapter={InputAdapter}
            adapterProps={{
              useRenderCounter: true,
            }}
          />
          <Field name={TestForm.FIELD_TWO_NAME} adapter={InputAdapter} />
          <Field name={TestForm.FIELD_THREE_NAME} adapter={InputAdapter} />
          <button
            type="button"
            data-hook="change_field_2_value"
            onClick={() => {
              controller.setFieldValue(TestForm.FIELD_TWO_NAME, '2: changed');
            }}
          >
            {`Change value of ${TestForm.FIELD_TWO_NAME}`}
          </button>
          <button
            type="button"
            data-hook="change_field_3_value"
            onClick={() => {
              controller.setFieldValue(TestForm.FIELD_THREE_NAME, '3: changed');
            }}
          >
            {`Change value of ${TestForm.FIELD_THREE_NAME}`}
          </button>
        </TestForm>
      );
    };

    const wrapper = await render(<FormWithTwoFields />).container;

    const toggleField2 = wrapper.querySelector('[data-hook="change_field_2_value"]')!;
    fireEvent.click(toggleField2);

    const toggleField3 = wrapper.querySelector('[data-hook="change_field_3_value"]')!;
    fireEvent.click(toggleField3);

    expect(window.$_TEST_RENDER_COUNT_$![TestForm.FIELD_ONE_NAME]).toBe(2);
  });
});
