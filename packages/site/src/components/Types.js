import React from 'react';
import Modal from 'react-responsive-modal';
import {MarkdownPage} from './MarkdownPage';
import {BUTTON} from '../theme';

export class Types extends React.Component {
  state = {
    isOpen: true,
  };

  onCloseModal = () => {
    this.setState({isOpen: false}, () => {
      this.props.navigate('../../');
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
      <Modal open={isOpen} onClose={this.onCloseModal} center={true} blockScroll={false}>
        <div className="modal-navigation">
          <button css={{...BUTTON, fontSize: '1.2em'}} onClick={this.onClickBack}>
            ◀ Back
          </button>
          <button css={{...BUTTON, fontSize: '1.2em'}} onClick={this.onClickNext}>
            Next ▶
          </button>
        </div>
        <MarkdownPage dir="api/types" filename={type} />
      </Modal>
    );
  }
}
