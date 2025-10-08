import {act, cleanup, render} from '@testing-library/react';
import React from 'react';
import {reaction} from 'mobx';
import {createFormController, Field} from '../../index';
import {Input} from '../components/Input';
import {TestForm} from '../components/TestForm';
import {createInputDriver} from '../components/Input/createInputDriver';
import {createTestFormDriver} from '../components/createTestFormDriver';
import {eventually} from '../helpers/eventually';

describe('Form state', () => {
  afterEach(() => {
    cleanup();
  });

  it('isValid', async () => {
    const wrapper = render(
      <TestForm
        onSubmit={vi.fn()}
        onValidate={async (values) => {
          if (values[TestForm.FIELD_ONE_NAME] === 'batman') {
            return {};
          }
          return {
            [TestForm.FIELD_ONE_NAME]: ['notBatman', 'notBruceWayne'],
          };
        }}
      />,
    ).container;
    const formDriver = createTestFormDriver({wrapper});
    const fieldDriver = createInputDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

    expect(fieldDriver.get.formState('isValid')).toBe('true');

    await fieldDriver.when.change('harvy');
    await act(() => formDriver.whenSubmit());
    await eventually(() => {
      expect(fieldDriver.get.formState('isValid')).toBe('false');
    });

    await fieldDriver.when.change('batman');
    await act(() => formDriver.whenSubmit());
    await eventually(() => {
      expect(fieldDriver.get.formState('isValid')).toBe('true');
    });

    await fieldDriver.when.change('joker');
    await act(() => fieldDriver.when.validate());
    await eventually(() => {
      expect(fieldDriver.get.formState('isValid')).toBe('false');
    });
  });

  it('isTouched', async () => {
    const wrapper = render(<TestForm />).container;
    const fieldDriver = createInputDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

    expect(fieldDriver.get.formState('isTouched')).toBe('false');

    await fieldDriver.when.focus();
    expect(fieldDriver.get.formState('isTouched')).toBe('true');

    await fieldDriver.when.blur();
    expect(fieldDriver.get.formState('isTouched')).toBe('true');
  });

  it('isChanged', async () => {
    const wrapper = render(
      <TestForm
        initialValues={{
          [TestForm.FIELD_ONE_NAME]: '',
        }}
      >
        <Field name={TestForm.FIELD_ONE_NAME}>
          <Input />
        </Field>
      </TestForm>,
    ).container;
    const fieldDriver = createInputDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

    expect(fieldDriver.get.formState('isChanged')).toBe('false');

    await fieldDriver.when.focus();
    expect(fieldDriver.get.formState('isChanged')).toBe('false');

    await fieldDriver.when.blur();
    expect(fieldDriver.get.formState('isChanged')).toBe('false');

    await fieldDriver.when.change('batman');
    expect(fieldDriver.get.formState('isChanged')).toBe('true');

    await fieldDriver.when.change('');
    expect(fieldDriver.get.formState('isChanged')).toBe('true');
  });

  describe('isDirty', () => {
    it('using initial values', async () => {
      const wrapper = render(
        <TestForm
          initialValues={{
            [TestForm.FIELD_ONE_NAME]: '',
          }}
        >
          <Field name={TestForm.FIELD_ONE_NAME}>
            <Input />
          </Field>
        </TestForm>,
      ).container;
      const fieldDriver = createInputDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

      expect(fieldDriver.get.formState('isDirty')).toBe('false');

      await fieldDriver.when.change('batman');

      expect(fieldDriver.get.formState('isDirty')).toBe('true');

      await fieldDriver.when.change('');

      expect(fieldDriver.get.formState('isDirty')).toBe('false');
    });

    it('using initial field default value', async () => {
      const wrapper = render(
        <TestForm>
          <Field defaultValue="" name={TestForm.FIELD_ONE_NAME}>
            <Input />
          </Field>
        </TestForm>,
      ).container;
      const fieldDriver = createInputDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

      expect(fieldDriver.get.formState('isDirty')).toBe('false');

      await fieldDriver.when.change('batman');

      expect(fieldDriver.get.formState('isDirty')).toBe('true');

      await fieldDriver.when.change('');

      expect(fieldDriver.get.formState('isDirty')).toBe('false');
    });

    it('should ignore unmounted fields when calculating form isDirty', async () => {
      function TestComponent({hideField = false}) {
        return (
          <TestForm>
            <Field defaultValue="" name={TestForm.FIELD_ONE_NAME}>
              <Input />
            </Field>
            {!hideField && (
              <Field defaultValue="" name={TestForm.FIELD_TWO_NAME} persist={true}>
                <Input />
              </Field>
            )}
          </TestForm>
        );
      }

      const {container, rerender} = render(<TestComponent />);
      const wrapper = container;
      const fieldDriver = createInputDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});
      const secondFieldDriver = createInputDriver({wrapper, dataHook: TestForm.FIELD_TWO_NAME});

      expect(fieldDriver.get.formState('isDirty')).toBe('false');

      await secondFieldDriver.when.change('batman');

      expect(fieldDriver.get.formState('isDirty')).toBe('true');

      rerender(<TestComponent hideField={true} />);

      expect(fieldDriver.get.formState('isDirty')).toBe('false');
    });
  });

  it('submitCount', async () => {
    const wrapper = render(<TestForm />).container;
    const formDriver = createTestFormDriver({wrapper});
    const fieldDriver = createInputDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

    expect(fieldDriver.get.formState('submitCount')).toBe('0');

    await act(() => formDriver.whenSubmit());

    expect(fieldDriver.get.formState('submitCount')).toBe('1');
  });

  it('isSubmitting', async () => {
    const controller = createFormController({
      onSubmit: () => Promise.resolve(),
    });

    const isSubmittingResults: boolean[] = [];

    const reactionDisposer = reaction(
      () => controller.API.formState.isSubmitting,
      (isSubmitting) => {
        isSubmittingResults.push(isSubmitting);
      },
    );

    const wrapper = render(<TestForm controller={controller} />).container;
    const formDriver = createTestFormDriver({wrapper});
    const fieldDriver = createInputDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

    expect(fieldDriver.get.formState('isSubmitting')).toBe('false');

    await act(() => formDriver.whenSubmit());

    await eventually(() => {
      expect(isSubmittingResults[0]).toBe(true);
    });

    reactionDisposer();
  });

  it('isValidating', async () => {
    const controller = createFormController({
      onSubmit: vi.fn(),
      onValidate: async () => {
        return {[TestForm.FIELD_ONE_NAME]: ['notBatman']};
      },
    });

    const isValidatingResults: boolean[] = [];

    const reactionDisposer = reaction(
      () => controller.API.formState.isValidating,
      (isValidating) => {
        isValidatingResults.push(isValidating);
      },
    );

    const wrapper = render(<TestForm controller={controller} />).container;
    const formDriver = createTestFormDriver({wrapper});
    const fieldDriver = createInputDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

    expect(fieldDriver.get.formState('isValidating')).toBe('false');

    await act(() => formDriver.whenSubmit());

    await eventually(() => {
      expect(isValidatingResults[0]).toBe(true);
    });

    await eventually(() => {
      expect(fieldDriver.get.formState('isValidating')).toBe('false');
    });

    reactionDisposer();
  });
});
