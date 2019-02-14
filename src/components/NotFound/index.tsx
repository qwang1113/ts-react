import * as React from 'react';

import './index.less';

const goHome = () => {
  location.href = '/#/home';
}

const NotFound = () => {
  const [time, setTime] = React.useState(5);
  const inter = setInterval(() => {
    if (time === 1) {
      goHome();
    } else {
      setTime(time - 1);
    }
  }, 1000);
  React.useEffect(() => {
    return () => {
      clearInterval(inter);
    };
  });
  return (
    <div className="centered">
      <div className="emoji">😭</div>
      <p className="title">页面走丢了!</p>
      <p>{`哎呀, 真不好意思! ${time} 秒后自动`}<a href="javascript:;" onClick={goHome}>返回主页</a></p>
    </div>
  );
}

export default NotFound;
