import React, {useState} from 'react';
import {render} from '@testing-library/react';
import {FormController, Field} from '../../src';
import {TestForm} from '../components/TestForm';
import {InputAdapter} from '../components/InputAdapter';
import {createInputAdapterDriver} from '../components/InputAdapter/InputAdapter.driver';
import {waitFor} from '../helpers/conditions';
import {fireEvent} from '@testing-library/react';
import {cleanup} from '@testing-library/react';
import {observer} from 'mobx-react';

describe('Field interactions', () => {
  afterEach(() => {
    return cleanup();
  });

  it('should keep value if "persist=true"', async () => {
    const controller = new FormController({});

    const Form = observer(() => {
      const [isDisplayed, setIsDisplayed] = useState(false);
      const [isSwitchedPosition, setIsSwitchedPosition] = useState(false);

      return (
        <TestForm controller={controller}>
          {isDisplayed && !isSwitchedPosition && (
            <Field name={TestForm.FIELD_ONE_NAME} adapter={InputAdapter} persist={true} />
          )}
          <div>
            {isDisplayed && isSwitchedPosition && (
              <Field name={TestForm.FIELD_ONE_NAME} adapter={InputAdapter} persist={true} />
            )}
          </div>
          <button
            type="button"
            data-hook="toggle-visibility"
            onClick={() => {
              setIsDisplayed(!isDisplayed);
            }}
          >
            Toggle Visibility
          </button>
          <button
            type="button"
            data-hook="toggle-position"
            onClick={() => {
              setIsSwitchedPosition(!isSwitchedPosition);
            }}
          >
            Toggle Position
          </button>
        </TestForm>
      );
    });

    const wrapper = render(<Form />).container;
    const toggleVisibilityField = wrapper.querySelector(`[data-hook="toggle-visibility"]`)!;
    const togglePositionField = wrapper.querySelector(`[data-hook="toggle-position"]`)!;
    const fieldDriver = createInputAdapterDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

    fireEvent.click(toggleVisibilityField);

    fieldDriver.when.change('batman');

    fireEvent.click(toggleVisibilityField);

    expect(controller.API.values[TestForm.FIELD_ONE_NAME]).toBe(undefined);

    fireEvent.click(toggleVisibilityField);
    fireEvent.click(togglePositionField);

    expect(fieldDriver.get.value()).toBe('batman');
    expect(controller.API.values[TestForm.FIELD_ONE_NAME]).toBe('batman');
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

    const wrapper = render(<StatefulForm props={null} />).container;
    const fieldDriver = createInputAdapterDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});
    const toggleField = wrapper.querySelector(`[data-hook="toggle-field"]`)!;
    const NEW_VALUE = 'batman';

    fieldDriver.when.change(NEW_VALUE);

    fireEvent.click(toggleField);
    fireEvent.click(toggleField);

    expect(fieldDriver.get.value()).toBe('');
  });

  it('set custom state', async () => {
    const formController = new FormController({});

    expect(formController.API.getFieldMeta(TestForm.FIELD_ONE_NAME).customState).toEqual({});

    const wrapper = render(
      <TestForm>
        <Field name={TestForm.FIELD_ONE_NAME}>
          {(formagusProps) => (
            <InputAdapter
              {...formagusProps}
              customState={{
                customProperty: 'custom value',
              }}
            />
          )}
        </Field>
      </TestForm>,
    ).container;

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

    const wrapper = render(
      <TestForm controller={formController}>
        <Field name={NESTED_FIELD_NAME} adapter={InputAdapter} />
      </TestForm>,
    ).container;

    const fieldDriver = createInputAdapterDriver({wrapper, dataHook: NESTED_FIELD_NAME});

    fieldDriver.when.change(NEW_VALUE);

    await waitFor(wrapper)(() => {
      return formController.API.values[TestForm.FIELD_ONE_NAME][0].nested === NEW_VALUE;
    });
  });
});
