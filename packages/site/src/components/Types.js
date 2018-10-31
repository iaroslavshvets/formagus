import React from "react";
import Modal from 'react-responsive-modal';
import {MarkdownPage} from './MarkdownPage';

export class Types extends React.Component {
  state = {
    isOpen: true
  };

  onCloseModal = () => {
    this.setState({ isOpen: false }, () => {
      this.props.navigate('../../');
      location.reload(true);
    });
  };

  onClickBack = () => {
    history.back();
  };

  onClickNext = () => {
    history.forward();
  };

  render() {
    const {type} = this.props;
    const {isOpen} = this.state;

    return (
      <Modal open={isOpen} onClose={this.onCloseModal} center={true}>
        <div className="modal-navigation">
          <button className="back-button" onClick={this.onClickBack}>Back</button>
          <button className="next-button"onClick={this.onClickNext}>Next</button>
        </div>
        <MarkdownPage dir="api/types" filename={type}/>
      </Modal>
    )
  }
}
