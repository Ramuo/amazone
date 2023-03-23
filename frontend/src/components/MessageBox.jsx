import {Alert} from 'react-bootstrap';

function MessageBox({variant, children}) {
  return (
    <Alert variant={variant}>{children}</Alert>
  )
}

MessageBox.defaultProps = {
    variant: 'danger',
}
export default MessageBox;