import {act, cleanup, render} from '@testing-library/react';
import React from 'react';
import {Field, createFormController} from '../../index';
import {createInputDriver} from '../components/Input/createInputDriver';
import {TestForm} from '../components/TestForm';
import {createTestFormDriver} from '../components/createTestFormDriver';
import {Input} from '../components/Input';
import {eventually} from '../helpers/eventually';

describe('Validation', () => {
  afterEach(() => {
    cleanup();
  });

  describe('form level', () => {
    it('should be with errors', async () => {
      const controller = createFormController({
        onSubmit: vi.fn(),
        onValidate: async () => {
          return {
            [TestForm.FIELD_ONE_NAME]: ['notBatman', 'notBruceWayne'],
          };
        },
      });
      const wrapper = render(<TestForm controller={controller} />).container;
      const formDriver = createTestFormDriver({wrapper});
      const fieldDriver = createInputDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

      await act(() => formDriver.whenSubmit());

      await eventually(() => {
        expect(fieldDriver.get.errors('notBatman')).not.toBe(null);
        expect(fieldDriver.get.errors('notBruceWayne')).not.toBe(null);
      });
    });
  });

  describe('field level', () => {
    it('has errors', async () => {
      const controller = createFormController({
        onSubmit: vi.fn(),
      });
      const wrapper = render(
        <TestForm controller={controller}>
          <Field
            defaultValue="Batman"
            name={TestForm.FIELD_ONE_NAME}
            onValidate={(value) => {
              return value === 'Bruce' ? null : ['nameError'];
            }}
          >
            <Input />
          </Field>
        </TestForm>,
      ).container;

      const formDriver = createTestFormDriver({wrapper});
      const fieldDriver = createInputDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

      await act(() => formDriver.whenSubmit());

      await eventually(() => {
        expect(fieldDriver.get.errors('nameError')).not.toBe(null);
      });
    });

    it('has errors (async)', async () => {
      const controller = createFormController({
        onSubmit: vi.fn(),
      });
      const wrapper = render(
        <TestForm controller={controller}>
          <Field
            defaultValue="Batman"
            name={TestForm.FIELD_ONE_NAME}
            onValidate={async (value) => {
              if (value === 'Bruce') {
                return undefined;
              }
              return ['nameError'];
            }}
          >
            <Input />
          </Field>
        </TestForm>,
      ).container;
      const formDriver = createTestFormDriver({wrapper});
      const fieldDriver = createInputDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

      await act(() => formDriver.whenSubmit());

      await eventually(() => {
        expect(fieldDriver.get.errors('nameError')).not.toBe(null);
      });

      await fieldDriver.when.change('Bruce');
      await act(() => formDriver.whenSubmit());

      await eventually(() => {
        expect(fieldDriver.get.errors('nameError')).toBe(null);
      });
    });

    it('clear errors', async () => {
      const controller = createFormController({
        onSubmit: vi.fn(),
      });

      const wrapper = render(
        <TestForm controller={controller}>
          <Field
            defaultValue="Batman"
            name={TestForm.FIELD_ONE_NAME}
            onValidate={(value) => {
              return value === 'Bruce' ? null : ['nameError'];
            }}
          >
            <Input />
          </Field>
        </TestForm>,
      ).container;
      const formDriver = createTestFormDriver({wrapper});
      const fieldDriver = createInputDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

      await act(() => formDriver.whenSubmit());

      await eventually(() => {
        expect(fieldDriver.get.errors('nameError')).not.toBe(null);
      });

      await fieldDriver.when.change('Bruce');
      await act(() => formDriver.whenSubmit());

      await eventually(() => {
        expect(fieldDriver.get.errors('nameError')).toBe(null);
      });
    });
  });

  describe('form & field level combined', () => {
    it('run only field level validation', async () => {
      const formController = createFormController({});
      const formLevelValidation = vi.fn();
      const fieldLevelValidation = vi.fn((value) => {
        return value === 'valid' ? undefined : ['invalid'];
      });

      const wrapper = render(
        <TestForm onValidate={formLevelValidation} controller={formController}>
          <Field onValidate={fieldLevelValidation} name={TestForm.FIELD_NESTED_NAME}>
            <Input />
          </Field>
        </TestForm>,
      ).container;

      const fieldOneDriver = createInputDriver({wrapper, dataHook: TestForm.FIELD_NESTED_NAME});

      expect(formController.API.errors).toEqual({});
      expect(fieldOneDriver.get.errors()).toBe(null);

      await act(() => fieldOneDriver.when.validateField());

      await eventually(() => {
        expect(formController.API.errors).toEqual({
          [TestForm.FIELD_NESTED_NAME]: ['invalid'],
        });
        expect(fieldOneDriver.get.errors('invalid')).not.toBe(null);
      });

      await act(() => fieldOneDriver.when.change('valid'));
      await act(() => fieldOneDriver.when.validateField());

      await eventually(() => {
        expect(formController.API.errors).toEqual({});
        expect(fieldOneDriver.get.errors()).toBe(null);
      });

      expect(fieldLevelValidation).toBeCalled();
      expect(formLevelValidation).not.toBeCalled();
    });

    it('should be with errors', async () => {
      const controller = createFormController({
        onSubmit: vi.fn(),
        onValidate: async () => {
          return {
            [TestForm.FIELD_ONE_NAME]: ['RobinHood'],
          };
        },
      });
      const wrapper = render(
        <TestForm controller={controller}>
          <Field name={TestForm.FIELD_ONE_NAME}>
            <Input />
          </Field>
          <Field
            defaultValue="Batman"
            name={TestForm.FIELD_TWO_NAME}
            onValidate={async (value) => {
              if (value === 'Bruce') {
                return undefined;
              }
              return ['nameError'];
            }}
          >
            <Input />
          </Field>
        </TestForm>,
      ).container;

      const formDriver = createTestFormDriver({wrapper});
      const firstFieldDriver = createInputDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});
      const secondFieldDriver = createInputDriver({wrapper, dataHook: TestForm.FIELD_TWO_NAME});

      await act(() => formDriver.whenSubmit());

      await eventually(() => {
        expect(firstFieldDriver.get.errors('RobinHood')).not.toBe(null);
        expect(secondFieldDriver.get.errors('nameError')).not.toBe(null);
      });
    });
  });
});
