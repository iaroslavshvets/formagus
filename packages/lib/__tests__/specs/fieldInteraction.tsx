import React, {useState} from 'react';
import {render, fireEvent, cleanup} from '@testing-library/react';
import {observer} from 'mobx-react';
import {get} from 'lodash';
import {Field, createFormController} from '../../src';
import {TestForm} from '../components/TestForm';
import {Input} from '../components/Input';
import {createInputDriver} from '../components/Input/createInputDriver';
import {eventually} from '../helpers/eventually';

describe('Field interactions', () => {
  afterEach(() => cleanup());

  it('should keep value if "persist=true"', async () => {
    const controller = createFormController({});

    const Form = observer(() => {
      const [isDisplayed, setIsDisplayed] = useState(false);
      const [isSwitchedPosition, setIsSwitchedPosition] = useState(false);

      return (
        <TestForm controller={controller}>
          {isDisplayed && !isSwitchedPosition && (
            <Field name={TestForm.FIELD_ONE_NAME} persist={true}>
              <Input />
            </Field>
          )}
          <div>
            {isDisplayed && isSwitchedPosition && (
              <Field name={TestForm.FIELD_ONE_NAME} persist={true}>
                <Input />
              </Field>
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
    const toggleVisibilityField = wrapper.querySelector('[data-hook="toggle-visibility"]')!;
    const togglePositionField = wrapper.querySelector('[data-hook="toggle-position"]')!;
    const fieldDriver = createInputDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

    // visible
    fireEvent.click(toggleVisibilityField);

    fieldDriver.when.change('batman');

    // hidden
    fireEvent.click(toggleVisibilityField);

    expect(controller.API.values[TestForm.FIELD_ONE_NAME]).toBe(undefined);

    // visible
    fireEvent.click(toggleVisibilityField);
    // switched position
    fireEvent.click(togglePositionField);

    expect(fieldDriver.get.value()).toBe('batman');
    expect(controller.API.values[TestForm.FIELD_ONE_NAME]).toBe('batman');
  });

  it('should not keep value', () => {
    class StatefulForm extends React.Component<{}, {hiddenField: boolean}> {
      constructor(props: {}) {
        super(props);
        this.state = {
          hiddenField: false,
        };
      }

      render() {
        const {hiddenField} = this.state;

        return (
          <TestForm>
            {!hiddenField && (
              <Field name={TestForm.FIELD_ONE_NAME}>
                <Input />
              </Field>
            )}
            <button
              type="button"
              data-hook="toggle-field"
              onClick={() => {
                this.setState((state) => ({
                  hiddenField: !state.hiddenField,
                }));
              }}
            >
              Toggle Field
            </button>
          </TestForm>
        );
      }
    }

    const wrapper = render(<StatefulForm />).container;
    const fieldDriver = createInputDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});
    const toggleField = wrapper.querySelector('[data-hook="toggle-field"]')!;
    const NEW_VALUE = 'batman';

    fieldDriver.when.change(NEW_VALUE);

    fireEvent.click(toggleField);
    fireEvent.click(toggleField);

    expect(fieldDriver.get.value()).toBe('');
  });

  it('set custom state', async () => {
    const formController = createFormController({});

    expect(formController.API.getFieldMeta(TestForm.FIELD_ONE_NAME).customState).toEqual({});

    const wrapper = render(
      <TestForm>
        <Field
          name={TestForm.FIELD_ONE_NAME}
          render={(formagusProps) => (
            <Input
              {...formagusProps}
              customState={{
                customProperty: 'custom value',
              }}
            />
          )}
        />
      </TestForm>,
    ).container;

    const fieldDriver = createInputDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

    fieldDriver.when.setCustomState();

    await eventually(() => {
      expect(fieldDriver.get.meta('customState:customProperty')).toBe('custom value');
    });
  });

  it('set nested value', async () => {
    const NESTED_FIELD_NAME = `${TestForm.FIELD_NESTED_NAME}[0].nested`;
    const NEW_VALUE = 'batman';
    const formController = createFormController({});

    const wrapper = render(
      <TestForm controller={formController}>
        <Field name={NESTED_FIELD_NAME}>
          <Input />
        </Field>
      </TestForm>,
    ).container;

    const fieldDriver = createInputDriver({wrapper, dataHook: NESTED_FIELD_NAME});

    fieldDriver.when.change(NEW_VALUE);

    await eventually(() => {
      expect(get(formController.API.values, `${TestForm.FIELD_NESTED_NAME}[0].nested`)).toBe(NEW_VALUE);
    });
  });
});
