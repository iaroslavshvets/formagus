import * as React from 'react';
import {mount} from 'enzyme';
import {TestForm} from '../test/components/TestForm';
import {InputAdapter} from '../test/components/InputAdapter';
import {Field} from '../src/Field';
import {createTestFormDriver} from '../test/components/TestForm.driver';
import {createInputAdapterDriver} from '../test/components/InputAdapter/InputAdapter.driver';
import {waitFor} from '../test/helpers/conditions';

describe('Form props', async () => {
  it('initialValues', async () => {
    const wrapper = mount(
      <TestForm
        initialValues={{
          [TestForm.FIELD_ONE_NAME]: 'John Snow',
        }}
      />,
    );
    const fieldDriver = createInputAdapterDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

    expect(fieldDriver.get.value()).toBe('John Snow');
  });

  it('onSubmitAfter', async () => {
    const callbackStack: string[] = [];

    const wrapper = mount(
      <TestForm
        initialValues={{
          [TestForm.FIELD_ONE_NAME]: 'John Snow',
        }}
        onSubmit={() => callbackStack.push('onSubmit')}
        onSubmitAfter={() => callbackStack.push('onSubmitAfter')}
      />,
    );

    const formDriver = createTestFormDriver({wrapper});
    formDriver.when.submit();

    await waitFor(wrapper)(() => {
      const [firstCall, secondCall] = callbackStack;
      return firstCall === 'onSubmit' && secondCall === 'onSubmitAfter';
    });
  });


  it('formatter (with field and arrays support)', async () => {
    const FIELD_ONE_NAME = 'array[0].field_one_name';
    const FIELD_TWO_NAME = 'array[0].field_two_name';

    const onValidate = jest.fn();
    const wrapper = mount(
      <TestForm
        initialValues={{
          array: [
            {
              field_one_name: 'John Snow',
              field_two_name: 'Ned Stark'
            }
          ]
        }}
        onValidate={onValidate}
        onFormat={(values: any) => {
          const formattedValues = {...values};

          if (formattedValues.array) {
            formattedValues.array[0].field_one_name = formattedValues.array[0].field_one_name + ':formatted';
          }

          return formattedValues;
        }}
      >
        <Field name={FIELD_ONE_NAME} adapter={InputAdapter} />
        <Field
          name={FIELD_TWO_NAME}
          adapter={InputAdapter}
          onFormat={(value: string) => {
            return value + ':formatted';
          }}
        />
      </TestForm>,
    );

    const formDriver = createTestFormDriver({wrapper});
    const fieldOneDriver = createInputAdapterDriver({wrapper, dataHook: FIELD_ONE_NAME});
    const fieldTwoDriver = createInputAdapterDriver({wrapper, dataHook: FIELD_TWO_NAME});

    const getFirstFieldValue = () => formDriver.get.values().array[0].field_one_name;
    const getSecondFieldValue = () => formDriver.get.values().array[0].field_two_name;

    expect(getFirstFieldValue()).toBe('John Snow:formatted');
    expect(getSecondFieldValue()).toBe('Ned Stark:formatted');

    fieldOneDriver.when.change('Tyrion Lannister');
    fieldTwoDriver.when.change('Arya Stark');

    expect(getFirstFieldValue()).toBe('Tyrion Lannister:formatted');
    expect(getSecondFieldValue()).toBe('Arya Stark:formatted');

    formDriver.when.submit();

    expect(onValidate).toBeCalledWith({
      array: [{
        field_one_name: 'Tyrion Lannister:formatted',
        field_two_name: 'Arya Stark:formatted'
      }]
    });
  });
});
