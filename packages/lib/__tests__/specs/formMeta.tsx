import {cleanup, render} from '@testing-library/react';
import React from 'react';
import {Field} from '../../src';
import {Input} from '../components/Input';
import {TestForm} from '../components/TestForm';
import {createInputDriver} from '../components/Input/createInputDriver';
import {createTestFormDriver} from '../components/createTestFormDriver';
import {eventually} from '../helpers/eventually';

describe('Form meta', () => {
  afterEach(() => cleanup());

  it('isValid', async () => {
    const wrapper = render(
      <TestForm
        onSubmit={jest.fn()}
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

    expect(fieldDriver.get.meta('form:isValid')).toBe('true');

    fieldDriver.when.change('harvy');
    formDriver.when.submit();
    await eventually(() => {
      expect(fieldDriver.get.meta('form:isValid')).toBe('false');
    });

    fieldDriver.when.change('batman');
    formDriver.when.submit();
    await eventually(() => {
      expect(fieldDriver.get.meta('form:isValid')).toBe('true');
    });

    fieldDriver.when.change('joker');
    fieldDriver.when.validate();
    await eventually(() => {
      expect(fieldDriver.get.meta('form:isValid')).toBe('false');
    });
  });

  it('isTouched', () => {
    const wrapper = render(<TestForm />).container;
    const fieldDriver = createInputDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

    expect(fieldDriver.get.meta('form:isTouched')).toBe('false');

    fieldDriver.when.focus();
    expect(fieldDriver.get.meta('form:isTouched')).toBe('true');

    fieldDriver.when.blur();
    expect(fieldDriver.get.meta('form:isTouched')).toBe('true');
  });

  it('isChanged', () => {
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

    expect(fieldDriver.get.meta('form:isChanged')).toBe('false');

    fieldDriver.when.focus();
    expect(fieldDriver.get.meta('form:isChanged')).toBe('false');

    fieldDriver.when.blur();
    expect(fieldDriver.get.meta('form:isChanged')).toBe('false');

    fieldDriver.when.change('batman');
    expect(fieldDriver.get.meta('form:isChanged')).toBe('true');

    fieldDriver.when.change('');
    expect(fieldDriver.get.meta('form:isChanged')).toBe('true');
  });

  describe('isDirty', () => {
    it('using initial values', () => {
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

      expect(fieldDriver.get.meta('form:isDirty')).toBe('false');

      fieldDriver.when.change('batman');

      expect(fieldDriver.get.meta('form:isDirty')).toBe('true');

      fieldDriver.when.change('');

      expect(fieldDriver.get.meta('form:isDirty')).toBe('false');
    });

    it('using initial field default value', () => {
      const wrapper = render(
        <TestForm>
          <Field defaultValue="" name={TestForm.FIELD_ONE_NAME}>
            <Input />
          </Field>
        </TestForm>,
      ).container;
      const fieldDriver = createInputDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

      expect(fieldDriver.get.meta('form:isDirty')).toBe('false');

      fieldDriver.when.change('batman');

      expect(fieldDriver.get.meta('form:isDirty')).toBe('true');

      fieldDriver.when.change('');

      expect(fieldDriver.get.meta('form:isDirty')).toBe('false');
    });

    it('should ignore unmounted fields when calculating form isDirty', () => {
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

      expect(fieldDriver.get.meta('form:isDirty')).toBe('false');

      secondFieldDriver.when.change('batman');

      expect(fieldDriver.get.meta('form:isDirty')).toBe('true');

      rerender(<TestComponent hideField={true} />);

      expect(fieldDriver.get.meta('form:isDirty')).toBe('false');
    });
  });

  it('submitCount', () => {
    const wrapper = render(<TestForm />).container;
    const formDriver = createTestFormDriver({wrapper});
    const fieldDriver = createInputDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

    expect(fieldDriver.get.meta('form:submitCount')).toBe('0');

    formDriver.when.submit();

    expect(fieldDriver.get.meta('form:submitCount')).toBe('1');
  });

  it('isSubmitting', async () => {
    const wrapper = render(<TestForm onValidate={() => Promise.resolve({})} />).container;
    const formDriver = createTestFormDriver({wrapper});
    const fieldDriver = createInputDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

    expect(fieldDriver.get.meta('form:isSubmitting')).toBe('false');

    formDriver.when.submit();

    expect(fieldDriver.get.meta('form:isSubmitting')).toBe('true');

    await eventually(() => {
      expect(fieldDriver.get.meta('form:isSubmitting')).toBe('false');
    });
  });

  it('isValidating', async () => {
    const wrapper = render(
      <TestForm
        onSubmit={jest.fn()}
        onValidate={async () => {
          return {[TestForm.FIELD_ONE_NAME]: ['notBatman']};
        }}
      />,
    ).container;
    const formDriver = createTestFormDriver({wrapper});
    const fieldDriver = createInputDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

    expect(fieldDriver.get.meta('form:isValidating')).toBe('false');

    formDriver.when.submit();

    expect(fieldDriver.get.meta('form:isValidating')).toBe('true');

    await eventually(() => {
      expect(fieldDriver.get.meta('form:isValidating')).toBe('false');
    });
  });
});
