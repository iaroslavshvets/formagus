import * as React from 'react';
import {mount} from 'enzyme';
import {FormController} from '../src/FormController';
import {TestForm} from '../test/components/TestForm';
import {Field} from '../src/Field';
import {InputAdapter} from '../test/components/InputAdapter';
import {createInputAdapterDriver} from '../test/components/InputAdapter/InputAdapter.driver';
import {createTestFormDriver} from '../test/components/TestForm.driver';
import {waitFor} from '../test/helpers/conditions';

describe('Field interactions', async () => {
  it('should keep value if "persist=true"', () => {
    class StatefulForm extends React.Component<{}, {hiddenField: boolean}> {
      state = {
        hiddenField: false,
      };

      render() {
        return (
          <TestForm>
            {!this.state.hiddenField && <Field name={TestForm.FIELD_ONE_NAME} adapter={InputAdapter} persist={true} />}
            <button
              type="button"
              data-hook="toggle-field"
              onClick={() => {
                this.setState((state) => {
                  return {
                    hiddenField: !state.hiddenField,
                  };
                });
              }}
            >
              Toggle Field
            </button>
          </TestForm>
        );
      }
    }
    const wrapper = mount(<StatefulForm />);
    const formDriver = createTestFormDriver({wrapper});
    const fieldDriver = createInputAdapterDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});
    const toggleField = wrapper.find(`[data-hook="toggle-field"]`);
    const NEW_VALUE = 'batman';

    fieldDriver.when.change(NEW_VALUE);

    toggleField.simulate('click');

    expect(formDriver.get.values()[TestForm.FIELD_ONE_NAME]).toBeUndefined();

    toggleField.simulate('click');

    expect(fieldDriver.get.value()).toBe(NEW_VALUE);
  });

  it('should not keep value', () => {
    class StatefulForm extends React.Component<{props: null}, {hiddenField: boolean}> {
      state = {
        hiddenField: false,
      };

      render() {
        return (
          <TestForm>
            {!this.state.hiddenField && <Field name={TestForm.FIELD_ONE_NAME} adapter={InputAdapter} />}
            <button
              type="button"
              data-hook="toggle-field"
              onClick={() => {
                this.setState((state) => {
                  return {
                    hiddenField: !state.hiddenField,
                  };
                });
              }}
            >
              Toggle Field
            </button>
          </TestForm>
        );
      }
    }
    const wrapper = mount(<StatefulForm props={null} />);
    const fieldDriver = createInputAdapterDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});
    const toggleField = wrapper.find(`[data-hook="toggle-field"]`);
    const NEW_VALUE = 'batman';

    fieldDriver.when.change(NEW_VALUE);

    toggleField.simulate('click');
    toggleField.simulate('click');

    expect(fieldDriver.get.value()).toBe('');
  });

  it('set custom state', async () => {
    const formController = new FormController({});

    expect(formController.API.getFieldMeta(TestForm.FIELD_ONE_NAME).customState).toEqual({});

    const wrapper = mount(
      <TestForm>
        <Field
          name={TestForm.FIELD_ONE_NAME}
          adapter={InputAdapter}
          adapterProps={{
            customState: {
              customProperty: 'custom value',
            },
          }}
        />
      </TestForm>,
    );

    const fieldDriver = createInputAdapterDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

    fieldDriver.when.setCustomState();

    await waitFor(wrapper)(() => {
      return fieldDriver.get.meta('customState:customProperty') === 'custom value';
    });
  });

  it('set nested value', async () => {
    const NESTED_FIELD_NAME = `${TestForm.FIELD_ONE_NAME}[0].nested`;
    const NEW_VALUE = 'batman';
    const formController = new FormController({});

    const wrapper = mount(
      <TestForm controller={formController}>
        <Field name={NESTED_FIELD_NAME} adapter={InputAdapter} />
      </TestForm>,
    );

    const fieldDriver = createInputAdapterDriver({wrapper, dataHook: NESTED_FIELD_NAME});

    fieldDriver.when.change(NEW_VALUE);

    await waitFor(wrapper)(() => {
      return formController.API.values[TestForm.FIELD_ONE_NAME][0].nested === NEW_VALUE;
    });
  });

  it('should be able to use formAPI', () => {
    const NEW_VALUE = 'valueSetFromOutside';
    const formController = new FormController({});

    class StatefulForm extends React.Component {
      render() {
        return (
          <TestForm controller={formController}>
            <Field
              name={TestForm.FIELD_ONE_NAME}
              adapter={InputAdapter}
              adapterProps={{
                callback: function() {
                  this.props.formagus.formAPI.setFieldValue(TestForm.FIELD_TWO_NAME, NEW_VALUE)
                }
              }}
            />
            <Field
              name={TestForm.FIELD_TWO_NAME}
              adapter={InputAdapter}
            />
          </TestForm>
        );
      }
    }
    const wrapper = mount(<StatefulForm />);
    const fieldOneDriver = createInputAdapterDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});
    const fieldTwoDriver = createInputAdapterDriver({wrapper, dataHook: TestForm.FIELD_TWO_NAME});

    fieldOneDriver.when.clickOnCallback();

    expect(fieldTwoDriver.get.value()).toEqual(NEW_VALUE);
  });
});
