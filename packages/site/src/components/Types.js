import React from 'react';
import Modal from 'react-responsive-modal';
import {MarkdownPage} from './MarkdownPage';
import {BUTTON, PAGE_BACKGROUND} from '../theme';

const modalState = {
  isModalOpened: false,
  setModalState(state) {
    modalState.isModalOpened = state;
  },
};

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

  componentWillUnmount() {
    this.setState({
      isOpen: false,
    });
  }

  render() {
    const {type} = this.props;
    const {isOpen} = this.state;

    return (
      <Modal
        open={isOpen}
        onClose={this.onCloseModal}
        center={true}
        blockScroll={false}
        styles={{
          modal: {
            padding: '10px 50px',
            background: PAGE_BACKGROUND,
            maxWidth: '1000px',
          },
        }}
      >
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
