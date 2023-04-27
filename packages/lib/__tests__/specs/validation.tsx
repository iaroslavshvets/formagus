import {cleanup, render} from '@testing-library/react';
import React from 'react';
import {Field, createFormController} from '../../src';
import {createInputAdapterDriver} from '../components/Input/InputAdapter.driver';
import {TestForm} from '../components/TestForm';
import {waitFor} from '../helpers/conditions';
import {createTestFormDriver} from '../components/TestForm.driver';
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
      const fieldDriver = createInputAdapterDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

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
      const fieldDriver = createInputAdapterDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

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
      const fieldDriver = createInputAdapterDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

      formDriver.when.submit();

      await waitFor(() => fieldDriver.get.errors('nameError') !== null);

      fieldDriver.when.change('Bruce');
      formDriver.when.submit();

      await waitFor(() => fieldDriver.get.errors('nameError') === null);
    });
  });

  describe('form & field level combined', () => {
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
      const firstFieldDriver = createInputAdapterDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});
      const secondFieldDriver = createInputAdapterDriver({wrapper, dataHook: TestForm.FIELD_TWO_NAME});

      formDriver.when.submit();

      await waitFor(
        () => firstFieldDriver.get.errors('RobinHood') !== null && secondFieldDriver.get.errors('nameError') !== null,
      );
    });
  });
});
