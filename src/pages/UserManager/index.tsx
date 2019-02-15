import * as React from 'react';
import BaseComponent from '@components/Base';

class About extends BaseComponent<{}, {}>{
  componentDidMount(){
    this.fetchData();
  }

  async fetchData() {
    const res = await this.$Get('/users', {
      page: 0,
      size: 10
    });
    console.log(res);
  }

  render() {
    return (
      <div>about</div>
    );
  }
}


export default About;