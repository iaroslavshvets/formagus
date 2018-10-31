import React from "react";
import {
  PAGE_BACKGROUND,
  SIDEBAR_SIZE,
  SMALL_BREAK,
  TOPBAR_SIZE
} from "../theme";
import { Nav } from "./Nav";

export class App extends React.Component {
  // componentDidMount() {
  //   const [,...pathParts] = location.pathname.split('/');
  //
  //   if (pathParts.length > 2) {
  //     history.replaceState('','', '/' + pathParts[0] + '/' + pathParts[1]);
  //   }
  // }

  render() {
    const {children} = this.props;
    return (
      <div>
        <Nav />
        <div
          css={{
            background: PAGE_BACKGROUND,
            minHeight: "100vw",
            marginLeft: SIDEBAR_SIZE,
            [SMALL_BREAK]: {
              marginLeft: 0,
              marginTop: TOPBAR_SIZE
            }
          }}
        >
          {children}
        </div>
      </div>
    );
  }
}
