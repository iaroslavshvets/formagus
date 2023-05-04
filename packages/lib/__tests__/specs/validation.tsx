import {cleanup, render} from '@testing-library/react';
import React from 'react';
import {observer} from 'mobx-react';
import {Field, createFormController, useField} from '../../src';
import {createInputDriver} from '../components/Input/createInputDriver';
import {TestForm} from '../components/TestForm';
import {waitFor} from '../helpers/conditions';
import {createTestFormDriver} from '../components/createTestFormDriver';
import {Input} from '../components/Input';

describe('Validation', () => {
  afterEach(() => cleanup());

  describe('form level', () => {
    it('should be with errors', async () => {
      const controller = createFormController({
        onSubmit: jest.fn(),
        onValidate: async () => {
          return {
            [TestForm.FIELD_ONE_NAME]: ['notBatman', 'notBruceWayne'],
          };
        },
      });
      const wrapper = render(<TestForm controller={controller} />).container;
      const formDriver = createTestFormDriver({wrapper});
      const fieldDriver = createInputDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

      formDriver.when.submit();

      await waitFor(
        () => fieldDriver.get.errors('notBatman') !== null && fieldDriver.get.errors('notBruceWayne') !== null,
      );
    });
  });

  describe('field level', () => {
    it('has errors', async () => {
      const controller = createFormController({
        onSubmit: jest.fn(),
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

      formDriver.when.submit();

      await waitFor(() => fieldDriver.get.errors('nameError') !== null);
    });

    it('has errors (async)', async () => {
      const controller = createFormController({
        onSubmit: jest.fn(),
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

      formDriver.when.submit();

      await waitFor(() => fieldDriver.get.errors('nameError') !== null);

      fieldDriver.when.change('Bruce');
      formDriver.when.submit();

      await waitFor(() => fieldDriver.get.errors('nameError') === null);
    });
  });

  describe('form & field level combined', () => {
    it('run field level validation only if both form and field level validations are defined', () => {
      const formLevelValidation = jest.fn();
      const fieldLevelValidation = jest.fn();

      const FieldInput = observer(() => {
        const {fieldProps, name, meta, validateField} = useField();

        const validate = () => {
          if (meta.isMounted && fieldProps.onValidate) {
            validateField();
          }
        };

        return (
          <span data-hook={name}>
            <span data-hook="validate" onClick={validate} />
          </span>
        );
      });

      const wrapper = render(
        <TestForm onValidate={formLevelValidation}>
          <Field onValidate={fieldLevelValidation} name={TestForm.FIELD_ONE_NAME}>
            <FieldInput />
          </Field>
        </TestForm>,
      ).container;

      const fieldOneDriver = createInputDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

      fieldOneDriver.when.validate();

      expect(fieldLevelValidation).toBeCalled();
      expect(formLevelValidation).not.toBeCalled();
    });

    it('should be with errors', async () => {
      const controller = createFormController({
        onSubmit: jest.fn(),
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

      formDriver.when.submit();

      await waitFor(
        () => firstFieldDriver.get.errors('RobinHood') !== null && secondFieldDriver.get.errors('nameError') !== null,
      );
    });
  });
});
