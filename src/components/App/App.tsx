import { Button } from 'antd';
import * as React from 'react';

export default () => {

  const [count, setCount] = React.useState(0);

  return (
    <div className='main'>
      <Button 
        title="Button" 
        type="primary" 
        onClick={setCount.bind(null, count + 1)}
      >
        按钮{count}
      </Button>
    </div>
  )
}