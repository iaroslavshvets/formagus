import React from 'react';
import {Link, Match} from '@reach/router';
import {Logo} from './Logo';
import {BLACK, SMALL_BREAK, SMALL_BREAK_QUERY, SIDEBAR_SIZE, TOPBAR_SIZE, GREEN, BUTTON} from '../theme';
import Component from '@reactions/component';
import scrollIntoView from 'scroll-into-view-if-needed';
import Media from 'react-media';
import MenuIcon from '../public/images/menu_icon.svg';

export const Nav = () => (
  <Media query={SMALL_BREAK_QUERY}>
    {(isSmall) => (
      <Match path="*">
        {({location}) => (
          <Component
            initialState={{sidebarOpen: false}}
            isSmall={isSmall}
            location={location}
            didUpdate={({prevProps, state, setState}) => {
              if (state.sidebarOpen && (prevProps.location !== location || prevProps.isSmall !== isSmall)) {
                setState({sidebarOpen: false});
              }
            }}
          >
            {({state, setState}) => (
              <div>
                {isSmall && (
                  <div
                    css={{
                      background: BLACK,
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: TOPBAR_SIZE,
                    }}
                  >
                    <button
                      css={{
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                      }}
                      onClick={() =>
                        setState(({sidebarOpen}) => ({
                          sidebarOpen: !sidebarOpen,
                        }))
                      }
                    >
                      <MenuIcon
                        css={{
                          position: 'absolute',
                          transform: `scale(0.12) translateX(-375%) translateY(-400%)`,
                        }}
                      />
                    </button>
                  </div>
                )}
                <div
                  className="navigation-panel"
                  css={{
                    position: 'fixed',
                    top: 0,
                    bottom: 0,
                    overflow: 'auto',
                    width: SIDEBAR_SIZE,
                    borderRight: 'solid 3px black',
                    backgroundColor: BLACK,
                    color: '#e6e2a6',
                    ' a': {color: 'white'},
                    [SMALL_BREAK]: {
                      top: TOPBAR_SIZE,
                    },
                    transition: 'background-color 300ms, left 200ms',
                  }}
                  style={{
                    left: isSmall && !state.sidebarOpen ? -SIDEBAR_SIZE : 0,
                  }}
                >
                  <div css={{position: 'sticky', overflow: 'auto'}}>
                    <Logo />

                    <div css={{padding: 20}}>
                      <div css={{fontSize: '85%'}}>
                        v{LIB_VERSION} - <a href="https://github.com/iaroslavshvets/formagus">Github</a>
                      </div>

                      <Header>About</Header>

                      <NavLink to="./">Introduction</NavLink>
                      <NavLink to="installation">Installation</NavLink>
                      <NavLink to="comparison">Comparison to other form libraries</NavLink>

                      <Header>Recipes</Header>
                      <NavLink to="recipe/basic">Basic</NavLink>
                      <NavLink to="recipe/passingPropsToAdapter">
                        Passing custom props to Adapter as adapterProps
                      </NavLink>
                      <NavLink to="recipe/passingPropsToAdapterAsChild">
                        Passing custom props to Adapter from child render
                      </NavLink>
                      <NavLink to="recipe/withExternalController">With external controller</NavLink>
                      <NavLink to="recipe/dependantFields">Dependant field values</NavLink>
                      <NavLink to="recipe/validation">Form level validation</NavLink>
                      <NavLink to="recipe/fieldValidation">Field level validation</NavLink>
                      <NavLink to="recipe/validationOnSubmit">Validation on submit</NavLink>
                      <NavLink to="recipe/validationWithWarning">Validations with errors and warning</NavLink>
                      <NavLink to="recipe/fieldsDefinedOutsideOfForm">Field defined outside of form</NavLink>
                      <NavLink to="recipe/formatter">Values formatting</NavLink>
                      <NavLink to="recipe/persistingFieldState">Form with tabs and saving value upon switching</NavLink>
                      <NavLink to="recipe/nestedFields">Nested fields</NavLink>
                      <NavLink to="recipe/dynamicArray">Dynamic array of values</NavLink>

                      {/*TODO Uncomment later if needed*/}
                      {/*<Header>Tutorial</Header>*/}
                      {/*<NavLink to="tutorial/01-intro">Introduction</NavLink>*/}
                      {/*<NavLink to="tutorial/02-next-steps">Next steps</NavLink>*/}

                      <Header>API</Header>
                      <div
                        css={{
                          fontFamily: `'SFMono-Regular', Consolas, 'Roboto Mono', 'Droid Sans Mono', 'Liberation Mono', Menlo, Courier, monospace`,
                        }}
                      >
                        <NavLink to="api/Form">Form</NavLink>
                        <NavLink to="api/FormPart">FormPart</NavLink>
                        <NavLink to="api/FormController">FormController</NavLink>
                        <NavLink to="api/Field">Field</NavLink>
                        <NavLink to="api/injectFormApi">injectFormApi</NavLink>
                      </div>
                    </div>
                    <footer
                      css={{
                        fontSize: '66%',
                        marginTop: 60,
                        opacity: 0.66,
                        paddingLeft: '25px',
                      }}
                    >
                      <p>Copyright &copy; 2018 WIX</p>
                    </footer>
                  </div>
                </div>
              </div>
            )}
          </Component>
        )}
      </Match>
    )}
  </Media>
);

const Header = ({children}) => (
  <h2
    css={{
      fontWeight: '200',
      fontStyle: 'italic',
      fontSize: '100%',
      marginTop: 30,
      marginBottom: 10,
      opacity: 0.8,
    }}
  >
    {children}
  </h2>
);

const NavLink = ({to, ...props}) => (
  <Match path={to}>
    {({match}) => (
      <Component
        initialState={{refs: {node: null}}}
        didUpdate={({
          state: {
            refs: {node},
          },
        }) => {
          if (match) {
            scrollIntoView(node, {
              behavior: 'smooth',
              scrollMode: 'if-needed',
              block: 'nearest',
              inline: 'nearest',
            });
          }
        }}
      >
        {({state}) => (
          <div ref={(n) => (state.refs.node = n)}>
            <Link
              to={to}
              {...props}
              css={{
                textDecoration: 'none',
                display: 'block',
                padding: '5px 10px 5px 20px',
                fontSize: '85%',
                position: 'relative',
                ...(match
                  ? {
                      ':before': {
                        position: 'absolute',
                        content: '•',
                        left: 0,
                      },
                    }
                  : null),
                ':hover': {
                  textDecoration: 'underline',
                },
              }}
            />
          </div>
        )}
      </Component>
    )}
  </Match>
);
