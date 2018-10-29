import * as React from 'react';
import {mount} from 'enzyme';
import {FormController} from '../src/FormController';
import {createInputAdapterDriver} from '../test/components/InputAdapter/InputAdapter.driver';
import {TestForm} from '../test/components/TestForm';
import {waitFor} from '../test/helpers/conditions';
import {createTestFormDriver} from '../test/components/TestForm.driver';
import {InputAdapter} from '../test/components/InputAdapter';
import {Field} from '../src/Field';

describe('Validation', async () => {
  describe('form level', () => {
    it('should be with errors', async () => {
      const controller = new FormController({
        onSubmit: jest.fn(),
        onValidate: async () => {
          return {
            [TestForm.FIELD_ONE_NAME]: ['notBatman', 'notBruceWayne'],
          };
        },
      });
      const wrapper = mount(<TestForm controller={controller} />);
      const formDriver = createTestFormDriver({wrapper});
      const fieldDriver = createInputAdapterDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

      formDriver.when.submit();

      await waitFor(wrapper)(() => {
        return fieldDriver.get.errors('notBatman') !== null && fieldDriver.get.errors('notBruceWayne') !== null;
      });
    });
  });

  describe('field level', () => {
    it('has errors', async () => {
      const controller = new FormController({
        onSubmit: jest.fn(),
      });
      const wrapper = mount(
        <TestForm controller={controller}>
          <Field
            defaultValue={'Batman'}
            name={TestForm.FIELD_ONE_NAME}
            adapter={InputAdapter}
            onValidate={(value) => {
              return value === 'Bruce' ? null : ['nameError'];
            }}
          />
        </TestForm>,
      );
      const formDriver = createTestFormDriver({wrapper});
      const fieldDriver = createInputAdapterDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

      formDriver.when.submit();

      await waitFor(wrapper)(() => {
        return fieldDriver.get.errors('nameError') !== null;
      });
    });

    it('has errors (async)', async () => {
      const controller = new FormController({
        onSubmit: jest.fn(),
      });
      const wrapper = mount(
        <TestForm controller={controller}>
          <Field
            defaultValue={'Batman'}
            name={TestForm.FIELD_ONE_NAME}
            adapter={InputAdapter}
            onValidate={(value) => {
              return value === 'Bruce' ? Promise.resolve() : Promise.reject(['nameError']);
            }}
          />
        </TestForm>,
      );
      const formDriver = createTestFormDriver({wrapper});
      const fieldDriver = createInputAdapterDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

      formDriver.when.submit();

      await waitFor(wrapper)(() => {
        return fieldDriver.get.errors('nameError') !== null;
      });

      fieldDriver.when.change('Bruce');
      formDriver.when.submit();

      await waitFor(wrapper)(() => {
        return fieldDriver.get.errors('nameError') === null;
      });
    });
  });

  describe('form & field level combined', () => {
    it('should be with errors', async () => {
      const controller = new FormController({
        onSubmit: jest.fn(),
        onValidate: async () => {
          return {
            [TestForm.FIELD_ONE_NAME]: ['RobinHood'],
          };
        },
      });
      const wrapper = mount(
        <TestForm controller={controller}>
          <Field name={TestForm.FIELD_ONE_NAME} adapter={InputAdapter} />
          <Field
            defaultValue={'Batman'}
            name={TestForm.FIELD_TWO_NAME}
            adapter={InputAdapter}
            onValidate={(value) => {
              return value === 'Bruce' ? Promise.resolve() : Promise.reject(['nameError']);
            }}
          />
        </TestForm>,
      );
      const formDriver = createTestFormDriver({wrapper});
      const firstFieldDriver = createInputAdapterDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});
      const secondFieldDriver = createInputAdapterDriver({wrapper, dataHook: TestForm.FIELD_TWO_NAME});

      formDriver.when.submit();

      await waitFor(wrapper)(() => {
        return firstFieldDriver.get.errors('RobinHood') !== null && secondFieldDriver.get.errors('nameError') !== null;
      });
    });
  });
});
