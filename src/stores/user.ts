import { observable, action, computed } from "mobx";

class UserStore {
  @observable userinfo = {};

  @action
  setUserInfo = info => {
    this.userinfo = info;
  }

  // @computed get userName(){
  //   return this.userinfo.name;
  // }

}

export default new UserStore();

