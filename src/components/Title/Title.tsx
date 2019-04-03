import React from 'react';

interface ITitleProps {
  text?: string | JSX.Element
}

const Title = (props: ITitleProps) => {
  const { text } = props;
  return (
    <div className="app-title">{text}</div>
  )
}

export default Title;