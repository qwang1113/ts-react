import React from 'react';

const Title = (props) => {
  const { text } = props;
  return (
    <div className="app-title">{text}</div>
  )
}

export default Title;