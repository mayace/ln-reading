import React, { ReactNode } from "react";

export interface IModalProps {
  children?: unknown;
  onClose: () => void;
  contentText?: string;
}

export class ModalComponent extends React.Component<IModalProps> {
  contentElement: HTMLElement | null = null;

  componentDidMount(): void {
    const contentText = this.props.contentText?.trim() || "";
    if (contentText.length > 0 && this.contentElement) {
      this.updateHtmlContent(contentText);
    }
  }

  componentDidUpdate(prev: IModalProps): void {
    const prevContentText = prev.contentText?.trim() || "";
    const contentText = this.props.contentText?.trim() || "";
    if (prevContentText !== contentText) {
      this.updateHtmlContent(contentText);
    }
  }

  updateHtmlContent(html: string): void {
    if (this.contentElement) {
      this.contentElement.innerHTML = html;
    }
  }

  render(): ReactNode {
    return (
      <div className="modal is-active">
        <div className="modal-background"></div>
        <div ref={(item) => (this.contentElement = item)}>{this.props.children}</div>
        <a onClick={this.props.onClose} className="modal-close"></a>
      </div>
    );
  }
}
