const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,

  // 添加菜单相关的状态
  init: state => state.menu.init,
  menuList: state => state.menu.menuList,
  buttonList: state => state.menu.buttonList
}
export default getters
