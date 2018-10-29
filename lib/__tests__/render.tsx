import * as React from 'react';
import {mount} from 'enzyme';
import {TestForm} from '../test/components/TestForm';
import {createTestFormDriver} from '../test/components/TestForm.driver';
import {InputAdapter} from '../test/components/InputAdapter';
import {Field} from '../src/Field';

test('Render', () => {
  const wrapper = mount(
    <TestForm>
      <Field name={TestForm.FIELD_ONE_NAME} adapter={InputAdapter} />
      <Field name={TestForm.FIELD_TWO_NAME}>
        {(props) => {
          return <InputAdapter {...props} />;
        }}
      </Field>
    </TestForm>,
  );
  const formDriver = createTestFormDriver({wrapper});

  expect(formDriver.get.serialized()).toMatchSnapshot();
});
